/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthenticationService ){}

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

   // Easy access for form fields
  get email() {
    return this.credentialForm.get('email');
  }

  get password() {
    return this.credentialForm.get('password');
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService
      .login(this.credentialForm.value)
      .then(
        async (res) => {
          loading.dismiss();
          const user = await this.authService.login(this.credentialForm.value);
          this.checkUserIsVerified(user.user);
        },
        async (err) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: ':(',
            message: err.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
  }

  register(){
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  recoverPassword(){
    this.router.navigateByUrl('/recover-password', { replaceUrl: true });
  }

  private checkUserIsVerified(user) {
    if (user && user.emailVerified) {
      this.router.navigateByUrl('/photo', { replaceUrl: true });
      
    } else if (user){
      this.router.navigateByUrl('/verification-email', { replaceUrl: true });
    } else{
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }
}
