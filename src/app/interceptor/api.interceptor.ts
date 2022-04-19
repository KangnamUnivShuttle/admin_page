import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";
import { HttpService } from "../services/http.services";
import { LoadingService } from "../services/loading.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private httpService: HttpService,
    private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;
    this.loadingService.loading.next(true);

    const request = req.clone({withCredentials: true,})
    // request.headers.set('cookie', '')

    // extend server response observable with logging
    return next.handle(request)
      .pipe(
        tap({
          // Succeeds when there is a response; ignore other events
          next: (event) => {
            if (event instanceof HttpResponse) {
              ok = 'succeeded'
              this.httpService.isAuthorized.next(true)
              // console.log('resres', event.headers.get('Set-Cookie'), event.headers.get('ETag'), event.headers.get('Content-Length'), event.headers.get('Server'))
              
            }
          },
          // Operation failed; error is an HttpErrorResponse
          // error: (error) => (ok = 'failed')
        }),
        // Log when response observable either completes or errors
        finalize(() => {
          this.loadingService.loading.next(false);
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
               ${ok} in ${elapsed} ms.`;
          console.debug(`[ApiInterceptor] [intercept-finalize] ${msg}`)
        })
      );
  }
}