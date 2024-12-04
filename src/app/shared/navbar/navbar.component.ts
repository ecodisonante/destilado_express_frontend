import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Componente encargado de manejar la barra de navegación.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  logoClass: string = 'bar-logo-off';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((authStatus: boolean) => { this.isAuthenticated = authStatus; });
    this.authService.isAdmin.subscribe((adminStatus: boolean) => { this.isAdmin = adminStatus; });
  }

  salir() {
    this.authService.logOut();
    Swal.fire({
      icon: "success",
      title: "Vuelve pronto !!",
    }).then(() => {
      this.router.navigate(['/']);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 130) {
      this.logoClass = 'bar-logo-on';
    } else {
      this.logoClass = 'bar-logo-off';
    }
  }

}
