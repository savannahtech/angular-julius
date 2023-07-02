import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// let apiUrl = "http://localhost/sticket/api/";
let apiUrl = "https://koliko.io/apps/sticket/api/";
//let apiUrl = "https://pesewawebsoft.com/apps/sticket/api/";
@Injectable()

export class AuthServiceProvider {

    constructor(public http: Http) {
    }

    postData(credentials, type) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();

            this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                });
        });

    }
}
