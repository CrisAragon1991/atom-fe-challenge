import { ApplicationConfig, InjectionToken, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from "../environments/environment";
import { routes } from "./app.routes";
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const APP_CONFIG = new InjectionToken<typeof environment>("app.config");

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        importProvidersFrom(HttpClientModule),
        { provide: APP_CONFIG, useValue: environment },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ]
};
