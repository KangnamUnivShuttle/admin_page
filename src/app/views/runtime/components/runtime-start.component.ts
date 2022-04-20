import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RuntimeItem } from "./template.interface";

@Component({
    selector: 'runtime-start',
    templateUrl: 'runtime-start.component.html'
})
export class RuntimeStartComponent implements OnInit, RuntimeItem, AfterViewChecked {

    lastX: number;
    lastY: number;
    
    @Input()
    drag: string;
    
    @Input()
    x: number;
    
    @Input()
    y: number;

    @Input()
    id: string;

    @Output() onDragStartPos: EventEmitter<{x: number, y: number, id: string, ele: any}> = new EventEmitter();
    @Output() onRectChange: EventEmitter<{w: number, h: number}> = new EventEmitter();

    @Input()
    msg: string;

    w: number;
    h: number;
    backupX: number;
    backupY: number;

    constructor(private elementRef: ElementRef) {}

    ngAfterViewChecked(): void {
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
}