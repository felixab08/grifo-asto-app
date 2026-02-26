import { DatePipe, NgStyle, NgClass } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MedidorService, TurnoService } from '@oil-store/service';
import {
  Medida,
  MedidorListResponse,
  MedidorRequest,
  Turno,
  TurnoRequest,
  TurnoResponse,
} from '@oil-store/model';
import { AlertService } from 'src/app/service/alert.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { StoreService } from 'src/app/service/store.service';
import { FormUtils } from '@utils/form.util';
import { addTotalTurnoMapper } from '../../../mapper/addTotalTurno.mapper';
import { SolesPipe } from '@pipes/soles.pipe';
import { CortePipe } from '@pipes/corte.pipe';

@Component({
  selector: 'app-list-close-attention',
  imports: [
    NgStyle,
    DatePipe,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    NgClass,
    SolesPipe,
    CortePipe,
  ],
  templateUrl: './list-close-attention.html',
})
export class ListCloseAttention {
  storeService = inject(StoreService);
  formUtils = FormUtils;

  @ViewChild('modalTurnoRef') modalTurnoRef!: ElementRef;
  @ViewChild('modalMedidaRef') modalMedidaRef!: ElementRef;
  modalOpen = signal(false);
  checkButtonEdit = signal(false);
  editMedidar = signal<MedidorListResponse | Medida>({
    idMedida: 0,
    idTurno: 0,
    tipo: '',
    entrada: 0,
    salida: 0,
    code: '',
  });
  observaciones = '';
  router = inject(Router);
  stateturno = signal<'iniciar' | 'cerrar' | 'iniciado'>('iniciar');
  turnoList = signal<TurnoResponse | null>(null);
  editTurno = signal<Turno | null>(null);
  private _medidorService = inject(MedidorService);
  _turnoService = inject(TurnoService);
  public _alertService = inject(AlertService);

  registroTurno: TurnoRequest = {
    fechaEntrada: new Date(),
    persona: {
      id: 0,
      idPersona: 0,
      nombre: 'x',
      apellido: 'x',
      telefono: '0',
      role: 'ROLE_TRABAJADOR',
      email: 'x',
    },
  };

