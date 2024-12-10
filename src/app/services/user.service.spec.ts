import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockToken = 'mock-jwt-token';
  const mockUser: User = { nombre: 'John Doe', email: 'john.doe@example.com', password: 'password' } as User;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy.getToken.and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user list', () => {
    const mockUsers: User[] = [mockUser];

    service.getUserList().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(service['usuariosUrl']);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockUsers);
  });

  it('should get user by id', () => {
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service['usuariosUrl']}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockUser);
  });

  it('should recover user password', () => {
    const email = 'john.doe@example.com';

    service.recover(email).subscribe(response => {
      expect(response).toBe('Recovery email sent');
    });

    const req = httpMock.expectOne(`${service['usuariosUrl']}/recover?email=${email}`);
    expect(req.request.method).toBe('POST');
    req.flush('Recovery email sent');
  });

  it('should create a new user', () => {
    service.createUser(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(service['usuariosUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should update a user', () => {
    const updatedUser = { ...mockUser, name: 'Jane Doe' };

    service.updateUser(1, updatedUser).subscribe(response => {
      expect(response).toBe('User updated');
    });

    const req = httpMock.expectOne(`${service['usuariosUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush('User updated');
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe(response => {
      expect(response).toBeNull(); // revisar
    });

    const req = httpMock.expectOne(`${service['usuariosUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });
});
