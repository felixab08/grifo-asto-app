import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';
import { EntranceMock } from '../../../mock/entrada.mock';
import { AlertService } from 'src/app/service/alert.service';
import { EntradaCombustibleService } from '@oil-store/service';
import { CombustibleResponse } from '@oil-store/model';

@Component({
  selector: 'app-entrance-diesel',
  imports: [ReactiveFormsModule, CommonModule, DatePipe],
  templateUrl: './entrance-diesel.html',
})
export class EntranceDiesel {
  listaEntranse = signal<CombustibleResponse | null>(null);
  formUtils = FormUtils;

  private _combustibleService = inject(EntradaCombustibleService);
  private _alertService = inject(AlertService);

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    tipo: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
  });
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listMedition();
  }

  handlerNewMeassure() {}

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let combustible = this.myForm.value;
    combustible.persona = { idPersona: 1 };
    await this._combustibleService.postEntradas(combustible).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Medición creada',
          'Medición creada satisfactoriamente',
          'success'
        );
        this.listaEntranse()?.data.unshift(resp);
        this.myForm.reset();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al crear la medición', 'error');
        return;
      },
    });
  }

  listMedition() {
    this._combustibleService.getAllEntradas().subscribe({
      next: (resp) => {
        console.log(resp);
        this.listaEntranse.set(resp);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al obtener la lista', 'error');
      },
    });
  }
}
