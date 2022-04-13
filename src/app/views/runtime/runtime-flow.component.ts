import { Component } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  templateUrl: 'runtime-flow.component.html'
})
export class RuntimeFlowComponent {

  imageList = [{
    title: 'asdf #1',
    imageID: 1,
  },
  {
    title: 'asdf #2',
    imageID: 2
  },
  {
    title: 'asdf #3',
    imageID: 3,
  }];
  runtimeList = [{
    title: 'runtime #1',
    blockRuntimeID: 1
  },
  {
    title: 'runtime #2',
    blockRuntimeID: 2
  },
  {
    title: 'runtime #3',
    blockRuntimeID: 3
  }];

  focusedRuntimeIdx: number = -1;
  focusedImage: any = null

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