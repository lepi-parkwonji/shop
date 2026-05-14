import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './top-bar.component';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, TopBarComponent],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {}
