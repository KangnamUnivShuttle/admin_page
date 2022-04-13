import { Component, OnDestroy, OnInit } from '@angular/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpService } from '../../services/http.services';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { BasicResponseModel } from '../../models/basicResponse.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: 'block.component.html'
})
export class BlockComponent implements OnInit, OnDestroy {

    blockList = []
    blockSubscription: Subscription;
    
    focusedBlock = {
        blockId: null,
        name: null,
        enabled: null,
        deleteable: null
    };
    
    blockId: string = null;
    name: string = null;

    mainForm = this.formBuilder.group({
      blockId: new FormControl(this.focusedBlock.blockId, [Validators.required]),
      name: new FormControl(this.focusedBlock.name, [Validators.required])
    })

    constructor(private httpService: HttpService,
        private formBuilder: FormBuilder,
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
        if(this.focusedBlock && this.focusedBlock.blockId === block.blockId) {
            this.focusedBlock = {
                blockId: null,
                name: null,
                enabled: null,
                deleteable: null
            }
        } else {
        this.focusedBlock = block

        }
    }

    onBtnEditRuntimeClicked() {
        if(this.focusedBlock) {
            this.router.navigate([`/runtime/block/flow/${this.focusedBlock.blockId}`])
        }
    }
}