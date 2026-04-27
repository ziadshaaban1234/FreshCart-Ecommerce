import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('eCommerceToken') || sessionStorage.getItem('eCommerceToken');
    if (token) {

      authService.isLoggedInUser.set(!!token);
      return true;
    }
    else {
      toastr.warning('Please login first 👀', 'Oops!');
      return router.parseUrl('/home');//we don't use return false;
    }
  }
  else {
    return true;
  }
};
