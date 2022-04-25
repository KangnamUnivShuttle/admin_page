import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormPage } from "../../interfaces/formpage.interface";

@Component({
  templateUrl: "statistics.component.html",
})
export class StatisticsComponent implements OnInit, FormPage {
  totalCnt: number;
  page: number;
  pageSize: number;
  mainForm: FormGroup;
  focusedItem: any;
  tableData: any[];

  initData() {}

  onRowClicked(row: any) {}

  onBtnSubmitClicked() {}

  onBtnDeleteClicked() {}

  reqInsertData(data: any) {}

  reqUpdateData(data: any) {}

  reqDeleteData(data: any) {}

  ngOnInit(): void {}
}
