import { Component, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpService } from '../../services/http.services';
import { BlockImageModel } from './block.model';

@Component({
  templateUrl: 'plugin.component.html'
})
export class PluginComponent implements OnInit{

  blockImageList: BlockImageModel[] = [];
  focusedBlockImage: BlockImageModel;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.reqGet('plugin', {}).toPromise()
    .then(res => {
      console.log('res', res)
      this.blockImageList = res.data;
    })
  }

  onRowClicked(image: BlockImageModel) {
    if(this.focusedBlockImage && this.focusedBlockImage.imageId === image.imageId) {
        this.focusedBlockImage = {
          githubUrl: null,
          imageId: null,
          name: null,
          orderNum: null,
          registerDatetime: null,
          updateDatetime: null
        }
    } else {
      this.focusedBlockImage = image
    }
  }
}