import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CloseAttentionMock, ListCloseAttentionMock } from '../../../mock/lista-cierre.mock';

@Component({
  selector: 'app-list-close-attention',
  imports: [],
  templateUrl: './list-close-attention.html',
})
export class ListCloseAttention {
  lista_close_data = CloseAttentionMock.turno_dia;
}
