import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
  providers: [AuthenticationService]
})

export class RecoverPasswordPage {
  userEmail = new FormControl('');
  constructor(private authService: AuthenticationService, private router: Router , private fb: FormBuilder,) {}

  async onReset() {
    try {
      const email = this.userEmail.value;
      await this.authService.resetPassword(email);
      window.alert('Se ha enviado un link de recuperación a su correo electrónico!');
      this.router.navigateByUrl('/', { replaceUrl: true });
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
