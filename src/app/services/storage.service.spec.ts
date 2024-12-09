import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(StorageService);

    // Mock del sessionStorage
    spyOn(sessionStorage, 'setItem').and.callFake(() => { });
    spyOn(sessionStorage, 'getItem').and.callFake(() => 'mock-value');
    spyOn(sessionStorage, 'removeItem').and.callFake(() => { });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store a value in sessionStorage', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value);

    expect(sessionStorage.setItem).toHaveBeenCalledWith(key, value);
  });

  it('should retrieve a value from sessionStorage', () => {
    const key = 'testKey';
    const value = service.getItem(key);

    expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
    expect(value).toBe('mock-value');
  });

  it('should remove a value from sessionStorage', () => {
    const key = 'testKey';

    service.removeItem(key);

    expect(sessionStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should not store a value if not in browser environment', () => {
    // Redefinir PLATFORM_ID para simular un entorno no navegador
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(StorageService);

    service.setItem('key', 'value');

    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it('should not retrieve a value if not in browser environment', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(StorageService);

    const value = service.getItem('key');

    expect(sessionStorage.getItem).not.toHaveBeenCalled();
    expect(value).toBeNull();
  });

  it('should not remove a value if not in browser environment', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    service = TestBed.inject(StorageService);

    service.removeItem('key');

    expect(sessionStorage.removeItem).not.toHaveBeenCalled();
  });
});
