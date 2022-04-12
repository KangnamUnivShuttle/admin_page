import { Component } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  templateUrl: 'runtime-flow.component.html'
})
export class RuntimeFlowComponent {

  imageList = [{
    title: 'asdf #1'
  },
  {
    title: 'asdf #2'
  },
  {
    title: 'asdf #3'
  }];
  runtimeList = [{
    title: 'runtime #1'
  },
  {
    title: 'runtime #2'
  },
  {
    title: 'runtime #3'
  }];


  onDragStart(event) {
    console.log('start', event)
  }

  onDrop(event) {
    event.preventDefault()
    console.log('drop', event)
  }

  onDragOver(event) {
    // console.log('over', event)
    event.preventDefault()
  }
}