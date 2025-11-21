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
}
