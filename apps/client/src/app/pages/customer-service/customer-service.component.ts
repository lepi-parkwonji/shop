import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-service',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './customer-service.component.html',
})
export class CustomerServiceComponent {}
