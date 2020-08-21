import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth';
import { ErrorMessage } from '../interfaces/error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}

  login(
    operatorid: string,
    username: string,
    password: string
  ): Observable<AuthResponse> {
    const url = 'https://api.soracom.io/v1/auth';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<AuthResponse>(
        url,
        JSON.stringify({
          operatorId: operatorid,
          userName: username,
          password,
          tokenTimeoutSeconds: 36000,
        }),
        httpOptions
      )
      .pipe(
        map((response: AuthResponse) => {
          const token = response.token;
          const apiKey = response.apiKey;
          const userName = response.userName;
          const operatorId = response.operatorId;
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('userName', userName);
            localStorage.setItem('operatorId', operatorId);
          }
          return response;
        }),
        // catchError(this.handleError)
        catchError((err) => {
          return this.handleError(err);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('userName');
    localStorage.removeItem('operatorId');
    localStorage.removeItem('vpgId');
    localStorage.removeItem('coverageType');
    this.router.navigate(['login']);
  }

  removeLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('userName');
    localStorage.removeItem('operatorId');
    localStorage.removeItem('vpgId');
    localStorage.removeItem('coverageType');
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status} `);
    }
    return throwError(error);
  }
}
