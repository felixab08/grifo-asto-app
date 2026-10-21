import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layou',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './auth-layou.component.html',
})
export class AuthLayouComponent {}
