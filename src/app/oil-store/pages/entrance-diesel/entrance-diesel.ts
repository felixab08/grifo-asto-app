import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';
import { AlertService } from 'src/app/service/alert.service';
import { EntradaCombustibleService } from '@oil-store/service';
import { Persona } from '@oil-store/model';
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
  storeService = inject(StoreService);
  persona: Persona | null = null;
  private _combustibleService = inject(EntradaCombustibleService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    tipo: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.storeService.user.subscribe((user: any) => {
      this.persona = user;
    });
  }

  handlerNewMeassure() {}

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let combustible = this.myForm.value;
    combustible.persona = { idPersona: this.persona?.idPersona };
    this._combustibleService.postEntradas(combustible).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Medición creada',
          'Medición creada satisfactoriamente',
          'success'
        );
        this.listaEntranse.reload();
        this.myForm.reset();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al crear la medición', 'error');
        return;
      },
    });
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
}
