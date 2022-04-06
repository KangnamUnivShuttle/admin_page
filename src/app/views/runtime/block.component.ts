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
        const params = new HttpParams()
        params.set('page', '1')
        params.set('limit', '10')

        this.httpService.reqGet(`${environment.host}runtimeBlock`, {
            params
        })
        .subscribe(data => {
            console.log(data)
        });
    }
}