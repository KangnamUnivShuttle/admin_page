import { Component, OnInit } from "@angular/core";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { HttpService } from "../../services/http.services";
import { BlockImageModel, ReqBlockImageModel } from "./block.model";
import { FormPage } from "../../interfaces/formpage.interface";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { environment } from "../../../environments/environment";

@Component({
  templateUrl: "plugin.component.html",
})
export class PluginComponent implements OnInit, FormPage {
  page: number = 1;
  pageSize: number = 10;
  totalCnt: number = 0;
  focusedItem: BlockImageModel = {} as BlockImageModel;
  tableData: BlockImageModel[] = [];

  mainForm = this.formBuilder.group({
    imageId: new FormControl(this.focusedItem.imageId, []),
    name: new FormControl(this.focusedItem.name, [Validators.required]),
    orderNum: new FormControl(this.focusedItem.orderNum, []),
    githubUrl: new FormControl(this.focusedItem.githubUrl, [
      Validators.required,
    ]),
  });

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder
  ) {
    this.resetFocusedItem();
  }

  onBtnDeleteClicked() {
    if (!confirm(environment.MSG_DELETE_WARN)) {
      return;
    }

    this.reqDeleteData(this.focusedItem);
  }

  initData() {
    this.httpService
      .reqGet("plugin", {
        page: this.page,
        limit: this.pageSize,
      })
      .toPromise()
      .then((res) => {
        console.log("res", res);
        if (res.data && res.data.length > 0) {
          this.totalCnt = Number(res.data[0].cnt);
          this.tableData = res.data.slice(1, res.data.length);
        }
      });
  }

  onBtnSubmitClicked() {
    if (this.focusedItem.imageId) {
      this.reqUpdateData(this.focusedItem);
    } else {
      this.reqInsertData(this.focusedItem);
    }
  }

  onBtnCancelClicked() {
    this.resetFocusedItem();
  }

  resetFocusedItem() {
    this.focusedItem = {
      githubUrl: null,
      imageId: null,
      name: null,
      orderNum: 1,
      registerDatetime: null,
      updateDatetime: null,
    } as BlockImageModel;
  }

  ngOnInit(): void {
    this.initData();
  }

  onRowClicked(image: BlockImageModel) {
    if (this.focusedItem && this.focusedItem.imageId === image.imageId) {
      this.resetFocusedItem();
    } else {
      this.focusedItem = image;
    }
  }

  reqInsertData(data: BlockImageModel) {
    this.httpService
      .reqPost(
        "plugin",
        {
          name: data.name,
          order_num: data.orderNum,
          github_url: data.githubUrl,
        } as ReqBlockImageModel,
        null
      )
      .toPromise()
      .then((res) => {
        this.initData();
        this.resetFocusedItem();
      });
  }

  reqUpdateData(data: BlockImageModel) {
    this.httpService
      .reqPut(
        "plugin",
        {
          imageID: data.imageId,
          name: data.name,
          order_num: data.orderNum,
          github_url: data.githubUrl,
        } as ReqBlockImageModel,
        null
      )
      .toPromise()
      .then((res) => {
        this.initData();
        this.resetFocusedItem();
      });
  }

  reqDeleteData(data: BlockImageModel) {
    this.httpService
      .reqDelete(`plugin/${data.imageId}`, null)
      .toPromise()
      .then((res) => {
        this.initData();
        this.resetFocusedItem();
      });
  }
}
