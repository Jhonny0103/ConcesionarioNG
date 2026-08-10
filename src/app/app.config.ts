import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// Añadido, permite consumir apis.
import {provideHttpClient} from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(), // Para diálogos, animaciones y desplegables
    providePrimeNG({
      theme: {
        preset: Aura// Tema visual predeterminado
      }
    })
  ]
};

//Comandos usados para instalar primeng y primeicons:
// npm install primeng@^20.0.0 @primeng/themes primeicons --legacy-peer-deps
