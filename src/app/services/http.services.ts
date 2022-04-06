import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BasicResponseModel } from '../models/basicResponse.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  constructor(private http: HttpClient) { }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // 클라이언트나 네트워크 문제로 발생한 에러.
      console.error('An error occurred:', error.error.message);
    } else if (error.status === 401) {
        console.error('Unathorization')
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

  public reqGet(url: string, options: any) {
      return this.http.get<BasicResponseModel>(url, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public reqPost(url: string, data: any, options: any) {
      return this.http.post<BasicResponseModel>(url, data, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public reqPut(url: string, data: any, options: any) {
    return this.http.put<BasicResponseModel>(url, data, options)
    .pipe(
      catchError(this.handleError)
    );
  }

  public reqDelete(url: string, options: any) {
    return this.http.delete<BasicResponseModel>(url, options)
    .pipe(
      catchError(this.handleError)
    );
  }
}