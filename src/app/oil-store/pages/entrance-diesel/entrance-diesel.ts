import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';
import { AlertService } from 'src/app/service/alert.service';
import { EntradaCombustibleService } from '@oil-store/service';
import { ICombustible, Persona } from '@oil-store/model';
import { StoreService } from 'src/app/service/store.service';
import { LinkParamService } from 'src/app/service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';

@Component({
  selector: 'app-entrance-diesel',
  imports: [ReactiveFormsModule, CommonModule, DatePipe, PaginationComponent],
  templateUrl: './entrance-diesel.html',
})
export class EntranceDiesel {
  formUtils = FormUtils;
  @ViewChild('modalEntradasRef') modalEntradasRef!: ElementRef;
  modalOpen = signal(false);
  typeDialog = signal<'Crear' | 'Editar'>('Crear');
  storeService = inject(StoreService);
  persona: Persona | null = null;
  private _combustibleService = inject(EntradaCombustibleService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    idEntrada: [0],
    tipo: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
    fechaEntrada: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.storeService.user.subscribe((user: any) => {
      this.persona = user;
    });
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let combustible = this.myForm.value;
    combustible.persona = { idPersona: this.persona?.idPersona };
    combustible.fechaEntrada = combustible.fechaEntrada + 'T10:00:00';
    if (this.typeDialog() === 'Crear') {
      delete this.myForm.value.idEntrada;
      this._combustibleService.postEntradas(combustible).subscribe({
        next: (resp: any) => {
          this._alertService.getAlert(
            'Entrada creada',
            'Entrada creada satisfactoriamente',
            'success',
          );
          this.listaEntranse.reload();
          this.myForm.reset();
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al crear la medición', 'error');
          return;
        },
      });
    } else {
      this._combustibleService.putEntradas(this.myForm.value.idEntrada, combustible).subscribe({
        next: (resp: any) => {
          this._alertService.getAlert(
            'Entrada editada',
            'Entrada editada satisfactoriamente',
            'success',
          );
          this.listaEntranse.reload();
          this.myForm.reset();
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al editar la medición', 'error');
          return;
        },
      });
    }
  }
  listaEntranse = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
    }),
    stream: ({ params }) => {
      // de Loader a Stream
      return this._combustibleService.getAllEntradas({
        page: params.page,
        size: params.size,
      });
    },
  });

  deleteEntrada(id: number) {
    this._combustibleService.deleteEntrada(id).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Entrada eliminada',
          'Entrada eliminada satisfactoriamente',
          'success',
        );
        this.listaEntranse.reload();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al eliminar la entrada', 'error');
        return;
      },
    });
  }
  openModal(item: ICombustible, dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.modalOpen.set(true);
      this.typeDialog.set(item ? 'Editar' : 'Crear');
      this.onEdit(item);
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
  onEdit(item: ICombustible) {
    this.myForm.patchValue({
      idEntrada: item.idEntrada,
      tipo: item.tipo,
      cantidad: item.cantidad,
      fechaEntrada: this.formatToInputDate(item.fechaEntrada),
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
