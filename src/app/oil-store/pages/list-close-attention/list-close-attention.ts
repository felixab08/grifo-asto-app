import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedidorService, TurnoService } from '@oil-store/service';
import {
  MedidorListResponse,
  MedidorRequest,
  Turno,
  TurnoRequest,
  TurnoResponse,
  TurnoRegisterResponse,
} from '@oil-store/model';
import { AlertService } from 'src/app/service/alert.service';
import { StoreService } from 'src/app/service/store.service';
import { FormUtils } from '@utils/form.util';
import { addTotalTurnoMapper } from '../../../mapper/addTotalTurno.mapper';
import { SolesPipe } from '@pipes/soles.pipe';
import { CortePipe } from '@pipes/corte.pipe';

interface Medida {
  idMedida: number;
  idTurno: number;
  tipo: string;
  entrada: number;
  salida: number;
  code: string;
}

@Component({
  selector: 'app-list-close-attention',
  imports: [CommonModule, DatePipe, ReactiveFormsModule, SolesPipe, CortePipe],
  templateUrl: './list-close-attention.html',
  standalone: true,
})
export class ListCloseAttention {
  // Services
  private storeService = inject(StoreService);
  private medidorService = inject(MedidorService);
  private turnoService = inject(TurnoService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // State signals
  modalOpen = signal(false);
  checkButtonEdit = signal(false);
  turnoList = signal<Turno[] | null>(null);
  stateturno = signal<'iniciar' | 'cerrar' | 'iniciado'>('iniciar');
  checkTable = signal(false);

  // Form groups
  myForm: FormGroup = this.fb.group({
    obs: [''],
    sum: [0, [Validators.required]],
    rest: [0, [Validators.required]],
    fechaSalida: ['', [Validators.required]],
  });

  myFormMedida: FormGroup = this.fb.group({
    entrada: ['', [Validators.required, Validators.min(0)]],
    salida: ['', [Validators.required, Validators.min(0)]],
  });

  // Edit state
  editMedida = signal<MedidorListResponse | Medida | null>(null);
  editTurno = signal<Turno | null>(null);

  // Registro turno inicial
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

  // Computed
  formUtils = FormUtils;
  getModalTurnoRef = computed(
    () => document.querySelector('[data-modal="turno"]') as HTMLDialogElement | null,
  );
  getModalMedidaRef = computed(
    () => document.querySelector('[data-modal="medida"]') as HTMLDialogElement | null,
  );

  ngOnInit(): void {
    this.initializeState();
  }

  ngAfterViewInit(): void {
    this.loadTurnosIfPersonaExists();
  }

  private initializeState(): void {
    this.checkTable.set(false);

    this.storeService.user.subscribe((user: any) => {
      if (!user) return;
      const { email, role, ...personaData } = user;
      this.registroTurno.persona = personaData;
    });

    const attentionType = localStorage.getItem('attention-type') as
      | 'iniciar'
      | 'cerrar'
      | 'iniciado';
    this.stateturno.set(attentionType === 'iniciado' ? 'cerrar' : attentionType || 'iniciar');

    this.myForm.get('fechaSalida')?.setValue(this.formatToInputDate(new Date()));
  }

  private loadTurnosIfPersonaExists(): void {
    const personaId = this.registroTurno.persona.idPersona;
    if (personaId !== 0) {
      this.turnoList.set(null);
      this.listTurnoByPerson(personaId);
    }
  }

  // ![TODO] : no esta funcionando correctamente, revisar
  listTurnoByPerson(id: number): void {
    this.turnoService.getAllTurnosByIdPerson(id).subscribe({
      next: (resp: TurnoResponse) => {
        const turnoData = resp.data?.turnos?.[0]?.medidas?.[0]?.salida;
        this.verificateStateTurno(turnoData);
        this.turnoList.set(addTotalTurnoMapper(resp.data?.turnos));
        console.log(this.turnoList());
        this.checkTable.set(true);
      },
      error: () => {
        this.alertService.getAlert('Error', 'Error al obtener los turnos', 'error');
      },
    });
  }

  onSave(): void {
    if (this.stateturno() === 'iniciar') {
      this.turnoService.postRegisterTurnoByIdPersona(this.registroTurno).subscribe({
        next: (resp) => {
          this.alertService.getAlert('Turno Creado', 'Turno creado satisfactoriamente', 'success');
          this.navigateWithTurno(resp.idTurno);
        },
        error: () => {
          this.alertService.getAlert('Error', 'Error al registrar el turno', 'error');
        },
      });
    } else if (this.stateturno() === 'cerrar') {
      this.openModal(this.getModalTurnoRef());
    }
  }

  guardarObservaciones(): void {
    const turnoListData = this.turnoList();
    if (!turnoListData?.length) {
      this.alertService.getAlert('Error', 'No hay turnos para cerrar', 'error');
      return;
    }

    const turno = (this.editTurno() || turnoListData[0]) as Turno;
    const fechaInput = this.myForm.get('fechaSalida')?.value + 'T10:00:00';

    const turnoToUpdate: TurnoRegisterResponse = {
      idTurno: turno.idTurno,
      observaciones: this.myForm.get('obs')?.value || '',
      fechaEntrada: turno.fecha_entrada,
      fechaSalida: fechaInput ? new Date(fechaInput) : new Date(),
      persona: this.registroTurno.persona,
      sum: this.myForm.get('sum')?.value || 0,
      rest: this.myForm.get('rest')?.value || 0,
    };

    this.turnoService.putRegisterTurnoByIdPersona(turno.idTurno, turnoToUpdate).subscribe({
      next: (resp) => {
        this.alertService.getAlert('Turno Editado', 'Turno editado satisfactoriamente', 'success');

        if (this.editTurno()) {
          this.editTurno.set(null);
          this.listTurnoByPerson(this.registroTurno.persona.idPersona);
          return;
        }

        const medidas = this.turnoList()?.[0].medidas;
        if (medidas) {
          localStorage.setItem('registro', JSON.stringify(medidas));
        }
        this.navigateWithTurno(turno.idTurno);
      },
      error: () => {
        this.alertService.getAlert('Error', 'Error al actualizar el turno', 'error');
      },
    });
  }

  navigateWithTurno(idturno: number): void {
    localStorage.setItem('attention-type', 'iniciar');
    this.router.navigate(['/grifo/register-close-attention', this.stateturno(), idturno]);
  }

  editAtention(turno: Turno): void {
    if (!turno.fecha_salida) {
      console.warn('Turno sin fecha de salida');
      return;
    }
    this.editTurno.set(turno);
    this.openModal(this.getModalTurnoRef());
    this.myForm.patchValue({
      obs: turno.observaciones,
      sum: turno.sum,
      rest: turno.rest,
      fechaSalida: this.formatToInputDate(turno.fecha_salida),
    });
  }

  handerMedidas(item: any, lista: any): void {
    if (item.code === 'subtotal' || item.code === 'total' || !lista.fecha_salida) {
      this.checkButtonEdit.set(false);
      return;
    }
    this.editMedida.set(item);
    this.checkButtonEdit.set(true);
    this.myFormMedida.patchValue({
      entrada: item.entrada,
      salida: item.salida,
    });
  }

  openModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      dialog.showModal?.();
      this.modalOpen.set(true);
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }

  closeModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      dialog.close?.();
      this.modalOpen.set(false);
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }

  openModalMedida(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    dialog.showModal?.();
    this.checkButtonEdit.set(true);
  }

  closeModalMedida(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    dialog.close?.();
    this.checkButtonEdit.set(false);
    this.editMedida.set(null);
    this.myFormMedida.reset();
  }

  verificateStateTurno(value: number | undefined): void {
    if (value === undefined) {
      localStorage.setItem('attention-type', 'cerrar');
      this.stateturno.set('cerrar');
    } else {
      localStorage.setItem('attention-type', 'iniciar');
    }
  }

  generateMedida(): void {
    const editData = this.editMedida();
    const formValue = this.myFormMedida.value;

    if (!editData) {
      console.error('No hay medida seleccionada');
      return;
    }

    const medidaToUpdate: MedidorRequest = {
      ...editData,
      entrada: formValue.entrada || 0,
      salida: formValue.salida || 0,
      turno: { idTurno: editData.idTurno },
    };

    this.medidorService.putMedidaByTurno(editData.idMedida, medidaToUpdate).subscribe({
      next: () => {
        this.alertService.getAlert(
          'Medida Modificada',
          'Medida Modificada satisfactoriamente',
          'success',
        );
        this.listTurnoByPerson(this.registroTurno.persona.idPersona);
        this.closeModalMedida(this.getModalMedidaRef());
      },
      error: () => {
        this.alertService.getAlert('Error', 'Error al modificar el medidor', 'error');
      },
    });
  }

  private formatToInputDate(dateLike: Date | string | null): string {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
