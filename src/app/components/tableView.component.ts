import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../environments/environment";
import { FormPage } from "../interfaces/formpage.interface";
import {
  TableViewDataModel,
  TableViewHeaderModel,
} from "../interfaces/tableView.interface";
import { HttpService } from "../services/http.services";

@Component({
  templateUrl: "tableView.component.html",
  selector: "table-view",
})
export class TableViewComponent implements OnInit, FormPage {
  totalCnt: number = 0;

  @Input()
  formCardName: string = "Form";

  @Input()
  tableCardName: string = "Table";

  @Input()
  page: number = 1;

  @Input()
  pageSize: number = 10;

  @Input()
  mainForm: FormGroup;

  @Input()
  focusedItem: any;
  @Output() focusedItemChange = new EventEmitter<any>();

  // 현재 선택된 모델에서 사용될 키 값들 목록, 값 은 기본값 내용
  @Input()
  focusedItemModelInfo: { [key: string]: any };

  //@Input()
  // 테이블 데이터 목록
  tableData: any[] = [];

  @Input()
  tableViewData: TableViewDataModel = {
    GET: {
      url: "",
      dataMap: {},
    },
    POST: {
      url: "",
      // insert, put == val <= datamap key
      dataMap: {},
    },
    PUT: {
      url: "",
      dataMap: {},
    },
    DELETE: {
      url: "",
      dataMap: {},
    },
  };

  @Input()
  // col: column name
  // val: table data row key
  tableHeader: TableViewHeaderModel[] = [];

  @Input()
  uniqueKey: string;

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.resetFocusedItem();
  }

  isValidDelBtn() {
    return this.focusedItem && this.focusedItem[this.uniqueKey];
  }

  isValidTableViewData(method: string) {
    return (
      this.tableViewData &&
      this.tableViewData[method] &&
      this.tableViewData[method].url
    );
  }

  showSnackbarMsg(msg: string = environment.MSG_SOME_FAIL) {
    this._snackBar.open(msg, "OK", {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 5000,
    });
  }

  getDataMappedData(method: string, dataFrom: any) {
    if (!this.isValidTableViewData(method)) {
      console.warn(
        `[TableViewComponent] [getDataMappedData] table view data method ${method} undefined`
      );
      return;
    }

    const result = {};
    Object.keys(this.tableViewData[method].dataMap).forEach((key) => {
      result[this.tableViewData[method].dataMap[key]] = dataFrom[key];
    });
    return result;
  }

  ngOnInit(): void {
    this.initData(this.page, this.pageSize);
  }

  initData(page: number = 1, pageSize: number = 10, isAppend: boolean = false) {
    if (!this.isValidTableViewData("GET")) {
      console.warn(
        "[TableViewComponent] [initData] table view data method get undefined"
      );
      return;
    }

    this.httpService
      .reqGet(this.tableViewData["GET"].url, {
        // ...this.tableViewData["GET"].dataMap,
        page,
        pageSize,
      })
      .toPromise()
      .then((res) => {
        if (res.success) {
          this.showSnackbarMsg(environment.MSG_OK);
          if (res.data && res.data.length > 0) {
            this.totalCnt = Number(res.data[0].cnt);
            this.tableData = res.data.slice(1, res.data.length);
            console.log("data", this.tableData);
          } else {
            console.warn("[TableViewComponent] [initData] data len <= 0");
          }
        } else {
          this.showSnackbarMsg();
          console.warn("[TableViewComponent] [initData] failed to load data");
        }
      })
      .catch((err) => {
        console.error(`[TableViewComponent] [initData] error: ${err.message}`);
      });
  }

  resetFocusedItem() {
    if (!this.focusedItemModelInfo) {
      console.warn(
        "[TableViewComponent] [resetFocusedItem] focused item model info undefined"
      );
      return;
    }

    const resetObj = {};
    Object.keys(this.focusedItemModelInfo).forEach((key) => {
      // this.focusedItem[key] = this.focusedItemModelInfo[key];
      resetObj[key] = this.focusedItemModelInfo[key];
    });
    this.focusedItem = resetObj;

    this.focusedItemChange.emit(this.focusedItem);
  }

  onRowClicked(row: any) {
    if (
      this.focusedItem &&
      this.focusedItem[this.uniqueKey] === row[this.uniqueKey]
    ) {
      this.resetFocusedItem();
    } else {
      this.focusedItem = row;
    }
    this.focusedItemChange.emit(this.focusedItem);
  }

  onBtnSubmitClicked() {
    if (this.focusedItem[this.uniqueKey]) {
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

  onBtnCancelClicked() {
    this.resetFocusedItem();
  }

  reqInsertData(data: any) {
    const method = "POST";
    if (!this.isValidTableViewData(method)) {
      console.warn(
        `[TableViewComponent] [reqInsertData] table view data method ${method} undefined`
      );
      return;
    }
    this.httpService
      .reqPost(
        this.tableViewData[method].url,
        this.getDataMappedData(method, data),
        null
      )
      .toPromise()
      .then((res) => {
        if (res.success) {
          this.showSnackbarMsg(environment.MSG_OK);
          this.resetFocusedItem();
          this.initData(this.page, this.pageSize);
        } else {
          this.showSnackbarMsg();
          console.warn(
            `[TableViewComponent] [reqInsertData] failed to ${method} data`
          );
        }
      })
      .catch((err) => {
        console.error(
          `[TableViewComponent] [reqInsertData] error: ${err.message}`
        );
      });
  }

  reqUpdateData(data: any) {
    const method = "PUT";
    if (!this.isValidTableViewData(method)) {
      console.warn(
        `[TableViewComponent] [reqUpdateData] table view data method ${method} undefined`
      );
      return;
    }
    this.httpService
      .reqPut(
        this.tableViewData[method].url,
        this.getDataMappedData(method, data),
        null
      )
      .toPromise()
      .then((res) => {
        if (res.success) {
          this.showSnackbarMsg(environment.MSG_OK);
          this.resetFocusedItem();
          this.initData(this.page, this.pageSize);
        } else {
          this.showSnackbarMsg();
          console.warn(
            `[TableViewComponent] [reqUpdateData] failed to ${method} data`
          );
        }
      })
      .catch((err) => {
        console.error(
          `[TableViewComponent] [reqUpdateData] error: ${err.message}`
        );
      });
  }

  reqDeleteData(data: any) {
    const method = "DELETE";
    if (
      !this.isValidTableViewData(method) &&
      !this.tableViewData[method].dataMap.hasOwnProperty("key")
    ) {
      console.warn(
        `[TableViewComponent] [reqDeleteData] table view data method ${method} undefined`
      );
      return;
    }
    this.httpService
      .reqDelete(
        `${this.tableViewData[method].url}/${
          data[this.tableViewData[method].dataMap["key"]]
        }`,
        null
      )
      .toPromise()
      .then((res) => {
        if (res.success) {
          this.showSnackbarMsg(environment.MSG_OK);
          this.resetFocusedItem();
          this.initData(this.page, this.pageSize);
        } else {
          this.showSnackbarMsg();
          console.warn(
            `[TableViewComponent] [reqDeleteData] failed to ${method} data`
          );
        }
      })
      .catch((err) => {
        console.error(
          `[TableViewComponent] [reqDeleteData] error: ${err.message}`
        );
      });
  }
}
