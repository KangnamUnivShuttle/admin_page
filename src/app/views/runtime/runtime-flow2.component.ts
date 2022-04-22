import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, ApplicationRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BasicResponseModel } from '../../models/basicResponse.model';
import { HttpService } from '../../services/http.services';
import { BlockImageModel, BlockLinkModel, BlockModel, BlockRuntimeModel, ReqBlockLinkModel, ReqBlockModel, ReqBlockRuntimeModel, RuntimeItemPosModel } from './block.model';
import { RuntimeCardComponent } from './components/runtime-card.component';

@Component({
    templateUrl: 'runtime-flow2.component.html',
    styleUrls: ['./runtime-flow2.component.css']
})
export class RuntimeFlow2Component implements OnInit, AfterViewInit {

    @ViewChild('playgroundWrapper') playgroundWrapperEle: ElementRef;
    @ViewChild('playground') playgroundEle: ElementRef;
    @ViewChild('dynamicLineSvg') dynamicLineSvg: ElementRef;

    playGroundWidth = 3000
    playGroundHeight = 3000

    childComponents: RuntimeItemPosModel[] = [
        // {
        //     type: 'start',
        //     ref: 'asdfasdf',
        //     x: 50,
        //     y: 50,
        //     w: 0,
        //     h: 0,
        //     msg: 'asdfasdfasdfasdfad',
        //     orderNum: 0
        // },
        // {
        //     type: 'card',
        //     ref: 'asdf',
        //     x: 205,
        //     y: 419,
        //     w: 0,
        //     h: 0,
        //     orderNum: 1
        // },
        // {
        //     type: 'card',
        //     ref: 'fsadfasf',
        //     x: 550,
        //     y: 119,
        //     w: 0,
        //     h: 0,
        //     orderNum: 2
        // },
        // {
        //     type: 'link',
        //     ref: 'ffasdf',
        //     x: 950,
        //     y: 380,
        //     w: 0,
        //     h: 0,
        //     orderNum: 99999
        // }
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
        private appRef: ApplicationRef,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private _snackBar: MatSnackBar,
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
            const [start, runtime, link] = res

            if (!start.data || start.data.length <= 0 || !runtime.data || !link.data) {
                return
            }

            this.childComponents.length = 0
            this.childComponents.push({
                type: 'start',
                ref: this.guid(),
                x: start.data[0].x,
                y: start.data[0].y,
                w: 0,
                h: 0,
                orderNum: 0,
                data: start.data[0]
            })

            runtime.data.forEach((run, idx) => {
                run.containerStateOrigin = run.containerState
                run.containerUrl = run.containerUrl || `${run.image.name}_${this.guid()}`,
                this.childComponents.push({
                    type: 'card',
                    ref: this.guid(),
                    x: run.x,
                    y: run.y,
                    w: 0,
                    h: 0,
                    orderNum: idx + 1,
                    data: run
                })
            })

            this.childComponents.push({
                type: 'link',
                ref: this.guid(),
                x: start.data[0].linkX,
                y: start.data[0].linkY,
                w: 0,
                h: 0,
                orderNum: 99999,
                data: link.data
            })
            this.appRef.tick()
            this.cdr.detectChanges()

            this.draw()
            console.log('child', this.childComponents)
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
        this.initData()
    }

    onDragStart(event) {
        this.focusedChildComponent = event.ele
        console.log('start', event)
    }

    onDragging(event) {
        event.preventDefault()
    }

