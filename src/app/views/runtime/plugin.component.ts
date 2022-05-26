import { Component, OnInit } from "@angular/core";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { HttpService } from "../../services/http.services";
import { BlockImageModel, ReqBlockImageModel } from "./block.model";
import {
  FormPage,
  TemplateFormPage,
} from "../../interfaces/formpage.interface";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { environment } from "../../../environments/environment";
import { InfiniteScrollService } from "../../services/infiniteScroll.services";
import {
  TableViewDataModel,
  TableViewHeaderModel,
} from "../../interfaces/tableView.interface";

@Component({
  templateUrl: "plugin.component.html",
})
export class PluginComponent implements OnInit, TemplateFormPage {
  tableHeader: TableViewHeaderModel[] = [
    {
      col: "ID",
      val: "imageId",
    },
    {
      col: "고유 키",
      val: "name",
    },
    {
      col: "제목",
      val: "title",
    },
    {
      col: "소스 경로",
      val: "githubUrl",
    },
  ];

  tableViewData: TableViewDataModel = {
    GET: {
      url: "plugin",
      dataMap: {},
    },
    POST: {
      url: "plugin",
      dataMap: {
        imageId: "imageID",
        name: "name",
        title: "title",
        orderNum: "order_num",
        githubUrl: "github_url",
      },
    },
    PUT: {
      url: "plugin",
      dataMap: {
        imageId: "imageID",
        name: "name",
        title: "title",
        orderNum: "order_num",
        githubUrl: "github_url",
      },
    },
    DELETE: {
      url: "plugin",
      dataMap: {
        key: "imageId",
      },
    },
  };

  uniqueKey = "imageId";

  focusedItem: BlockImageModel = {} as BlockImageModel;

  focusedItemModelInfo = {
    imageId: 0,
    name: "",
    title: "",
    orderNum: 0,
    githubUrl: "",
  };

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

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {}

  test(e) {
    console.log(e);
    console.log("f", this.focusedItem);
  }
}
