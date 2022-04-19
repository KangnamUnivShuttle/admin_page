import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.services';

@Component({
    templateUrl: 'runtime-flow2.component.html'
})
export class RuntimeFlow2Component implements OnInit {

    mode = {
        search: false,
        drag: 'view',
        execute: 'idle'
    }
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private httpService: HttpService) {
    }
    
    ngOnInit(): void {
    }
}