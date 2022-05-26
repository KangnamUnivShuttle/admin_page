import { FormGroup } from "@angular/forms";
import {
  TableViewDataModel,
  TableViewHeaderModel,
} from "./tableView.interface";

export interface FormPage {
  totalCnt: number;
  page: number;
  pageSize: number;
  mainForm: FormGroup;

  focusedItem: any;
  tableData: any[];

  initData(page: number, pageSize: number, isAppend: boolean);
  resetFocusedItem();
  onRowClicked(row: any);
  onBtnSubmitClicked();
  onBtnDeleteClicked();
  onBtnCancelClicked();

  reqInsertData(data: any);
  reqUpdateData(data: any);
  reqDeleteData(data: any);
}

export interface TemplateFormPage {
  tableHeader: TableViewHeaderModel[];

  tableViewData: TableViewDataModel;

  uniqueKey: string;

  focusedItem: any;

  focusedItemModelInfo: any;

  mainForm: FormGroup;
}