  checkTable = signal(false);

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    obs: [''],
    sum: [0, [Validators.required]],
    rest: [0, [Validators.required]],
    fechaSalida: ['', [Validators.required]],
  });

  private formatToInputDate(dateLike: Date | string | null): string {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  myFormMedida: FormGroup = this._fb.group({
    entrada: [''],
    salida: [''],
  });
  ngOnInit(): void {
    this.checkTable.set(false);
    this.storeService.user.subscribe((user: any) => {
      const { email, role, ...personaData } = user!;
      this.registroTurno.persona = personaData;
    });
    this.stateturno.set(
      (localStorage.getItem('attention-type') as 'iniciar' | 'cerrar') || 'iniciar',
    );
    if (localStorage.getItem('attention-type') === 'iniciado') {
      this.stateturno.set('cerrar');
    }
    // Inicializar fechaSalida en formato yyyy-MM-dd para inputs type="date"
    this.myForm.get('fechaSalida')?.setValue(this.formatToInputDate(new Date()));
  }

  ngAfterViewInit(): void {
    if (this.registroTurno.persona.idPersona !== 0) {
      this.turnoList.set(null);
      this.listTurnoByPerson(this.registroTurno.persona.idPersona);
    }
  }
  listTurnoByPerson(id: number) {
    this._turnoService.getAllTurnosByIdPerson(id).subscribe({
      next: (resp: any) => {
        this.verificateStateTurno(resp.data[0].turnos[0]?.medidas[0]?.salida);
        const respWithTotal = addTotalTurnoMapper(resp);
        this.turnoList.set(respWithTotal);
        this.checkTable.set(true);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al obtener los turnos', 'error');
      },
    });
  }

  onSave() {
    if (this.stateturno() === 'iniciar') {
      this._turnoService.postRegisterTurnoByIdPersona(this.registroTurno).subscribe({
        next: (resp) => {
          this._alertService.getAlert('Turno Creado', 'Turno creado satisfactoriamente', 'success');
          this.handlerTurno(resp.idTurno);
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al registrar el usuario', 'error');
        },
      });
    }
    if (this.stateturno() === 'cerrar') {
      this.openModal(this.modalTurnoRef.nativeElement);
    }
  }

  guardarObservaciones() {
    const turnoListData = this.turnoList();
    if (!turnoListData || turnoListData.data[0].turnos.length === 0) {
      this._alertService.getAlert('Error!!!', 'No hay turnos para cerrar', 'error');
      return;
    }
    let turno = null;
    if (this.editTurno()) {
      turno = this.editTurno();
    } else {
      turno = turnoListData.data[0].turnos[0] as any;
    }
    const fechaInput = this.myForm.get('fechaSalida')?.value + 'T10:00:00'; // Agregar hora para evitar problemas de zona horaria
    turno.fechaSalida = fechaInput ? new Date(fechaInput).toISOString() : new Date().toISOString();
    turno.observaciones = this.myForm.get('obs')?.value || '';
    turno.sum = this.myForm.get('sum')?.value || 0;
    turno.rest = this.myForm.get('rest')?.value || 0;

    this._turnoService.putRegisterTurnoByIdPersona(turno.idTurno, turno).subscribe({
      next: (resp) => {
        this._alertService.getAlert('Turno editado', 'Turno editado satisfactoriamente', 'success');
        if (this.editTurno()) {
          this.listTurnoByPerson(this.registroTurno.persona.idPersona);
          return;
        }
        const listMedidas = this.turnoList()?.data[0].turnos[0].medidas;
        localStorage.setItem('registro', JSON.stringify(listMedidas));
        this.handlerTurno(turno.idTurno);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al registrar el usuario', 'error');
      },
    });
  }

  handlerTurno(idturno: number = 9) {
    localStorage.setItem('attention-type', 'iniciar');
    this.router.navigate(['/grifo/register-close-attention', this.stateturno(), idturno]);
  }

  editAtention(turno: Turno) {
    if (!turno.fecha_salida) return; // TODO: manejar error
    this.editTurno.set(turno);
    this.openModal(this.modalTurnoRef.nativeElement);
    this.myForm.patchValue({
      obs: turno.observaciones,
      sum: turno.sum,
      rest: turno.rest,
      fechaSalida: this.formatToInputDate(turno.fecha_salida),
    });
  }

  openModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.modalOpen.set(true);
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }

  closeModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      this.modalOpen.set(false);
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }

  verificateStateTurno(value: number | null) {
    if (value === null) {
      localStorage.setItem('attention-type', 'iniciado');
      this.stateturno.set('cerrar');
    } else {
      localStorage.setItem('attention-type', 'iniciar');
    }
  }

  handerMedidas(item: any, lista: any) {
    console.log(lista);

    if (item.code === 'subtotal' || item.code === 'total' || lista.fecha_salida === null) {
      this.checkButtonEdit.set(false);
      return;
    }
    this.editMedidar.set(item);
    this.checkButtonEdit.set(true);
    this.myFormMedida.get('entrada')?.setValue(item.entrada);
    this.myFormMedida.get('salida')?.setValue(item.salida);
  }

  openModalMedida(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.checkButtonEdit.set(true);
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }
  closeModalMedida(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      this.checkButtonEdit.set(false);
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }

  generateMedida() {
    if (this.editMedidar() !== null) {
      this.editMedidar().entrada = this.myFormMedida.get('entrada')?.value || 0;
      this.editMedidar().salida = this.myFormMedida.get('salida')?.value || 0;
    }
    this._medidorService
      .putMedidaByTurno(this.editMedidar().idMedida, this.editMedidar() as MedidorRequest)
      .subscribe({
        next: (resp) => {
          this._alertService.getAlert(
            'Medida Modificada',
            'Medida Modificada satisfactoriamente',
            'success',
          );
          this.listTurnoByPerson(this.registroTurno.persona.idPersona);
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al modificar el medidor', 'error');
          return;
        },
      });
    this.editMedidar.set({} as MedidorListResponse);
    this.checkButtonEdit.set(false);

    this.closeModalMedida(this.modalMedidaRef.nativeElement);
  }
}
