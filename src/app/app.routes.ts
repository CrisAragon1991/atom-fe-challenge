import { Routes } from "@angular/router";
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./modules/example-page/example-page.component').then((m) => m.ExamplePageComponent)
    },
    {
        path: 'todo',
        loadComponent: () => import('./modules/todo/todo.component').then(m => m.TodoComponent),
        canActivate: [authGuard]
    }
];
