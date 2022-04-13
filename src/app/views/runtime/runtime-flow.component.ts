import { Component, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.services';
import { BasicResponseModel } from '../../models/basicResponse.model';

@Component({
  templateUrl: 'runtime-flow.component.html'
})
export class RuntimeFlowComponent implements OnInit {

  imageList = [];
  runtimeList = [];
  blockLinkedList = [];

  focusedRuntimeIdx: number = -1;
  focusedImage: any = null

  blockID: string;

  currentBlock = null;


  constructor(private route: ActivatedRoute,
              private httpService: HttpService) {
    this.blockID = this.route.snapshot.params['blockID'] || 'intro';
  }

  ngOnInit(): void {
    Promise.all([
      this.loadBlockData(this.blockID),
      this.loadBlockLinkData(this.blockID),
      this.loadRuntimeData(this.blockID)
    ])
    .then(res => {
      this.currentBlock = res[0].data[0];
      this.blockLinkedList = res[1].data;
      this.runtimeList = res[2].data;
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

  }

  onImageDragStart(event, image) {
    console.log('id', event, image)
    this.focusedImage = image
  }

  onRuntimeDragStart(event, blockRuntime, fromIdx: number) {
    console.log('rd', event, blockRuntime, fromIdx)

    this.focusedRuntimeIdx = fromIdx;
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
      this.runtimeList.splice(idx, 0, this.focusedImage);
      console.log(this.runtimeList)
      this.focusedImage = null
    }
  }

  onDragOver(event) {
    // console.log('over', event)
    event.preventDefault()
  }
}