import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { APP_CONFIG } from 'src/app/app.config';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ILoginType } from 'src/app/models/login-type';
import { GeneralResponse } from 'src/shared/general-response';
import { IUser } from 'src/app/models/user';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login', 'createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should redirect to /todo on successful login', () => {
    const fakeResponse: GeneralResponse<ILoginType> = {
      success: true,
      data: { email: 'test@mail.com', token: 'token', refreshToken: 'refreshToken' },
      error: undefined
    };
    loginServiceSpy.login.and.returnValue(of(fakeResponse));
    component.email = 'test@mail.com';
    component.onSubmit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo']);
  });

  it('should call createUser if login returns 404', () => {
    loginServiceSpy.login.and.returnValue(throwError({ status: 404 }));
    const createUserSpy = spyOn(component, 'createUser').and.stub();
    component.email = 'notfound@mail.com';
    component.onSubmit();
    expect(createUserSpy).toHaveBeenCalledWith('notfound@mail.com');
  });

  it('should login and redirect after user creation confirmation', async () => {
    const SwalImport = await import('sweetalert2/dist/sweetalert2.all.js');
    const originalFire = SwalImport.default.fire;
    SwalImport.default.fire = () => Promise.resolve({ isConfirmed: true }) as any;
    try {
      const fakeResponse: GeneralResponse<ILoginType> = {
        success: true,
        data: { email: 'nuevo@mail.com', token: 'token', refreshToken: 'refreshToken' },
        error: undefined
      };
      const fakeUser: IUser = 
        { 
          id: 'a06dcce0-938b-4343-b283-4a3cb8d37e9f', 
          email: 'nuevo@mail.com', 
          createdAt: new Date() 
        };
      loginServiceSpy.createUser.and.returnValue(of(fakeUser));
      loginServiceSpy.login.and.returnValue(of(fakeResponse));
      component.email = 'nuevo@mail.com';
      await component.createUser('nuevo@mail.com');
      expect(loginServiceSpy.createUser).toHaveBeenCalledWith('nuevo@mail.com');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo']);
    } finally {
      // Restaurar Swal.fire original después del test
      SwalImport.default.fire = originalFire;
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error if email is invalid', () => {
    component.email = 'invalid-email';
    component.onSubmit();
    expect(component.error).toBe('Por favor ingresa un correo electrónico válido.');
  });
});
