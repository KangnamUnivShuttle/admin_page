import { Component, OnDestroy, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpService } from '../../services/http.services';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { BasicResponseModel } from '../../models/basicResponse.model';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'block.component.html'
})
export class BlockComponent implements OnInit, OnDestroy {

    blockList = []
    blockSubscription: Subscription;

    constructor(private httpService: HttpService) {
        
    }
    
    ngOnDestroy(): void {
        if(this.blockSubscription && !this.blockSubscription.closed) {
            this.blockSubscription.unsubscribe()
        }
    }

    ngOnInit(): void {
        this.blockSubscription = this.httpService.reqGet(`runtimeBlock`, {
            page: 1,
            limit: 10
        })
        .subscribe(data => {
            // console.log(data)
            this.blockList = data.data;
        });
    }
}