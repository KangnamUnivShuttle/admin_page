import { Component, OnDestroy, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpService } from '../../services/http.services';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { BasicResponseModel } from '../../models/basicResponse.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'block.component.html'
})
export class BlockComponent implements OnInit, OnDestroy {

    blockList = []
    blockSubscription: Subscription;
    
    focusedBlock = null;

    constructor(private httpService: HttpService,
        private router: Router) {
        
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

    onRowClicked(block) {
        this.focusedBlock = block
    }

    onBtnEditRuntimeClicked() {
        if(this.focusedBlock) {
            this.router.navigate([`/runtime/block/flow/${this.focusedBlock.blockId}`])
        }
    }
}