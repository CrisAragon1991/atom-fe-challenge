import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { APP_CONFIG } from '../app.config';
import { environment } from 'src/environments/environment';
import { ILoginType } from '../models/login-type';
import { IUser } from '../models/user';
import { GeneralResponse } from '../../shared/general-response';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + 'users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoginService,
        { provide: APP_CONFIG, useValue: environment }
      ]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user', () => {
    const email = 'test@mail.com';
    const mockResponse: GeneralResponse<ILoginType> = {
      success: true,
      data: { email, token: 'token', refreshToken: 'refresh' }
    };
    service.login(email).subscribe(res => {
      expect(res.data).toBeDefined();
      expect(res.data?.email).toBe(email);
    });
    const req = httpMock.expectOne(apiUrl + '/search');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(mockResponse);
  });

  it('should create user', () => {
    const email = 'new@mail.com';
    const mockUser: IUser = { id: '1', email, createdAt: new Date() };
    service.createUser(email).subscribe(res => {
      expect(res.email).toBe(email);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(mockUser);
  });

  it('should refresh token', () => {
    const loginType: ILoginType = { email: 'test@mail.com', token: 'token', refreshToken: 'refresh' };
    localStorage.setItem('login', JSON.stringify(loginType));
    const mockResponse: GeneralResponse<ILoginType> = { success: true, data: loginType };
    service.refreshToken().subscribe(res => {
      expect(res.data.refreshToken).toBe('refresh');
    });
    const req = httpMock.expectOne(apiUrl + '/refresh-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'refresh' });
    req.flush(mockResponse);
    localStorage.removeItem('login');
  });
});
