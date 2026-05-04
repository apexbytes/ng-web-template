import { Component } from '@angular/core';
import { HeaderComponent } from '@components/partials/header/header.component';
import { FooterComponent } from '@components/partials/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './public.layout.html',
  styleUrl: './public.layout.css',
})
export class PublicLayout {}
