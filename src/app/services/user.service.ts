import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

/**
 * Clase de servicios relacionados a Usuarios
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userKey = 'authUser';
    private isLoggedIn = new BehaviorSubject<boolean>(this.checkAuthenticated());
    private isAdmin = new BehaviorSubject<boolean>(this.checkAdmin());

    private userUrl: string = 'data/user.json';

    constructor(
        private http: HttpClient,
        private storage: StorageService
    ) { }

    getUserList(): Observable<User[]> {
        return this.http.get<User[]>(this.userUrl);
    }

    logIn(user: User): boolean {
        this.storage.setItem(this.userKey, JSON.stringify(user));

        // recargar restricciones
        this.isLoggedIn.next(this.checkAuthenticated());
        this.isAdmin.next(this.checkAdmin());

        return true
    }

    findUser(email: string, password: string): Observable<User | undefined> {
        return this.getUserList().pipe(
            map((users: User[]) => {
                let user = users.find(u => u.email === email && u.password === password);
                if (user) user.password = "";
                return user;
            })
        );
    }

    addUser(user: User): Observable<boolean> {
        const result = new Subject<boolean>();

        this.getUserList().subscribe({
            next: (users) => {
                // Agrega a lista existente
                users.push(user);
                this.http.post(this.userUrl, users).pipe(
                    map(() => {
                        // Emitir resultado de post
                        result.next(true);
                        result.complete();
                    }),
                    catchError((error) => {
                        result.error(false);
                        return of(false);
                    })
                ).subscribe();
            },
            error: (err) => {
                result.error(false);
            }
        });

        return result.asObservable();
    }

    updateUser(updatedUser: User): Observable<boolean> {
        const result = new Subject<boolean>();

        this.getUserList().subscribe({
            next: (users) => {

                // actualiza usuario
                let index = users.findIndex(x => x.email === updatedUser.email);
                users[index] = updatedUser;

                this.http.post(this.userUrl, users).pipe(
                    map(() => {
                        // Emitir resultado de post
                        result.next(true);
                        result.complete();
                    }),
                    catchError((error) => {
                        result.error(false);
                        return of(false);
                    })
                ).subscribe();
            },
            error: (err) => {
                result.error(false);
            }
        });

        this.logIn(updatedUser);
        return result.asObservable();
    }

    findUserByEmail(email: string): Observable<User | undefined> {
        return this.getUserList().pipe(
            map((users: User[]) => {
                let user = users.find(u => u.email == email);
                return user;
            })
        );
    }

    get isAuthenticated() {
        return this.isLoggedIn.asObservable();
    }

    get isAdminAuth() {
        return this.isAdmin.asObservable();
    }

    getActiveUser(): User | null {
        let user = this.storage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    logOut(): void {
        this.storage.removeItem(this.userKey);
        this.isLoggedIn.next(this.checkAuthenticated());
        this.isAdmin.next(this.checkAdmin());
    }

    checkAuthenticated(): boolean {
        return this.getActiveUser() !== null;
    }

    checkAdmin(): boolean {
        return this.getActiveUser() !== null && this.getActiveUser()!.rol.id === 1;
    }

}
