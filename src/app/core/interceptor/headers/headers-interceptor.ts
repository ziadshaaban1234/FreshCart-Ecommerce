import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID)
  if (isPlatformBrowser(platformId)) {
    // Retrieve token from Local Storage (if 'Remember Me' is enabled) or Session Storage (standard login)
    const token = localStorage.getItem('eCommerceToken') ?? sessionStorage.getItem('eCommerceToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          token: `${token}`
        }
      });
    }
  }
  return next(req);
};
