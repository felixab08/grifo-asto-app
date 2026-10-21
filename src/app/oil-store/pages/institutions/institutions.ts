import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-institutions',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="body-primary"><div class="body-secondary"><router-outlet /></div></div>',
})
export default class Institutions {}
