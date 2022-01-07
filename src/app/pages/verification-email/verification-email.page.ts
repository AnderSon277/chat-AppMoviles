import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../services/authentication.service';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.page.html',
  styleUrls: ['./verification-email.page.scss'],
  providers: [AuthenticationService]
})

export class VerificationEmailPage implements OnDestroy {
  public user$: Observable<User> = this.authService.afAuth.user;

  constructor(
    private router: Router,
    private authService: AuthenticationService) {}

  onSendEmail(): void {
    this.authService.sendVerificationEmail();
  }

  ngOnDestroy() {
    this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
