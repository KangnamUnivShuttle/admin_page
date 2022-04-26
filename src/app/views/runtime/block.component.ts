import { Component, OnDestroy, OnInit } from "@angular/core";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { HttpService } from "../../services/http.services";
import { environment } from "../../../environments/environment";
import { HttpParams } from "@angular/common/http";
import { BasicResponseModel } from "../../models/basicResponse.model";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { FormPage } from "../../interfaces/formpage.interface";
import { BlockModel, ReqBlockModel } from "./block.model";

@Component({
  templateUrl: "block.component.html",
})
export class BlockComponent implements OnInit, OnDestroy, FormPage {
  page: number = 1;
  pageSize: number = 10;
  totalCnt: number = 0;
  tableData: BlockModel[] = [];
  blockSubscription: Subscription;

  focusedItem = {
    blockId: null,
    name: null,
    enabled: null,
    deleteable: null,
    registerDatetime: null,
  } as BlockModel;

  blockId: string = null;
  name: string = null;

  mainForm = this.formBuilder.group({
    blockId: new FormControl(this.focusedItem.blockId, [Validators.required]),
    name: new FormControl(this.focusedItem.name, [Validators.required]),
  });

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  initData() {
    this.blockSubscription = this.httpService
      .reqGet(`runtimeBlock`, {
        page: this.page,
        limit: this.pageSize,
      })
      .subscribe((res) => {
        // console.log(data)
        if (res.data && res.data.length > 0) {
          this.totalCnt = Number(res.data[0].cnt);
          this.tableData = res.data.slice(1, res.data.length);
        }
      });
  }

  onBtnSubmitClicked() {
    if (this.focusedItem.blockId) {
      this.reqUpdateData(this.focusedItem);
    } else {
      this.reqInsertData(this.focusedItem);
    }
  }

  onBtnDeleteClicked() {
    if (!confirm(environment.MSG_DELETE_WARN)) {
      return;
    }

    this.reqDeleteData(this.focusedItem);
  }

  reqInsertData(data: BlockModel) {
    this.httpService
      .reqPost(
        "runtimeBlock",
        {
          name: data.name,
          enabled: data.enabled,
          order_num: data.orderNum,
          x: data.x,
          y: data.y,
          linkX: data.linkX,
          linkY: data.linkY,
          loopable: data.loopable,
        } as ReqBlockModel,
        null
      )
      .toPromise()
      .then((res) => {
        this.initData();
      });
  }

  reqUpdateData(data: BlockModel) {
    this.httpService
      .reqPut(
        "runtimeBlock",
        {
          blockID: data.blockId,
          name: data.name,
          enabled: data.enabled,
          order_num: data.orderNum,
          x: data.x,
          y: data.y,
          linkX: data.linkX,
          linkY: data.linkY,
          loopable: data.loopable,
        } as ReqBlockModel,
        null
      )
      .toPromise()
      .then((res) => {
        this.initData();
      });
  }

  reqDeleteData(data: BlockModel) {
    this.httpService
      .reqDelete(`runtimeBlock/${this.focusedItem.blockId}`, null)
      .toPromise()
      .then((res) => {
        this.initData();
      });
  }

  ngOnDestroy(): void {
    if (this.blockSubscription && !this.blockSubscription.closed) {
      this.blockSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initData();
  }

  onRowClicked(block) {
    if (this.focusedItem && this.focusedItem.blockId === block.blockId) {
      this.focusedItem = {
        blockId: null,
        name: null,
        enabled: null,
        deleteable: null,
        registerDatetime: null,
        x: null,
        y: null,
        linkX: null,
        linkY: null,
      } as BlockModel;
    } else {
      this.focusedItem = block;
    }
  }

  onBtnEditRuntimeClicked() {
    if (this.focusedItem) {
      this.router.navigate([
        `/runtime/block/flow2/${this.focusedItem.blockId}`,
      ]);
    }
  }
}
