import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentaComponent } from './venta.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Cart } from '../../models/cart.model';

describe('VentaComponent', () => {
  let component: VentaComponent;
  let fixture: ComponentFixture<VentaComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Datos de prueba
  const fakeCarts: Cart[] = [
    {
      id: 1,
      userId: 1,
      productos: [
        { idProducto: 101, precioUnidad: 1000, cantidad: 2 }, // 2000
        { idProducto: 102, precioUnidad: 500, cantidad: 1 }   // 500
      ],
      activa: false,
      created: new Date(),
      discount: 0,
      total: 0
    },
    {
      id: 2,
      userId: 1,
      productos: [
        { idProducto: 201, precioUnidad: 200, cantidad: 5 },  // 1000
        { idProducto: 202, precioUnidad: 50, cantidad: 4 }    // 200
      ],
      activa: false,
      created: new Date(),
      discount: 0,
      total: 0
    }
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkAdmin']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getSales']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [VentaComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();


  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    authServiceSpy.checkAdmin.and.returnValue(true);
    cartServiceSpy.getSales.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('debería navegar a "/" si el usuario no es admin', () => {
    authServiceSpy.checkAdmin.and.returnValue(false);
    fixture.detectChanges(); 
    console.log("")

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería obtener las ventas si el usuario es admin', () => {
    authServiceSpy.checkAdmin.and.returnValue(true);
    cartServiceSpy.getSales.and.returnValue(of(fakeCarts));

    fixture.detectChanges();

    // Después de detectChanges se ejecuta ngOnInit y getAllSales.
    // Como el observable ya está configurado con of(fakeCarts), next y complete son llamados.
    expect(cartServiceSpy.getSales).toHaveBeenCalled();
    expect(component.sales).toEqual(fakeCarts);
  });

  it('debería calcular el total de ventas correctamente', () => {
    authServiceSpy.checkAdmin.and.returnValue(true);
    cartServiceSpy.getSales.and.returnValue(of(fakeCarts));

    fixture.detectChanges();

    // Revisar el cálculo:
    // Primer carro: 2000 + 500 = 2500
    // Segundo carro: 1000 + 200 = 1200
    // totalVentas = 2500 + 1200 = 3700
    expect(component.totalVentas).toBe(3700);

    // Verificar que se actualizaron totales
    expect(component.sales[0].total).toBe(2500);
    expect(component.sales[1].total).toBe(1200);
  });

  it('debería manejar el caso de no haber ventas (empty array)', () => {
    authServiceSpy.checkAdmin.and.returnValue(true);
    cartServiceSpy.getSales.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.sales).toEqual([]);
    expect(component.totalVentas).toBe(0);
  });
});
