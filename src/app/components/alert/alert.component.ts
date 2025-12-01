import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { AlertI } from '@interface/alert.interface';

@Component({
  selector: 'tyn-alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  alertMenu = input.required<AlertI>();
}
