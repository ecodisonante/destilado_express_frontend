import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Clase de servicios relacionados a Usuarios
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly tokenKey = 'userToken';
    private readonly authUrl = 'http://localhost:8080/api/auth/login';

    private readonly loggedInBehaviour = new BehaviorSubject<boolean>(this.isValidToken());
    private readonly adminBehaviour = new BehaviorSubject<boolean>(this.checkAdmin());

    constructor(
        private readonly storageService: StorageService,
        private readonly http: HttpClient,
    ) {

    }

    authenticate(email: string, password: string): Observable<any> {
        const body = { email, password };
        return this.http.post(this.authUrl, body);
    }

    logIn(token: string) {
        // Almacenar token
        this.storageService.setItem(this.tokenKey, token);

        // recargar restricciones
        this.loggedInBehaviour.next(this.isValidToken());
        this.adminBehaviour.next(this.checkAdmin());
    }

    logOut(): void {
        this.storageService.removeItem(this.tokenKey);
        this.loggedInBehaviour.next(false);
        this.adminBehaviour.next(false);
    }

    getToken() {
        return this.storageService.getItem(this.tokenKey);
    }

    isValidToken(providenToken: string | null = null): boolean {
        let token: string | null;

        if (providenToken != null) token = providenToken;
        else token = this.getToken();

        // verificar que el token existe
        if (!token) return false;

        // verificar que no esta expirado
        try {
            const decoded: any = jwtDecode(token);
            const now = Math.floor(new Date().getTime() / 1000);
            return decoded.exp > now;
        } catch (error) {
            console.error('Error verificando el token:', error);
            return false;
        }
    }

    decodeToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error decodificando el token:', error);
            return null;
        }
    }

    checkAdmin(): boolean {
        // comprobar que este autenticado
        if (!this.isValidToken()) return false;

        // obtener datos del token
        let token = this.getToken();
        const decodedToken = this.decodeToken(token!);

        // verificar rol
        const role = decodedToken?.role || 'No Role Found';
        console.log("Role:" + role);
        return role === "ADMIN";
    }

    getTokenId(): number | undefined {
        let token = this.getToken();
        const decodedToken = this.decodeToken(token!);
        return decodedToken?.id || undefined;
    }

    getTokenName(): string | undefined {
        let token = this.getToken();
        const decodedToken = this.decodeToken(token!);
        return decodedToken?.name || undefined;
    }

    getTokenEmail(): string | undefined {
        let token = this.getToken();
        const decodedToken = this.decodeToken(token!);
        return decodedToken?.sub || undefined;
    }

    get isAuthenticated() {
        return this.loggedInBehaviour.asObservable();
    }

    get isAdmin() {
        return this.adminBehaviour.asObservable();
    }


}
