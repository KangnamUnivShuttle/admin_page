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
import { InfiniteScrollService } from "../../services/infiniteScroll.services";

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
    name: new FormControl(this.focusedItem.name, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(7),
    ]),
    title: new FormControl(this.focusedItem.title, [Validators.required]),
    orderNum: new FormControl(this.focusedItem.orderNum, []),
    githubUrl: new FormControl(this.focusedItem.githubUrl, [
      Validators.required,
    ]),
  });

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private infiniteScrollService: InfiniteScrollService
  ) {
    this.resetFocusedItem();

    this.infiniteScrollService.infiniteBroadcaster.subscribe(() => {
      console.log("sdaf");
      this.initData(++this.page, this.pageSize, true);
    });
  }

  onBtnOpenGithubUrl(url: string) {}

  onBtnDeleteClicked() {
    if (!confirm(environment.MSG_DELETE_WARN)) {
      return;
    }

    this.reqDeleteData(this.focusedItem);
  }

  initData(page: number = 1, pageSize: number = 10, isAppend: boolean = false) {
    this.httpService
      .reqGet("plugin", {
        page: page,
        limit: pageSize,
      })
      .toPromise()
      .then((res) => {
        console.log("res", res);
        if (res.data && res.data.length > 0) {
          this.totalCnt = Number(res.data[0].cnt);
          if (isAppend) {
            this.tableData = this.tableData.concat(
              res.data.slice(1, res.data.length)
            );
          } else {
            this.tableData = res.data.slice(1, res.data.length);
          }
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
      title: null,
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
          title: data.title,
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
          title: data.title,
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
