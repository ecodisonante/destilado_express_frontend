import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


/**
 * Clase de servicios encargada de encapsular el almacenamiento de sessionStorage y evitar que se ejecute del lado del servidor
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Indicador de ejecucion en entorno del cliente
   */
  private isBrowser: boolean;

  /**
   * Constructor para la clase
   */
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Almacena un valor dentro del sessionStorage
   * @param key llave del valor
   * @param value valor a guardar
   */
  setItem(key: string, value: string): void {
    if (this.isBrowser && sessionStorage) {
      sessionStorage.setItem(key, value);
    }
  }

  /**
   * Recupera un valor desde el sessionStorage
   * @param key llave del valor
   * @returns {string} valor almacenado
   */
  getItem(key: string): string | null {
    if (this.isBrowser && sessionStorage) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  /**
   * Elimina un valor del sessionStorage
   * @param key llave del valor
   */
  removeItem(key: string): void {
    if (this.isBrowser && sessionStorage) {
      sessionStorage.removeItem(key);
    }
  }
}
