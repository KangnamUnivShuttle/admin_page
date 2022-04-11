import { Component, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpService } from '../../services/http.services';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { BasicResponseModel } from '../../models/basicResponse.model';

@Component({
  templateUrl: 'block.component.html'
})
export class BlockComponent implements OnInit {

    constructor(private httpService: HttpService) {
        
    }

    ngOnInit(): void {
        this.httpService.reqGet(`runtimeBlock`, {
            page: 1,
            limit: 10
        })
        .subscribe(data => {
            console.log(data)
        });
    }
}