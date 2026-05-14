import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminStore } from '../../stores/admin.store';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  adminStore = inject(AdminStore);
}
