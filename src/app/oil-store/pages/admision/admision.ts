import { Component, inject, signal } from '@angular/core';
import { CloseAttentionMock } from '../../../mock/lista-cierre.mock';
import { Router } from '@angular/router';
import { NgStyle, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admision',
  imports: [NgStyle, DatePipe],
  templateUrl: './admision.html',
})
export class Admision {
  lista_close_data = CloseAttentionMock.turno_dia;
  router = inject(Router);
  turno = signal<'iniciar' | 'cerrar' | 'iniciado'>('iniciar');
  ngOnInit(): void {
    this.turno.set((localStorage.getItem('attention-type') as 'iniciar' | 'cerrar') || 'iniciar');
    if (localStorage.getItem('attention-type') === 'iniciado') {
      this.turno.set('cerrar');
    }
    if (!localStorage.getItem('attention')) {
      localStorage.setItem('attention', JSON.stringify(this.lista_close_data));
    } else {
      this.lista_close_data = JSON.parse(localStorage.getItem('attention') || '[]');
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
    const fileName = `lista_${new Date().toISOString().slice(0, 10)}.csv`;

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
