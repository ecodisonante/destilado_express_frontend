import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';
import { jwtDecode } from "jwt-decode";
import { json } from 'stream/consumers';
import { stringify } from 'querystring';
import { AuthService } from './auth.service';

/**
 * Clase de servicios relacionados a Usuarios
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userArray: User[] = [];

    private readonly userUrl: string = 'data/user.json';
    private readonly tokenKey = 'userToken';

    private readonly apiBaseUrl = 'http://localhost:8080/api/';


    constructor(
        private readonly http: HttpClient,
        private readonly storageService: StorageService,
        private readonly authService: AuthService
    ) {
        // this.loadData();
    }

    loadData() {
        if (this.userArray.length == 0) {
            this.http.get<User[]>(this.userUrl).subscribe(data => {
                this.userArray = data;
            });
        }
    }

    getUserList(): Observable<User[]> {
        this.loadData();
        return of(this.userArray);
    }

    findUser(email: string, password: string): Observable<User | undefined> {
        let user = this.userArray.find(u => u.email === email && u.password === password);
        return of(user);
    }

    addUser(user: User): Observable<boolean> {
        this.loadData();
        this.userArray.push(user);
        return of(true);
    }

    updateUser(updatedUser: User): Observable<boolean> {
        let index = this.userArray.findIndex(x => x.email === updatedUser.email);
        this.userArray[index] = updatedUser;
        //actualizar datos en memoria
        // this.logIn(updatedUser);

        return of(true);
    }

    findUserByEmail(email: string): Observable<User | undefined> {
        this.loadData();
        return this.getUserList().pipe(
            map((users: User[]) => {
                let user = users.find(u => u.email == email);
                return user;
            })
        );
    }

    getActiveUser(): User | null {
        let user = this.storageService.getItem(this.tokenKey);
        return user ? JSON.parse(user) : null;
    }
}
