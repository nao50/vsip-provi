import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { VpgService } from '../services/vpg.service';
import { from, EMPTY, throwError, of } from 'rxjs';
import { mergeMap, tap, catchError } from 'rxjs/operators';
import { CoverageType } from '../interfaces/coverageType';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage = '';
  coverageTypes: CoverageType[] = [
    { value: 'jp', viewValue: 'Japan' },
    { value: 'g', viewValue: 'Global' },
  ];

  loginformgroup = this.formBuilder.group({
    operatorid: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    vpgid: ['', [Validators.required]],
    coverageType: ['jp', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private vpgService: VpgService
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService
      .login(
        this.loginformgroup.value.operatorid,
        this.loginformgroup.value.username,
        this.loginformgroup.value.password
      )
      .subscribe(
        () => {
          this.vpgService
            .getVirtualPrivateGateway(
              this.loginformgroup.value.vpgid,
              this.loginformgroup.value.coverageType
            )
            .subscribe(
              () => {
                this.loading = false;
                localStorage.setItem('vpgId', this.loginformgroup.value.vpgid);
                localStorage.setItem(
                  'coverageType',
                  this.loginformgroup.value.coverageType
                );
                this.router.navigate([
                  'vpg/' + this.loginformgroup.value.vpgid,
                ]);
              },
              (vpgError) => {
                this.loading = false;
                console.log('getVirtualPrivateGateway error: ', vpgError);
                this.errorMessage = 'VPG not found.';
                this.authService.removeLocalStorage();
              }
            );
        },
        (loginError) => {
          this.loading = false;
          console.log('login error: ', loginError);
          this.errorMessage = 'Authentication failure.';
        }
      );
  }

  logout(): void {
    this.authService.logout();
  }
}
