import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { jwtDecode } from 'jwt-decode'; // Importación correcta
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockToken = 'mock-jwt-token';
  const decodedToken = { exp: Math.floor(Date.now() / 1000) + 3600, role: 'ADMIN', id: 1, name: 'Test User', sub: 'test@example.com' };

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['setItem', 'getItem', 'removeItem']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageServiceSpy.getItem.and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate and return a token', () => {
    const email = 'test@example.com';
    const password = 'password';
    const responseBody = { token: mockToken };

    service.authenticate(email, password).subscribe(response => {
      expect(response.token).toEqual(mockToken);
    });

    const req = httpMock.expectOne(service['authUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(responseBody);
  });

  it('should store token and update login status on logIn', () => {
    spyOn(service, 'isValidToken').and.returnValue(true);
    spyOn(service, 'checkAdmin').and.returnValue(true);

    service.logIn(mockToken);

    expect(storageServiceSpy.setItem).toHaveBeenCalledWith(service['tokenKey'], mockToken);
    expect(service.isValidToken).toHaveBeenCalled();
    expect(service.checkAdmin).toHaveBeenCalled();
  });

  it('should remove token and update login status on logOut', () => {
    service.logOut();

    expect(storageServiceSpy.removeItem).toHaveBeenCalledWith(service['tokenKey']);
  });

  it('should return the token from storage', () => {
    const token = service.getToken();
    expect(storageServiceSpy.getItem).toHaveBeenCalledWith(service['tokenKey']);
    expect(token).toEqual(mockToken);
  });

  it('should identify admin role correctly', () => {
    spyOn(service, 'isValidToken').and.returnValue(true);
    spyOn(service, 'decodeToken').and.returnValue(decodedToken);

    const isAdmin = service.checkAdmin();
    expect(isAdmin).toBeTrue();
  });

  it('should get token id correctly', () => {
    spyOn(service, 'decodeToken').and.returnValue(decodedToken);

    const id = service.getTokenId();
    expect(id).toEqual(decodedToken.id);
  });

  it('should get token name correctly', () => {
    spyOn(service, 'decodeToken').and.returnValue(decodedToken);

    const name = service.getTokenName();
    expect(name).toEqual(decodedToken.name);
  });

  it('should get token email correctly', () => {
    spyOn(service, 'decodeToken').and.returnValue(decodedToken);

    const email = service.getTokenEmail();
    expect(email).toEqual(decodedToken.sub);
  });

  it('should update login status observables correctly', () => {
    spyOn(service, 'isValidToken').and.returnValue(true);
    spyOn(service, 'checkAdmin').and.returnValue(true);

    service['loggedInBehaviour'].next(true);
    service['adminBehaviour'].next(true);

    service.isAuthenticated.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTrue();
    });

    service.isAdmin.subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });
});