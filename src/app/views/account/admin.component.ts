import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  FormPage,
  TemplateFormPage,
} from "../../interfaces/formpage.interface";
import {
  TableViewHeaderModel,
  TableViewDataModel,
} from "../../interfaces/tableView.interface";

@Component({
  templateUrl: "admin.component.html",
})
export class AdminComponent implements OnInit, TemplateFormPage {
  tableHeader: TableViewHeaderModel[];
  tableViewData: TableViewDataModel;
  uniqueKey: string;
  focusedItem: any;
  focusedItemModelInfo: any;
  mainForm = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
}
