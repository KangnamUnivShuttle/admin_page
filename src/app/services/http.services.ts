import { Inject, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
// import 'rxjs/add/operator/map'
import { catchError, map, retry } from 'rxjs/operators';
import { BasicResponseModel } from '../models/basicResponse.model';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpService {

    isAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(true);

    constructor(private http: HttpClient) {
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // 클라이언트나 네트워크 문제로 발생한 에러.
            console.error('An error occurred:', error.error.message);
        } else if (error.status === 401) {
            this.isAuthorized.next(false);
        } else {
            // 백엔드에서 실패한 것으로 보낸 에러.
            // 요청으로 받은 에러 객체를 확인하면 원인을 확인할 수 있습니다.
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        // 사용자가 이해할 수 있는 에러 메시지를 반환합니다.
        return throwError(
            'Something bad happened; please try again later.');
    }

    public reqGet(url: string, params: {[key: string]: any}) {
        // let httpParams = new HttpParams();
        // Object.keys(params).forEach(key => {
        //     httpParams.set(key, params[key])
        // })
        return this.http.get<BasicResponseModel>(`${url.includes('http') ? '' : environment.host}${url}`, {
            params: params
        })
            .pipe(
                map(res => {
                    const result = <BasicResponseModel><unknown>res;
                    console.log('res', res)
                    return result
                }),
                catchError((err) => this.handleError(err))
            );
    }

    public reqPost(url: string, data: any, options: any) {
        return this.http.post<BasicResponseModel>(`${environment.host}${url}`, data, {
            ...options,
        })
            .pipe(
                map(res => {
                    const result = <BasicResponseModel><unknown>res;
                    console.log('res', res)
                    return result
                }),
                catchError((err) => this.handleError(err))
            );
    }

    public reqPut(url: string, data: any, options: any) {
        return this.http.put<BasicResponseModel>(`${environment.host}${url}`, data, {
            ...options,
        })
            .pipe(
                map(res => {
                    const result = <BasicResponseModel><unknown>res;
                    console.log('res', res)
                    return result
                }),
                catchError((err) => this.handleError(err))
            );
    }

    public reqDelete(url: string, options: any) {
        return this.http.delete<BasicResponseModel>(`${environment.host}${url}`, {
            ...options,
        })
            .pipe(
                map(res => {
                    const result = <BasicResponseModel><unknown>res;
                    console.log('res', res)
                    return result
                }),
                catchError((err) => this.handleError(err))
            );
    }
}