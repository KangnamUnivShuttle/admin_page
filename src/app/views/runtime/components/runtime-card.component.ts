import { ChangeDetectionStrategy } from "@angular/compiler/src/compiler_facade_interface";
import { Component, Input, OnInit, Output, EventEmitter, ElementRef, AfterViewChecked, ChangeDetectorRef, ApplicationRef } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpService } from "../../../services/http.services";
import { BlockRuntimeModel, ReqBlockRuntimeStateModel } from "../block.model";
import { RuntimeItem } from "./template.interface";

@Component({
    selector: 'runtime-card',
    templateUrl: 'runtime-card.component.html'
})
export class RuntimeCardComponent implements OnInit, RuntimeItem, AfterViewChecked {

    stateList = [
      'start',
      'stop',
      'remove',
      'Down'
    ]

    @Input()
    data: BlockRuntimeModel;

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
    @Output() onDeleteRequested: EventEmitter<{
        runtime: BlockRuntimeModel,
        id: string
    }> = new EventEmitter();

    lastX: number = 0;
    lastY: number = 0;
    w: number;
    h: number;
    backupX: number;
    backupY: number;

    constructor(private elementRef: ElementRef,
        private cdr: ChangeDetectorRef,
        private appRef: ApplicationRef,
        private httpService: HttpService) {}

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

    onBtnDeleteClicked(runtime: BlockRuntimeModel) {
        if(!confirm(environment.MSG_DELETE_WARN)) {
            return
        }
        this.onDeleteRequested.emit({
            runtime, id: this.id
        })
    }

    onRuntimeStateChange(runtime: BlockRuntimeModel) {
        if(!confirm(environment.MSG_CHANGE_STATE_WARN)) {
            this.data.containerState = runtime.containerStateOrigin
            return
        }
        if (runtime.blockRuntimeId && runtime.containerState !== runtime.containerStateOrigin) {
            runtime.containerStateOrigin = runtime.containerState
            this.httpService.reqPost('runtime/state', {
                blockRuntimeID: runtime.blockRuntimeId,
                container_name: runtime.containerUrl,
                container_state: runtime.containerState,
                image_url: runtime.image.githubUrl,
                cpu: '0.1',
                ram: '128M',
                path: '.',
                env: runtime.containerEnv.split('\n')
              } as ReqBlockRuntimeStateModel, null).toPromise()
              .then(res => {

              })
        } else {
            return
        }
    }

    onBtnUpdateReq(runtime: BlockRuntimeModel) {

        if(!confirm(environment.MSG_CONTAINER_BUILD_REQ_NOTIFY)) {
            return
        }

        this.httpService.reqPost('runtime/state', {
            blockRuntimeID: runtime.blockRuntimeId,
            container_name: runtime.containerUrl,
            container_state: 'build',
            image_url: runtime.image.githubUrl,
            cpu: '0.1',
            ram: '128M',
            path: '.',
            env: runtime.containerEnv.split('\n')
        } as ReqBlockRuntimeStateModel, null).toPromise()
        .then(res => {

        })
    }
}