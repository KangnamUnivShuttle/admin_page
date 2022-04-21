import { Component, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpService } from '../../services/http.services';
import { BlockImageModel } from './block.model';
import { FormPage } from '../../interfaces/formpage.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'plugin.component.html'
})
export class PluginComponent implements OnInit, FormPage{

  mainForm: FormGroup;
  focusedItem: BlockImageModel;
  tableData: BlockImageModel[] = [];

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,) {}
  
  initData() {
  }

  onBtnSubmitClicked() {
  }

  ngOnInit(): void {
    this.httpService.reqGet('plugin', {}).toPromise()
    .then(res => {
      console.log('res', res)
      this.tableData = res.data;
    })
  }

  onRowClicked(image: BlockImageModel) {
    if(this.focusedItem && this.focusedItem.imageId === image.imageId) {
        this.focusedItem = {
          githubUrl: null,
          imageId: null,
          name: null,
          orderNum: null,
          registerDatetime: null,
          updateDatetime: null
        }
    } else {
      this.focusedItem = image
    }
  }
}