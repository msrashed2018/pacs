import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, config, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '../models/UserModel';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

declare var CryptoJS: any;
declare var AesUtil: any;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<UserModel>;
    public currentUser: Observable<UserModel>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UserModel {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        const api = 'http://localhost:8085/oauth/token';
        let token = btoa("khedma-client:secretvalue");
        const headers = { 'Authorization': 'Basic ' + token, 'Content-Type': 'application/x-www-form-urlencoded', 'AppVersion': '1' }
        var encryptedDate = this.Encrypt([username, password]);
        var data = "grant_type=password&username=" + encodeURIComponent(encryptedDate.result[0]) + "&password=" + encodeURIComponent(encryptedDate.result[1]);
        return this.http.post<any>(api, data, { headers })
            .pipe(map(user => {
                if (user && user.access_token) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user.access_token));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['login']);
    }

    Encrypt(vals) {
        let result: any = [];
        let iv = "ec13170e833d473a0deef8c5e1788cdf"; //CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        let salt = "a2ca229cafbf73d8296e9048541c75a5"; //CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        let passphrase = "0EElojCKeD9KkVG"; //this.generateRandomValue();
        let x = true;
        if (x) {
            let aesUtil = new AesUtil(128, 1000);
            for (let i = 0; i < vals.length; i++) {
                result.push(aesUtil.encrypt(salt, iv, passphrase, vals[i]));
            }
        } else {
            iv = "";
            salt = "";
            passphrase = "";
            for (let i = 0; i < vals.length; i++) {
                result.push(vals[i]);
            }
        }
        return { iv: iv, salt: salt, passphrase: passphrase, result: result };
    }
}
