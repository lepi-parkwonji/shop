import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { WideBannerComponent } from '../wide-banner/wide-banner.component';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, TopBarComponent, FooterComponent, WideBannerComponent],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {}
