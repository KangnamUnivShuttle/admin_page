import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.services';
import { BasicResponseModel } from '../../models/basicResponse.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BlockImageModel, BlockLinkModel, BlockModel, BlockRuntimeModel } from './block.model';

@Component({
  templateUrl: 'runtime-flow.component.html'
})
export class RuntimeFlowComponent implements OnInit {
  
  @ViewChild('quickModal') public quickModal: ModalDirective;

  imageList: BlockImageModel[] = [];
  runtimeList: BlockRuntimeModel[] = [];
  blockLinkedList: BlockLinkModel[] = [];

  focusedRuntimeIdx: number = -1;
  focusedImage: BlockImageModel = null
  focusedQuickIdx: number = -1

  searchedBlockList: BlockModel[] = []
  searchBlockName: string = ''
  editingQuick = {
    action: null,
    blockId: null,
    blockLinkId: null,
    enabled: null,
    label: null,
    messageText: null,
    nextBlockId: null,
    orderNum: null,
    registerDatetime: null,
    updateDatetime: null,
    webLinkUrl: null,
    nextBlockName: null
  }
  quickForm = this.formBuilder.group({
    action: new FormControl(this.editingQuick.action, []),
    label: new FormControl(this.editingQuick.label, []),
    messageText: new FormControl(this.editingQuick.messageText, []),
    nextBlockId: new FormControl(this.editingQuick.nextBlockId, []),
    webLinkUrl: new FormControl(this.editingQuick.webLinkUrl, []),
    nextBlockName: new FormControl(this.editingQuick.nextBlockName, [])
  })

  stateList = [
    'start',
    'stop',
    'down',
    'ready'
  ]

  blockID: string;

  currentBlock: BlockModel = null;

