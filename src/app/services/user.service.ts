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

    private userArray: User[] = [];

    private readonly userUrl: string = 'data/user.json';
    private readonly userKey = 'authUser';

    private readonly isLoggedIn = new BehaviorSubject<boolean>(this.checkAuthenticated());
    private readonly isAdmin = new BehaviorSubject<boolean>(this.checkAdmin());

    constructor(
        private readonly http: HttpClient,
        private readonly storage: StorageService
    ) {
        this.loadData();
    }

    loadData() {
        if (this.userArray.length == 0) {
            this.http.get<User[]>(this.userUrl).subscribe(data => {
                this.userArray = data;
            });
        }
    }

    getUserList(): Observable<User[]> {
        return of(this.userArray);
    }

    logIn(user: User): boolean {
        this.storage.setItem(this.userKey, JSON.stringify(user));

        // recargar restricciones
        this.isLoggedIn.next(this.checkAuthenticated());
        this.isAdmin.next(this.checkAdmin());

        return true
    }

    findUser(email: string, password: string): Observable<User | undefined> {
        let user = this.userArray.find(u => u.email === email && u.password === password);
        return of(user);
    }

    addUser(user: User): Observable<boolean> {
        this.userArray.push(user);
        return of(true);
    }

    updateUser(updatedUser: User): Observable<boolean> {
        let index = this.userArray.findIndex(x => x.email === updatedUser.email);
        this.userArray[index] = updatedUser;
        //actualizar datos en memoria
        this.logIn(updatedUser);

        return of(true);
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
