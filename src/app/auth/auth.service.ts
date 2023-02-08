import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './auth.interfaces';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) { }

  singup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
      )
      .pipe(catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
    }));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpiationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpiationDate)
    )

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDoration = new Date(userData._tokenExpiationDate).getTime() - new Date().getTime();

      this.autoLogout(expirationDoration);
    }
  }

  logout() {
    this.user.next(null);
    // localStorage.clear();
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDoration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDoration)
  }

  private handleAuthentication(
    email: string,
    localId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      localId,
      token,
      expirationDate
    );

    this.user.next(user);
    this.autoLogout(expiresIn * 1000)

    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMassage: string = 'An unknown error occurred!';
    console.log(errorRes.error.error.message);

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMassage);
    }

    switch (errorRes.error.error.message) {
      case 'TOKEN_EXPIRED':
        errorMassage = `The user's credential is no longer valid.
          The user must sign in again.`;
        break;

      case 'USER_DISABLED':
        errorMassage = 'The user account has been disabled by an administrator.';
        break;

      case 'USER_NOT_FOUND':
        errorMassage = `The user corresponding to the refresh token was not found.
          It is likely the user was deleted.`;
        break;

      case 'API key not valid':
        errorMassage = 'Please pass a valid API key. (invalid API key provided)';
        break;

      case 'INVALID_REFRESH_TOKEN':
        errorMassage = `An invalid refresh token is provided.`;
        break;

      case 'Invalid JSON payload received':
        errorMassage = `Unknown name \\"refresh_tokens\\":
          Cannot bind query parameter. Field \'refresh_tokens\'
          could not be found in request message.`;
        break;

      case 'INVALID_GRANT_TYPE':
        errorMassage = 'the grant type specified is invalid.';
        break;

      case 'MISSING_REFRESH_TOKEN':
        errorMassage = 'no refresh token provided.';
        break;

      case 'EMAIL_NOT_FOUND':
        errorMassage = `There is no user record corresponding to this identifier.
          The user may have been deleted.`;
        break;

      case 'INVALID_PASSWORD':
        errorMassage = 'The password is invalid or the user does not have a password.';
        break;

      case 'USER_DISABLED':
        errorMassage = 'The user account has been disabled by an administrator.';
        break;

      case 'EMAIL_EXISTS':
        errorMassage = 'This email is already used!';
        break;

      default:
        break;
    }
    return throwError(errorMassage);
  }
}
