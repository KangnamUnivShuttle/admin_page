import { FormGroup } from "@angular/forms";

export interface FormPage {
  mainForm: FormGroup;

  focusedItem: any;
  tableData: any[];

  initData();
  onRowClicked(row: any);
  onBtnSubmitClicked();
  onBtnDeleteClicked();

  reqInsertData(data: any);
  reqUpdateData(data: any);
  reqDeleteData(data: any);
}
