import { Component, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgStyle, DatePipe, NgClass } from '@angular/common';
import { AlertService } from 'src/app/service/alert.service';
import { PersonaService, TurnoService } from '@oil-store/service';
import { ContentTurno, OptionsRequest, Persona, PersonaResponse } from '@oil-store/model';
import { CortePipe, SolesPipe } from '@pipes/index';
import { LinkParamService } from 'src/app/service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';

@Component({
  selector: 'app-admision',
  imports: [NgStyle, DatePipe, NgClass, SolesPipe, CortePipe, PaginationComponent],
  templateUrl: './admision.html',
})
export class Admision {
  private _persona = inject(PersonaService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);

  listPersonaData = signal<PersonaResponse | null>(null);
  _turnoService = inject(TurnoService);
  turnoList = signal<ContentTurno[] | any>(null);
  router = inject(Router);
  Idpersona = signal(0);
  activePage = linkedSignal(this.Idpersona);

  ngOnInit(): void {
    this.listPersona();
  }

  turnoResorce = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      id: this.Idpersona(),
    }),
    stream: ({ params }) => {
      return (
        this._turnoService.getAllTurnosByIdPerson({
          id: params.id,
          page: params.page,
          size: params.size,
        }) || {}
      );
    },
  });

  listPersona() {
    this._persona.getAllPerson({ page: 0, size: 10 }).subscribe({
      next: (resp: any) => {
        this.listPersonaData.set(resp);
      },
      error: (err: any) => {
        this._alertService.getAlert('Error al obtener la lista de personas', err);
      },
    });
  }

  changePerson(event: Event): void {
    const idPersona = Number((event.target as HTMLSelectElement).value);

    if (Number.isInteger(idPersona) && idPersona > 0) {
      this.Idpersona.set(idPersona);
    }
  }

  descargarXLS(): void {
    // Lee la tabla HTML y genera un CSV con BOM UTF-8 (Excel lo abre correctamente)
    const table = document.querySelector<HTMLTableElement>('#simpleTable1');
    if (!table) {
      console.warn('Tabla no encontrada: #simpleTable1');
      return;
    }

    const rows = Array.from(table.querySelectorAll('tr'));
    const csvRows: string[] = [];

    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll('th, td'));
      const values = cells.map((cell) => {
        let text = (cell.textContent || '').trim();
        // escapar comillas duplicándolas según CSV RFC
        text = text.replace(/"/g, '""');
        // envolver en comillas si contiene comas, saltos de línea o comillas
        if (/[,"\n]/.test(text)) {
          return `"${text}"`;
        }
        return text;
      });
      csvRows.push(values.join(','));
    }

    // prefijo BOM para que Excel reconozca UTF-8 correctamente
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `lista_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // descarga compatible con navegadores
    if ((navigator as any).msSaveBlob) {
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
