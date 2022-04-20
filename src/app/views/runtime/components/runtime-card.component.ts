import { Component, Input, OnInit, Output, EventEmitter, ElementRef, AfterViewChecked } from "@angular/core";
import { RuntimeItem } from "./template.interface";

@Component({
    selector: 'runtime-card',
    templateUrl: 'runtime-card.component.html'
})
export class RuntimeCardComponent implements OnInit, RuntimeItem, AfterViewChecked {

    @Input()
    id: string = 'untitled';

    @Input()
    drag: string = 'view'

    @Input()
    x: number = 0

    @Input()
    y: number = 0

    @Output() onDragStartPos: EventEmitter<{x: number, y: number, ele: any}> = new EventEmitter();
    @Output() onRectChange: EventEmitter<{w: number, h: number}> = new EventEmitter();

    lastX: number = 0;
    lastY: number = 0;

    constructor(private elementRef: ElementRef) {}

    ngAfterViewChecked(): void {
        // console.log('checked', this.elementRef.nativeElement.getBoundingClientRect(), this.elementRef.nativeElement.querySelector('div'), this.elementRef.nativeElement.querySelector('div').getBoundingClientRect())
        const rect = this.elementRef.nativeElement.querySelector('div').getBoundingClientRect()
        this.onRectChange.emit({
            w: rect.width,
            h: rect.height
        })
    }

    ngOnInit(): void {
        console.log(this.drag, this.x, this.y, this.id, this.elementRef.nativeElement.getBoundingClientRect())
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
        this.onDragStartPos.emit({x: event.x, y: event.y, ele: this})
    }

    onDrop(event: any) {
        this.x += event.x - this.lastX;
        this.y += event.y - this.lastY;
    }

    onResized(event: any) {
        console.log('re', event)
    }
}