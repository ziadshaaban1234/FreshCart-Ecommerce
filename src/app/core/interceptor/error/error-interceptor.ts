import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  //Request
  const platformID = inject(PLATFORM_ID);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  //Response
  return next(req).pipe(catchError((err) => {
    if (isPlatformBrowser(platformID)) {
      if (err.status === 401 && err.statusText === 'Unauthorized') {
        toastr.warning('You are not logged in 👀. Please login to get access ', 'Oops!');
        router.navigate(['/login']);
      }
      else {
        toastr.error(err.error?.message || 'Something went wrong', 'Error');
      }
    }
    // return EMPTY;
    return throwError(() => err);
  }));//Response
};
