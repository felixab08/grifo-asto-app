import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgStyle, DatePipe, NgClass } from '@angular/common';
import { AlertService } from 'src/app/service/alert.service';
import { PersonaService, TurnoService } from '@oil-store/service';
import { ContentTurno, OptionsRequest, PersonaResponse, TurnoResponse } from '@oil-store/model';
import { addTotalTurnoMapper } from '../../../mapper/addTotalTurno.mapper';
import { CortePipe, SolesPipe } from '@pipes/index';

@Component({
  selector: 'app-admision',
  imports: [NgStyle, DatePipe, NgClass, SolesPipe, CortePipe],
  templateUrl: './admision.html',
})
export class Admision {
  private _persona = inject(PersonaService);
  private _alertService = inject(AlertService);
  listPersonaData = signal<PersonaResponse | null>(null);
  _turnoService = inject(TurnoService);
  turnoList = signal<ContentTurno[] | null>(null);

  router = inject(Router);
  turno = signal<'iniciar' | 'cerrar' | 'iniciado'>('iniciar');
  ngOnInit(): void {
    this.turno.set((localStorage.getItem('attention-type') as 'iniciar' | 'cerrar') || 'iniciar');
    if (localStorage.getItem('attention-type') === 'iniciado') {
      this.turno.set('cerrar');
    }
    this.listPersona();
  }

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

  listTurnoByPerson(options: OptionsRequest): void {
    this._turnoService.getAllTurnosByIdPerson(options).subscribe({
      next: (resp: any) => {
        this.turnoList.set(resp);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al obtener los turnos', 'error');
      },
    });
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
