import { FormGroup } from "@angular/forms";

export interface FormPage {
  totalCnt: number;
  page: number;
  pageSize: number;
  mainForm: FormGroup;

  focusedItem: any;
  tableData: any[];

  initData();
  resetFocusedItem();
  onRowClicked(row: any);
  onBtnSubmitClicked();
  onBtnDeleteClicked();
  onBtnCancelClicked();

  reqInsertData(data: any);
  reqUpdateData(data: any);
  reqDeleteData(data: any);
}
