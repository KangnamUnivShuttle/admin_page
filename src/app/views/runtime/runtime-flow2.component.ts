import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.services';
import { BlockModel } from './block.model';
import { RuntimeCardComponent } from './components/runtime-card.component';

@Component({
    templateUrl: 'runtime-flow2.component.html',
    styleUrls: ['./runtime-flow2.component.css']
})
export class RuntimeFlow2Component implements OnInit, AfterViewInit {

    @ViewChild('dynamicLineSvg') dynamicLineSvg: ElementRef;

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
            x: 205,
            y: 419,
            w: 0,
            h: 0,
            orderNum: 1
        },
        {
            type: 'link',
            ref: 'ffasdf',
            x: 950,
            y: 380,
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

    blockID: string;
    runtimeBlock: BlockModel;
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private httpService: HttpService) {
        this.blockID = this.route.snapshot.params['blockID'] || 'intro';
    }

    initData() {
        Promise.all(
            [
                this.httpService.reqGet('runtimeBlock', {blockID: this.blockID}).toPromise(),
                this.httpService.reqGet('runtime', {blockID: this.blockID}).toPromise(),
                this.httpService.reqGet('runtimeLink', {blockID: this.blockID}).toPromise()
        ])
        .then(res => {
            console.log('res', res)
        })
    }

    ngAfterViewInit(): void {
        this.drawLines()
    }

    draw(): void {
        this.drawLines()
    }

    drawLines() {
        const lines = []
        const calcLines = this.calcDrawLine()
        // console.log('calcLines', calcLines, this.childComponents)
        calcLines.forEach((line, idx) => {
            // ;left:${line.x1}px;top:${line.y1}px
            // ;left:${this.childComponents[idx + 1].w / 2}px;top:${this.childComponents[idx + 1].h / 2}px
            lines.push(`<svg style="position:absolute;width:${this.playGroundWidth}px;height:${this.playGroundHeight}px"><line 
            x1="${line.x1}" 
            y1="${line.y1}" 
            x2="${line.x2}" 
            y2="${line.y2}" stroke="red" stroke-width="3"/></svg>`)
        })
        this.dynamicLineSvg.nativeElement.innerHTML = lines.join('')
        // console.log('svg', this.dynamicLineSvg.nativeElement.innerHTML)
    }
    
    ngOnInit(): void {
        // this.initData()
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
            this.checkBlockDuplicated(this.focusedChildComponent)
            this.checkIfOutOfPlayground(this.focusedChildComponent)
            this.updateFocusedChildComponentPos(this.focusedChildComponent)
        }
        this.draw()
    }

    updateFocusedChildComponentPos(focusedChildComponent) {
        const tmp = this.childComponents.filter(i => i.ref === focusedChildComponent.id)
        if (tmp.length <= 0) {
            return
        }
        const childIdx = this.childComponents.indexOf(tmp[0])
        this.childComponents[childIdx].x = focusedChildComponent.x
        this.childComponents[childIdx].y = focusedChildComponent.y
        this.childComponents[childIdx].w = focusedChildComponent.w
        this.childComponents[childIdx].h = focusedChildComponent.h
    }

    calcDrawLine() {
        if (this.childComponents.length <= 1) {
            return []
        }
        return new Array(this.childComponents.length - 1).fill(this.childComponents.keys()).map((val, idx) => {
            // console.log(document.getElementById(this.childComponents[idx].ref).getBoundingClientRect(),
            // document.getElementById(this.childComponents[idx + 1].ref).getBoundingClientRect())
            return {
                x1: this.childComponents[idx].x + (this.childComponents[idx].w) / 2,
                y1: this.childComponents[idx].y + (this.childComponents[idx].h) / 2,
                x2: this.childComponents[idx + 1].x + (this.childComponents[idx + 1].w) / 2,
                y2: this.childComponents[idx + 1].y + (this.childComponents[idx + 1].h) / 2
            }
        })
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