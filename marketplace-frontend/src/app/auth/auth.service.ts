import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Login, SignUp } from '../data-type';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthServices {
    private authTokenKey = 'authToken';
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private baseUrl = 'http://localhost:3000'; // Your NestJS backend URL

    constructor(private http: HttpClient, private router: Router) { }
    showLogin = false;

    signUp(data: SignUp) {
        this.isLoggedInSubject.next(true);
        return this.http.post(`${this.baseUrl}/auth/signup`, data)
    }

    logIn(data: Login) {
        this.isLoggedInSubject.next(true);
        return this.http.post(`${this.baseUrl}/auth/login`, data).pipe(
            map(response => {
                localStorage.setItem(this.authTokenKey, JSON.stringify(response))
                return response
            })
        )
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    isLoggedIn() {
        return this.getToken()
    }

    logout() {
        // Logic to log out user
        localStorage.removeItem(this.authTokenKey);
        this.isLoggedInSubject.next(false);
    }

    isAuthenticated(): boolean {
        // Check if token exists in localStorage
        return !!localStorage.getItem(this.authTokenKey);
    }
}
