import { Component, Input, OnInit, Output, EventEmitter, ElementRef, AfterViewChecked } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { RuntimeItem } from "./template.interface";

@Component({
    selector: 'runtime-card',
    templateUrl: 'runtime-card.component.html'
})
export class RuntimeCardComponent implements OnInit, RuntimeItem, AfterViewChecked {

    @Input()
    id: string = environment.DEFAULT_RUNTIME_ID;

    @Input()
    drag: string = 'view'

    @Input()
    x: number = 0

    @Input()
    y: number = 0

    @Input()
    orderNum: number = 0;

    @Output() onDragStartPos: EventEmitter<{x: number, y: number, id: string, ele: any}> = new EventEmitter();
    @Output() onRectChange: EventEmitter<{w: number, h: number}> = new EventEmitter();
    @Output() onSortChange: EventEmitter<{dir: number, ele: any}> = new EventEmitter();

    lastX: number = 0;
    lastY: number = 0;
    w: number;
    h: number;
    backupX: number;
    backupY: number;

    constructor(private elementRef: ElementRef) {}

    ngAfterViewChecked(): void {
        // console.log('checked', this.elementRef.nativeElement.getBoundingClientRect(), this.elementRef.nativeElement.querySelector('div'), this.elementRef.nativeElement.querySelector('div').getBoundingClientRect())
        const rect = this.elementRef.nativeElement.querySelector('div').getBoundingClientRect()
        this.w = rect.width
        this.h = rect.height
        this.onRectChange.emit({
            w: rect.width,
            h: rect.height
        })
    }

    ngOnInit(): void {
        this.backupX = this.x
        this.backupY = this.y
    }

    getStyle(): Object {
        return {
            'top': `${this.y}px`,
            'left': `${this.x}px`,
            'cursor': `${this.drag === 'view' ? 'default' : 'move'}`
        }
    }

    onDragStart(event) {
        this.lastX = event.x;
        this.lastY = event.y;
        this.onDragStartPos.emit({x: event.x, y: event.y, id: this.id, ele: this})
    }

    onDrop(event: any) {
        this.backupX = this.x
        this.backupY = this.y
        this.x += event.x - this.lastX;
        this.y += event.y - this.lastY;
    }

    onResized(event: any) {
        console.log('re', event)
    }

    onBtnSortChange(dir: number) {
        this.onSortChange.emit({
            dir,
            ele: this
        })
    }
}