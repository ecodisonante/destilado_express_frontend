// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { of, throwError } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LoginComponent } from './login.component';
// import { UserService } from '../../../services/user.service';
// import { CartService } from '../../../services/cart.service';
// import Swal from 'sweetalert2';
// import { User } from '../../../models/user.model';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;
//   let userService: jasmine.SpyObj<UserService>;
//   let cartService: jasmine.SpyObj<CartService>;
//   let router: jasmine.SpyObj<Router>;
//   let activatedRoute: ActivatedRoute;

//   beforeEach(async () => {
//     const userServiceSpy = jasmine.createSpyObj('UserService', ['findUser', 'logIn']);
//     const cartServiceSpy = jasmine.createSpyObj('CartService', ['setActiveCart']);
//     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//     const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule, LoginComponent],
//       providers: [
//         { provide: UserService, useValue: userServiceSpy },
//         { provide: CartService, useValue: cartServiceSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: ActivatedRoute, useValue: activatedRouteSpy }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
//     cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
//     router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

//     userService.findUser.and.returnValue(of(undefined));

//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize the login form', () => {
//     expect(component.loginForm).toBeTruthy();
//     expect(component.loginForm.controls['username']).toBeTruthy();
//     expect(component.loginForm.controls['password']).toBeTruthy();
//   });

//   it('should not call login if form is invalid', () => {
//     spyOn(component, 'login').and.callThrough();

//     component.loginForm.controls['username'].setValue('');
//     component.loginForm.controls['password'].setValue('');

//     component.login();

//     expect(component.login).toHaveBeenCalled();
//     expect(userService.findUser).not.toHaveBeenCalled();
//   });

//   // it('should call login and handle successful login', () => {
//   //   spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }));

//   //   const mockUser = { username: 'test', password: 'test', isAdmin: false, nombre: 'Test User' } as User;
//   //   userService.findUser.and.returnValue(of(mockUser));

//   //   component.loginForm.controls['username'].setValue('test');
//   //   component.loginForm.controls['password'].setValue('test');

//   //   component.login();

//   //   expect(userService.findUser).toHaveBeenCalledWith('test', 'test');
//   //   expect(userService.logIn).toHaveBeenCalledWith(mockUser);
//   //   expect(cartService.setActiveCart).toHaveBeenCalled();
//   //   expect(Swal.fire).toHaveBeenCalledWith({
//   //     icon: "success",
//   //     title: "Bienvenido, Test User",
//   //   });
//   //   expect(router.navigate).toHaveBeenCalledWith(['/']);
//   // });

//   // it('should handle login with invalid credentials', () => {
//   //   spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }));

//   //   userService.findUser.and.returnValue(of(undefined));

//   //   component.loginForm.controls['username'].setValue('wrong');
//   //   component.loginForm.controls['password'].setValue('wrong');

//   //   component.login();

//   //   expect(userService.findUser).toHaveBeenCalledWith('wrong', 'wrong');
//   //   expect(Swal.fire).toHaveBeenCalledWith({
//   //     icon: "error",
//   //     title: "Error",
//   //     text: "Credenciales Incorrectas",
//   //   });
//   // });

//   it('should handle login error', () => {
//     userService.findUser.and.returnValue(throwError('error'));

//     spyOn(console, 'log');

//     component.loginForm.controls['username'].setValue('test');
//     component.loginForm.controls['password'].setValue('test');

//     component.login();

//     expect(console.log).toHaveBeenCalledWith('error');
//   });
// });
