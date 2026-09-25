import { Component, inject } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-header',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {

  private authService = inject(AuthService);

  private router = inject(Router);

  sair(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}