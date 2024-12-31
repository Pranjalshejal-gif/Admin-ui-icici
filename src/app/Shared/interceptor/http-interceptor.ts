import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Body } from 'docx';

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {
    separator: any;
    getModifiedUrl: any;

    constructor(private toastr: ToastrService, private userService: UserService,
        public toasterService: ToastrService, private sharedService: SharedService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.userService.showSpinner();
        const admin = this.userService.userSessionData;

        if (request.method == 'POST' || request.method == 'PATCH' || request.method == 'PUT' || request.method == 'DELETE') {
            let encryptedBody = this.sharedService.getEncryptedString(JSON.stringify(request.body));
            if (admin && admin.data && admin.data.ck && admin.data.sk && this.sharedService.wk) {
                if (request.url?.includes('bulk-upload') || request.url?.includes('bulk-file-upload')) {
                    request = request.clone({
                        setHeaders: {
                            ck: admin.data.ck,
                            sk: admin.data.sk,
                            // If true, set additional headers including 'subType' with the value from sharedService if available.
                            mid: this.sharedService.merchantMid == undefined ? '' : this.sharedService.merchantMid,
                            subType: this.sharedService.subType == undefined ? '' : this.sharedService.subType,
                            sponsor: this.sharedService.sponsorId == undefined ? '' : '' + this.sharedService.sponsorId,
                            program: this.sharedService.ruleId == undefined ? '' : this.sharedService.ruleId

                        },
                    });
                } else
                    request = request.clone({
                        setHeaders: {
                            ck: admin.data.ck,
                            sk: admin.data.sk,
                            wk: this.sharedService.wk
                        },
                        body: { "payloadRequest": encryptedBody }

                    });
            }
            else if (this.sharedService.wk) {
                request = request.clone({
                    setHeaders: {
                        wk: this.sharedService.wk
                    },
                    body: { "payloadRequest": encryptedBody }
                });
            }
        }
        else {
            if (admin && admin.data && admin.data.ck && admin.data.sk && this.sharedService.wk) {
                request = request.clone({
                    setHeaders: {
                        ck: admin.data.ck,
                        sk: admin.data.sk,
                        wk: this.sharedService.wk
                    }
                });
            }
            else if (this.sharedService.wk) {
                request = request.clone({
                    setHeaders: {
                        wk: this.sharedService.wk
                    }
                });
            }
        }


        return next.handle(request)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {

                        if (event.body && event.body["payloadResponse"]) {
                            event = event.clone({
                                body: JSON.parse(this.sharedService.getDecryptedData(event.body["payloadResponse"]))
                            })
                        }
                        if (event.body && event.body.success && (request.method !== 'GET') && event.body?.message) {
                            if (!event.url?.includes('verify-user-otp')) {
                                this.toasterService.success(event.body?.message, '', { enableHtml: true });
                            }
                        }
                        this.userService.hideSpinner();
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    this.userService.hideSpinner();
                    var errObj;
                    if (error.error && error.error.payloadResponse) {
                        errObj = JSON.parse(this.sharedService.getDecryptedData(error.error.payloadResponse));
                    }
                    if (error.status === 403) {
                        // auto logout if 401 response returned from api
                        this.userService.logout();
                    }
                    else if (errObj && errObj.message) {
                        this.toastr.error(errObj.message);
                    }
                    else if (error.error && error.error.message)
                        this.toastr.error(error.error.message);
                    else if (error.status === 304) {
                        this.toastr.error("No Changes in Data");
                        setTimeout(() => {
                            window.close();
                        }, 3000);

                    } else if (error.status === 400) {
                        this.toastr.error('Some fields have invalid data');
                    } else if (error.status === 500 && request.url.includes('logout')) {
                        this.toastr.error('Session expired!');
                    }
                    else if (error.status === 500) {
                        this.toastr.error('Internal server error');
                    }
                    else {
                        this.toastr.error(error.statusText);
                    }
                    const err = error.error ? error.error.message : error.statusText;
                    return throwError(err);
                })

            );
    }
}
