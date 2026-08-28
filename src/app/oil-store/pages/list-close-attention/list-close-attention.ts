import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedidorService, TurnoService } from '@oil-store/service';
import {
  MedidorListResponse,
  MedidorRequest,
  TurnoRequest,
  TurnoRegisterResponse,
  ContentTurno,
} from '@oil-store/model';
import { AlertService } from 'src/app/service/alert.service';
import { StoreService } from 'src/app/service/store.service';
import { FormUtils } from '@utils/form.util';
import { SolesPipe } from '@pipes/soles.pipe';
import { CortePipe } from '@pipes/corte.pipe';
import { rxResource } from '@angular/core/rxjs-interop';
import { LinkParamService } from 'src/app/service';
import { Idpersona } from '../../model/medir.interface';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';

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
  imports: [CommonModule, DatePipe, ReactiveFormsModule, SolesPipe, CortePipe, PaginationComponent],
  templateUrl: './list-close-attention.html',
  standalone: true,
})
export class ListCloseAttention {
  // Services
  private storeService = inject(StoreService);
  private medidorService = inject(MedidorService);
  private turnoService = inject(TurnoService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  _linkService = inject(LinkParamService);
  // State signals
  modalOpen = signal(false);
  checkButtonEdit = signal(false);
  turnoList = signal<ContentTurno[] | null>(null);
  Idpersona = signal(0);
  // Formulario para cerrar turno
  myForm: FormGroup = this.fb.group({
    obs: [''],
    sum: [0, [Validators.required]],
    rest: [0, [Validators.required]],
    fechaSalida: ['', [Validators.required]],
  });

  // formulario para editar medidas
  myFormMedida: FormGroup = this.fb.group({
    entrada: ['', [Validators.required, Validators.min(0)]],
    salida: ['', [Validators.required, Validators.min(0)]],
  });

  // Edit state
  editMedida = signal<MedidorListResponse | Medida | null>(null);
  editTurno = signal<ContentTurno | null>(null);

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

  private initializeState(): void {
    this.storeService.user.subscribe((user: any) => {
      if (!user) return;
      const { email, role, ...personaData } = user;
      this.registroTurno.persona = personaData;
      this.Idpersona.set(user.idPersona);
    });
  }

  turnoResorce = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      id: this.Idpersona(),
    }),
    stream: ({ params }) => {
      return (
        this.turnoService.getAllTurnosByIdPerson({
          id: params.id,
          page: params.page,
          size: params.size,
        }) || {}
      );
    },
  });

  guardarObservaciones(): void {
    const turno = this.editTurno() as ContentTurno;

    const turnoToUpdate: TurnoRegisterResponse = {
      idTurno: turno.idTurno,
      observaciones: this.myForm.get('obs')?.value || '',
      fechaSalida: this.myForm.get('fechaSalida')?.value,
      persona: this.registroTurno.persona,
      sum: this.myForm.get('sum')?.value || 0,
      rest: this.myForm.get('rest')?.value || 0,
    };

    this.turnoService.putRegisterTurnoByIdPersona(turno.idTurno, turnoToUpdate).subscribe({
      next: (resp) => {
        this.alertService.getAlert('Turno Editado', 'Turno editado satisfactoriamente', 'success');
        this.turnoResorce.reload();
        if (this.editTurno()) {
          this.editTurno.set(null);
          return;
        }

        const medidas = this.turnoList()?.[0].medidas;
        if (medidas) {
          localStorage.setItem('registro', JSON.stringify(medidas));
        }
      },
      error: () => {
        this.alertService.getAlert('Error', 'Error al actualizar el turno', 'error');
      },
    });
  }

  editAtention(turno: ContentTurno): void {
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
      fechaSalida: turno.fecha_salida,
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
        this.turnoResorce.reload();
        this.closeModalMedida(this.getModalMedidaRef());
      },
      error: () => {
        this.alertService.getAlert('Error', 'Error al modificar el medidor', 'error');
      },
    });
  }

}
