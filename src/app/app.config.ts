import { ApplicationConfig, InjectionToken } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const APP_CONFIG = new InjectionToken<typeof environment>("app.config");

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        { provide: APP_CONFIG, useValue: environment }
    ]
};
