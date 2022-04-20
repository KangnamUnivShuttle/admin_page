import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.services';
import { RuntimeCardComponent } from './components/runtime-card.component';

@Component({
    templateUrl: 'runtime-flow2.component.html',
    styleUrls: ['./runtime-flow2.component.css']
})
export class RuntimeFlow2Component implements OnInit {

    childComponents = [
        {
            type: 'start',
            ref: 'asdfasdf',
            x: 50,
            y: 50,
            w: 0,
            h: 0,
            msg: 'asdfasdfasdfasdfad',
            orderNum: 0
        },
        {
            type: 'card',
            ref: 'asdf',
            x: 100,
            y: 150,
            w: 0,
            h: 0,
            orderNum: 1
        },
        {
            type: 'link',
            ref: 'ffasdf',
            x: 500,
            y: 250,
            w: 0,
            h: 0,
            orderNum: 99999
        }
    ];

    focusedChildComponent: any;

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

    onDragStart(event) {
        console.log('start', event)
        this.focusedChildComponent = event.ele
    }

    onDragging(event) {
        event.preventDefault()
    }

    onDragDrop(event) {
        event.preventDefault()
        if (this.focusedChildComponent) {
            this.focusedChildComponent.onDrop(event)
        }

        console.log(this.childComponents)
    }

    onBtnMoveBack() {
        this.router.navigate(['/runtime/block/list'])
    }
}