  searchImageName = '';
  searchForm = this.formBuilder.group({
    searchImageName: new FormControl(this.searchImageName, [Validators.required]),
  })

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private httpService: HttpService) {
    this.blockID = this.route.snapshot.params['blockID'] || 'intro';
  }

  ngOnInit(): void {
    Promise.all([
      this.loadBlockData(this.blockID),
      this.loadBlockLinkData(this.blockID),
      this.loadRuntimeData(this.blockID),
      this.loadImageList('')
    ])
    .then(res => {
      this.currentBlock = res[0].data[0];
      this.blockLinkedList = res[1].data;
      this.runtimeList = res[2].data.map(runtime => {
        return {
          ...runtime,
          containerStateOrigin: runtime.containerState
        }
      });
    })
  }

  onBtnSearchBlockClicked() {
    this.httpService.reqGet('runtimeBlock', {'name': this.searchBlockName}).toPromise()
    .then(res => {
      this.searchedBlockList = res.data
      console.log('searchedBlockList', this.searchedBlockList)
    })
  }

  onBtnQuickModalSubmit() {
    console.log(this.editingQuick, this.blockLinkedList)
    this.quickModal.hide()
  }

  onSearchSubmit() {
    this.loadImageList(this.searchImageName)
    .then(res => {
      // console.log('res', res)
      this.imageList = res.data
    })
  }

  loadBlockData(id: string) {
    return this.httpService.reqGet('runtimeBlock', {'blockID': id}).toPromise()
  }

  loadBlockLinkData(id: string) {
    return this.httpService.reqGet('runtimeLink', {'blockID': id}).toPromise()
  }

  loadRuntimeData(id: string) {
    return this.httpService.reqGet('runtime', {'blockID': id}).toPromise()
  }

  loadImageList(search: string) {
    return this.httpService.reqGet('plugin', {'name': search}).toPromise()
  }

  onBtnCancelClicked() {
    this.router.navigate(['/runtime/block/list'])
  }

  onImageDragStart(event, image) {
    console.log('id', event, image)
    this.focusedImage = image
  }

  onRuntimeDragStart(event, blockRuntime, fromIdx: number) {
    console.log('rd', event, blockRuntime, fromIdx)

    this.focusedRuntimeIdx = fromIdx;
  }

  onBtnQuickAdd() {
    this.blockLinkedList.push({
      label: '라벨 내용 입력',
      action: 'message',
      blockId: this.blockID,
      messageText: '메시지 내용 입력',
      orderNum: this.blockLinkedList.length <= 0 ? 1 : Math.max(...this.blockLinkedList.map(i => i.orderNum)) + 1,
      blockLinkId: 0,
      nextBlockId: '',
      webLinkUrl: '',
      enabled: 1,
      registerDatetime: undefined,
      updateDatetime: undefined
    })
  }

  onBtnQuickClicked(quick, quickIdx) {
    this.quickModal.show();
    this.editingQuick = quick
    // console.log(this.editingQuick)
  }

  onDragStartQuickBtn(event, quickIdx) {
    this.focusedQuickIdx = quickIdx
  }

  onDragDropQuickBtn(event, quickIdx) {
    if (this.focusedQuickIdx >= 0) {
      const tmp = this.blockLinkedList.splice(this.focusedQuickIdx, 1)[0]
      this.blockLinkedList.splice(quickIdx, 0, tmp)
      this.focusedQuickIdx = -1
    }
  }

  onDragStart(event) {
    console.log('start', event)
  }

  onDrop(event) {
    event.preventDefault()
    console.log('drop', event)
  }

  onImageOrRuntimeDropped(event, idx: number) {
    event.preventDefault()
    console.log(idx, 'drop', event, this.focusedRuntimeIdx, this.focusedImage)

    if (this.focusedRuntimeIdx >= 0) {
      const tmp = this.runtimeList.splice(this.focusedRuntimeIdx, 1)[0];
      this.runtimeList.splice(idx, 0, tmp);
      this.focusedRuntimeIdx = -1
    }

    if (this.focusedImage) {
      this.runtimeList.splice(idx, 0, {
        blockId: this.blockID,
        containerEnv: '',
        containerPort: '15000',
        containerState: 'ready',
        containerUrl: `${this.focusedImage.name}_${this.guid()}`,
        imageId: this.focusedImage.imageId,
        orderNum: idx,
        image: this.focusedImage
      } as BlockRuntimeModel);
      console.log(this.runtimeList)
      this.focusedImage = null
    }
  }

  onRuntimeStateChange(runtime, idx) {
    // console.log('asdf', runtime)
    if (runtime.containerState !== runtime.containerStateOrigin && runtime.blockRuntimeId > 0 && confirm('상태 변경 하시겠습니까?')) {
      runtime.containerStateOrigin = runtime.containerState
      this.httpService.reqPost('/runtime/state',
        {
          blockRuntimeID: runtime.blockRuntimeId,
          container_name: `${runtime.image.name}_${this.guid()}`,
          container_state: runtime.containerState,
          image_url: runtime.image.githubUrl,
          cpu: '0.1',
          ram: '128M',
          path: '.',
          env: runtime.containerEnv.split('\n')
        }, null
      ).toPromise()
      .then(res => this.loadRuntimeData(this.blockID))
      .then(res => {
        this.runtimeList = res.data.map(_runtime => {
          return {
            ..._runtime,
            containerStateOrigin: _runtime.containerState
          }
        });
      })
    } else {
      setTimeout(() => {
        console.warn('asdf', runtime.containerState, runtime.containerStateOrigin)
        this.runtimeList[idx].containerState = this.runtimeList[idx].containerStateOrigin
        // runtime.containerState = runtime.containerStateOrigin
        console.warn('run', runtime, this.runtimeList)
        this.cdr.detectChanges();
      }, 1)
    }
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4();
  }

  onDragOver(event) {
    // console.log('over', event)
    event.preventDefault()
  }

  onBtnRemoveRuntime(idx) {
    if(!this.runtimeList[idx].blockRuntimeId) {
      this.runtimeList.splice(idx, 1);
    }
  }

  async onSubmit() {
    const runtimeSubmitList = this.runtimeList.map((runtime, idx) => {
      return {
        ...runtime,
        orderNum: idx
      }
    })

    const blockLinkedSubmitList = this.blockLinkedList.map((blockLink, idx) => {
      return {
        ...blockLink,
        orderNum: idx
      }
    })

    console.log(this.runtimeList, this.blockLinkedList)
    
    const promiseRuntimeList = []
    runtimeSubmitList.forEach(runtime => {
      if(runtime.registerDatetime) {
        promiseRuntimeList.push(this.httpService.reqPut('/runtime/modify', 
        {
          blockRuntimeID: runtime.blockRuntimeId,
          blockID: runtime.blockId,
          imageID: runtime.imageId,
          order_num: runtime.orderNum,
          container_url: runtime.containerUrl,
          container_port: runtime.containerPort,
          container_env: runtime.containerEnv
        }, null).toPromise())
      } else {
        promiseRuntimeList.push(this.httpService.reqPost('/runtime/register', 
        {
          // blockRuntimeID: runtime.blockRuntimeId,
          blockID: runtime.blockId,
          imageID: runtime.imageId,
          order_num: runtime.orderNum,
          container_url: runtime.containerUrl,
          container_port: runtime.containerPort,
          container_env: runtime.containerEnv
        }, null).toPromise())
      }
    })

    blockLinkedSubmitList.forEach(blockLink => {
      if (blockLink.registerDatetime) {
        promiseRuntimeList.push(this.httpService.reqPut('/runtimeLink', {
          blockLinkID: blockLink.blockLinkId,
          blockID: blockLink.blockId,
          nextBlockID: blockLink.nextBlockId,
          messageText: blockLink.messageText,
          action: blockLink.action,
          label: blockLink.label,
          webLinkUrl: blockLink.webLinkUrl,
          enabled: blockLink.enabled,
          order_num: blockLink.orderNum
        }, null).toPromise())
      } else {
        promiseRuntimeList.push(this.httpService.reqPost('/runtimeLink', {
          // blockLinkID: blockLink.blockLinkId,
          blockID: blockLink.blockId,
          nextBlockID: blockLink.nextBlockId,
          messageText: blockLink.messageText,
          action: blockLink.action,
          label: blockLink.label,
          webLinkUrl: blockLink.webLinkUrl,
          enabled: blockLink.enabled,
          order_num: blockLink.orderNum
        }, null).toPromise())
      }
    })

    const reqResult = await Promise.all(promiseRuntimeList)
  }
}