import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BlockImageModel } from '../block.model';
import { RuntimeItem } from './template.interface';

@Component({
    selector: 'runtime-image',
    templateUrl: 'runtime-image.component.html'
})
export class RuntimeImageComponent implements OnInit, RuntimeItem, AfterViewChecked {

    @Input()
    plugin: BlockImageModel;

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

    w: number;
    h: number;
    lastX: number;
    lastY: number;
    backupX: number;
    backupY: number;

    constructor(private elementRef: ElementRef) {}

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

    onDragStart(event: any) {
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

    ngAfterViewChecked(): void {
        const rect = this.elementRef.nativeElement.querySelector('div').getBoundingClientRect()
        this.w = rect.width
        this.h = rect.height
        this.onRectChange.emit({
            w: rect.width,
            h: rect.height
        })
    }

    onBtnOpenUrlInNewTab(url: string) {
        window.open(url, '_blank').focus();
    }
}