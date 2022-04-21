import { FormGroup } from '@angular/forms';

export interface FormPage {
    mainForm: FormGroup;

    focusedItem: any;
    tableData: any[];

    initData();
    onRowClicked(row: any);
    onBtnSubmitClicked();
}