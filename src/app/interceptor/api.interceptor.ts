import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";
import { HttpService } from "../services/http.services";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private httpService: HttpService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;

    // extend server response observable with logging
    return next.handle(req)
      .pipe(
        tap({
          // Succeeds when there is a response; ignore other events
          next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : '', this.httpService.isAuthorized.next(true)),
          // Operation failed; error is an HttpErrorResponse
          // error: (error) => (ok = 'failed')
        }),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
               ${ok} in ${elapsed} ms.`;
          console.debug(`[ApiInterceptor] [intercept-finalize] ${msg}`)
        })
      );
  }
}