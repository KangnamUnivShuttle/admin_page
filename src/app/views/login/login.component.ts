import { HttpEvent } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BasicResponseModel } from '../../models/basicResponse.model';
import { HttpService } from '../../services/http.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  email: string = '';
  passwd: string = '';

  reqSubscription: Subscription;

  loginForm = this.formBuilder.group({
    email: new FormControl(this.email, [Validators.required]),
    passwd: new FormControl(this.passwd, [Validators.required])
  })

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,
    private router: Router){}

  ngOnDestroy(): void {
    if(this.reqSubscription && !this.reqSubscription.closed) {
      this.reqSubscription.unsubscribe()
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.reqSubscription = this.httpService.reqPost('auth', {
      passwd: this.passwd,
      email: this.email
    }, undefined)
    .subscribe((res) => {
      this.loginForm.reset();
      if (res.success) {
        this.router.navigate(['/dashboard'])
      }
    })
  }
}
