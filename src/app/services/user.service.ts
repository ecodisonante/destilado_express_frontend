import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usuariosUrl = `${environment.apiUrl}:8080/api/usuarios`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService // Clase que maneja los tokens
  ) { }

  /**
   * Construye los headers con el token de autenticación.
   * @returns HttpHeaders con el token incluido.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró un token válido');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Obtener la lista de usuarios.
   * @returns Observable con la lista de usuarios.
   */
  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(this.usuariosUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Obtener un usuario por su ID.
   * @param id ID del usuario a buscar.
   * @returns Observable con el usuario encontrado.
   */
  getUserById(id: number): Observable<User> {
    console.log(`Calling: "${this.usuariosUrl}/${id}"`);
    return this.http.get<User>(`${this.usuariosUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Recuperar contraseña un usuario por su email.
   * @param email Email del usuario a buscar.
   * @returns Observable con una respuesta de éxito.
   */
  recover(email: string): Observable<string> {
    return this.http.post(`${this.usuariosUrl}/recover?email=${email}`, null, {
      responseType: 'text'
    });
  }

  /**
   * Crear un nuevo usuario.
   * @param user Usuario a crear.
   * @returns Observable con el usuario creado.
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usuariosUrl, user);
  }

  /**
   * Actualizar un usuario.
   * @param id ID del usuario a actualizar.
   * @param user Datos actualizados del usuario.
   * @returns Observable con una respuesta de éxito.
   */
  updateUser(id: number, user: User): Observable<string> {
    return this.http.put<string>(`${this.usuariosUrl}/${id}`, user, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  /**
   * Eliminar un usuario por su ID.
   * @param id ID del usuario a eliminar.
   * @returns Observable con una respuesta de éxito.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuariosUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