    onDragDrop(event) {
        event.preventDefault()
        console.log('drop', event)
        if (this.focusedChildComponent && this.focusedChildComponent.id !== environment.DEFAULT_RUNTIME_ID) {
            this.focusedChildComponent.onDrop(event)
            this.checkBlockDuplicated(this.focusedChildComponent)
            this.checkIfOutOfPlayground(this.focusedChildComponent)
            this.updateFocusedChildComponentPos(this.focusedChildComponent)
        } else if(this.focusedChildComponent && this.focusedChildComponent.id === environment.DEFAULT_RUNTIME_ID) {

            const rect = this.playgroundEle.nativeElement.getBoundingClientRect()
            this.focusedChildComponent.x = event.x - rect.x - this.focusedChildComponent.w / 2
            this.focusedChildComponent.y = event.y - rect.y

            // console.log('f', this.focusedChildComponent, this.checkBlockDuplicated(this.focusedChildComponent), this.checkIfOutOfPlayground(this.focusedChildComponent))
            // console.log('a', this.playgroundEle.nativeElement.getBoundingClientRect())
            // console.log('b', this.playgroundWrapperEle.nativeElement.getBoundingClientRect())

            if(this.checkBlockDuplicated(this.focusedChildComponent) || 
                this.checkIfOutOfPlayground(this.focusedChildComponent) ||
                this.focusedChildComponent.x <= 0 ||
                this.focusedChildComponent.y <= 0) {
                // console.warn('fail')
                this._snackBar.open(environment.MSG_FAIL_TO_CREATE_BLOCK, 'OK', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 5000
                });
                return
            }
            this.appendNewRuntime(this.focusedChildComponent)
        }
        this.draw()
    }

    guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4();
    }

    appendNewRuntime(ele) {
        console.log('ele', ele)
        this.childComponents.splice(this.childComponents.length - 1, 0, {
            type: 'card',
            ref: this.guid(),
            x: ele.x,
            y: ele.y,
            w: ele.w,
            h: ele.h,
            orderNum: this.childComponents[this.childComponents.length - 2].orderNum + 1,
            data: {
                blockId: this.blockID,
                imageId: ele.plugin.imageId,
                containerEnv: '',
                containerPort: '15000',
                containerUrl: `${ele.plugin.name}_${this.guid()}`,
                containerState: 'Down',
                containerStateOrigin: 'Down',
                orderNum: this.childComponents[this.childComponents.length - 2].orderNum + 1,
                image: {
                    githubUrl: ele.plugin.githubUrl,
                    name: ele.plugin.name
                } as BlockImageModel
            } as BlockRuntimeModel
        })
        console.log('app', this.childComponents)
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
                return true
            }
        return false
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
            return true
        }
        return false
    }

    onBtnMoveBack() {
        this.router.navigate(['/runtime/block/list'])
    }

    findById(id: string) {
        return this.childComponents.filter(i => i.ref === id)
    }

    onSortChageRequested(event) {
        console.log('e', event, this.findById(event.ele.id))
        const tmp = this.findById(event.ele.id)
        if (tmp.length <= 0) {
            return
        }

        const idx = this.childComponents.indexOf(tmp[0])

        if ((event.dir === -1 && idx <= 1) || (event.dir === 1 && idx >= this.childComponents.length - 2)) {
            return
        }

        const orderNumTmp = this.childComponents[idx].orderNum
        this.childComponents[idx].orderNum = this.childComponents[idx + event.dir].orderNum
        this.childComponents[idx + event.dir].orderNum = orderNumTmp

        const xTmp = this.childComponents[idx].x
        this.childComponents[idx].x = this.childComponents[idx + event.dir].x
        this.childComponents[idx + event.dir].x = xTmp

        const yTmp = this.childComponents[idx].y
        this.childComponents[idx].y = this.childComponents[idx + event.dir].y
        this.childComponents[idx + event.dir].y = yTmp

        const compTmp = this.childComponents[idx]
        this.childComponents[idx] = this.childComponents[idx + event.dir]
        this.childComponents[idx + event.dir] = compTmp

        console.log('list', this.childComponents)

        this.draw()
    }

    onBtnSubmitClicked() {
        console.log('asdf', this.childComponents)
        const {block, blockLink, runtime} = this.splitBlockComponentsFromChildComponents(this.childComponents)
        console.log('block', block)
        console.log('blockLink', blockLink)
        console.log('runtime', runtime)
        let promiseList = []
        promiseList.push(this.submitBlock(block, blockLink))
        promiseList = promiseList.concat(this.submitBlockLink(blockLink))
        promiseList = promiseList.concat(this.submitRuntime(runtime))

        Promise.all(promiseList)
        .then(res => {
            console.log('res', res as BasicResponseModel[])
            let allOk = true
            res.forEach(response => {
                if(!response.success) {
                    allOk = false
                }
            })

            this._snackBar.open(allOk ? environment.MSG_OK : environment.MSG_SOME_FAIL, 'OK', {
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 5000
            });
            this.initData()
        })
    }

    submitBlock(block: RuntimeItemPosModel, blockLink: RuntimeItemPosModel) {
        const blockData = block.data as BlockModel
        if (!blockData) {
            throw new Error('Block data undefined')
        }
        if ((block.data as BlockModel).registerDatetime) {
            return this.httpService.reqPut('runtimeBlock', {
                blockID: blockData.blockId,
                name: blockData.name,
                enabled: blockData.enabled,
                order_num: blockData.orderNum,
                x: block.x,
                y: block.y,
                linkX: blockLink.x,
                linkY: blockLink.y
            } as ReqBlockModel, null).toPromise()
        } else {
            return this.httpService.reqPost('runtimeBlock', {
                blockID: blockData.blockId,
                name: blockData.name,
                enabled: blockData.enabled,
                order_num: blockData.orderNum,
                x: block.x,
                y: block.y,
                linkX: blockLink.x,
                linkY: blockLink.y
            } as ReqBlockModel, null).toPromise()
        }
    }

    submitBlockLink(blockLink: RuntimeItemPosModel) {
        const promiseList = [];
        (blockLink.data as BlockLinkModel[]).forEach(_blockLink => {
            if (_blockLink.blockLinkId) {
                promiseList.push(this.httpService.reqPut('runtimeLink', {
                    blockLinkID: _blockLink.blockLinkId,
                    blockID: _blockLink.blockId,
                    nextBlockID: _blockLink.nextBlockId,
                    messageText: _blockLink.messageText,
                    action: _blockLink.action,
                    label: _blockLink.label,
                    webLinkUrl: _blockLink.webLinkUrl,
                    enabled: _blockLink.enabled,
                    order_num: _blockLink.orderNum
                } as ReqBlockLinkModel, null).toPromise())
            } else {
                promiseList.push(this.httpService.reqPost('runtimeLink', {
                    blockID: _blockLink.blockId,
                    nextBlockID: _blockLink.nextBlockId,
                    messageText: _blockLink.messageText,
                    action: _blockLink.action,
                    label: _blockLink.label,
                    webLinkUrl: _blockLink.webLinkUrl,
                    enabled: _blockLink.enabled,
                    order_num: _blockLink.orderNum
                } as ReqBlockLinkModel, null).toPromise())
            }
        })
        return promiseList
    }

    submitRuntime(runtimeList: RuntimeItemPosModel[]) {
        const promiseList = []
        runtimeList.forEach(runtime => {
            const runtimeData = runtime.data as BlockRuntimeModel
            if((runtime.data as BlockRuntimeModel).blockRuntimeId) {
                promiseList.push(this.httpService.reqPut('runtime/modify', {
                    blockRuntimeID: runtimeData.blockRuntimeId,
                    blockID: runtimeData.blockId,
                    imageID: runtimeData.imageId,
                    order_num: runtimeData.orderNum,
                    container_url: runtimeData.containerUrl,
                    container_port: runtimeData.containerPort,
                    container_env: runtimeData.containerEnv,
                    x: runtime.x,
                    y: runtime.y
                } as ReqBlockRuntimeModel, null).toPromise())
            } else {
                promiseList.push(this.httpService.reqPost('runtime/register', {
                    blockID: runtimeData.blockId,
                    imageID: runtimeData.imageId,
                    order_num: runtimeData.orderNum,
                    container_url: runtimeData.containerUrl,
                    container_port: runtimeData.containerPort,
                    container_env: runtimeData.containerEnv,
                    x: runtime.x,
                    y: runtime.y
                } as ReqBlockRuntimeModel, null).toPromise())
            }
        })
        return promiseList
    }

    splitBlockComponentsFromChildComponents(childComponents: RuntimeItemPosModel[]) {
        if (childComponents.length < 2) {
            return {
                block: undefined,
                blockLink: undefined,
                runtime: undefined
            }
        }
        return {
            block: childComponents[0],
            blockLink: childComponents[childComponents.length - 1],
            runtime: childComponents.slice(1, childComponents.length - 1)
        }
    }

    onRuntimeDeleteReq(event) {
        if (event.runtime.blockRuntimeId) {
            this.httpService.reqDelete(`runtime/${event.runtime.blockRuntimeId}`, null).toPromise()
            .then(res => {
                this.initData()
            })
        } else {
            const component = this.childComponents.find(i => i.ref === event.id)
            if (component) {
                this.childComponents.splice(this.childComponents.indexOf(component), 1)
                this.draw()
            }
        }
    }
}