import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormUtils } from '../../../utils/form.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DieselPipe, PremiumPipe, RegularPipe } from '../../../pipes';
import { MedirService } from '@oil-store/service';
import { AlertService } from 'src/app/service/alert.service';
import { LinkParamService } from 'src/app/service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';

@Component({
  selector: 'app-measurement',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DieselPipe,
    RegularPipe,
    PremiumPipe,
    DatePipe,
    PaginationComponent,
  ],
  templateUrl: './measurement.html',
})
export class Measurement {
  formUtils = FormUtils;

  private _medirService = inject(MedirService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    diesel: ['', [Validators.required]],
    regular: ['', [Validators.required]],
    premiun: ['', [Validators.required]],
  });

  handlerNewMeassure() {}

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let sendMeassure = this.myForm.value;
    sendMeassure.idpersona = { idPersona: 1 };
    await this._medirService.postMedition(sendMeassure).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Medición creada',
          'Medición creada satisfactoriamente',
          'success'
        );
        this.listaMeasure.reload();
        this.myForm.reset();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al crear la medición', 'error');
        return;
      },
    });
  }
  listaMeasure = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
    }),
    stream: ({ params }) => {
      return this._medirService.getAllMedidas({
        page: params.page,
        size: params.size,
      });
    },
  });
}
