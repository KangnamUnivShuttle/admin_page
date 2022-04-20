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

    playGroundWidth = 3000
    playGroundHeight = 3000

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
        this.focusedChildComponent.onDrop(event)
        if (this.focusedChildComponent) {
            this.checkBlockDuplicated(this.focusedChildComponent)
            this.checkIfOutOfPlayground(this.focusedChildComponent)
        }
    }

    checkIfOutOfPlayground(focusedChildComponent) {
        const x = focusedChildComponent.x
        const y = focusedChildComponent.y
        const w = focusedChildComponent.w
        const h = focusedChildComponent.h

        if (x < 0 || x > this.playGroundWidth || y < 0 || y > this.playGroundHeight || 
            x + w < 0 || x + w > this.playGroundWidth || y + h < 0 || y + h > this.playGroundHeight) {
                focusedChildComponent.x = focusedChildComponent.backupX
                focusedChildComponent.y = focusedChildComponent.backupY
            }
    }

    checkBlockDuplicated(focusedChildComponent) {
        const x = focusedChildComponent.x
        const y = focusedChildComponent.y
        const w = focusedChildComponent.w
        const h = focusedChildComponent.h

        const duplicatedRect = this.childComponents.filter(i => i.ref !== focusedChildComponent.id).filter(i => {
            if (
                (i.x <= x && x <= i.x + i.w && i.y <= y && y <= i.y + i.h) || // left top
                (i.x <= x + w && x + w <= i.x + i.w && i.y <= y && y <= i.y + i.h) || // right top
                (i.x <= x && x <= i.x + i.w && i.y <= y + h && y + h <= i.y + i.h) || // left bottom
                (i.x <= x + w && x + w <= i.x + i.w && i.y <= y + h && y + h <= i.y + i.h) // right bottom
            ) {
                return true
            }
            return false
        })
        if(duplicatedRect.length > 0) {
            focusedChildComponent.x = focusedChildComponent.backupX
            focusedChildComponent.y = focusedChildComponent.backupY
        }
    }

    onBtnMoveBack() {
        this.router.navigate(['/runtime/block/list'])
    }
}