import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations'
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptor/loading/loading-interceptor';
import { headersInterceptor } from './core/interceptor/headers/headers-interceptor';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './core/interceptor/error/error-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(), // Toastr providers
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor, headersInterceptor,errorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })), provideClientHydration(withEventReplay())
  ]
};
