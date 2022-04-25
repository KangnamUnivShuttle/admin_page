import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { HttpService } from "../../../services/http.services";
import { BlockImageModel } from "../block.model";

@Component({
  selector: "runtime-search",
  templateUrl: "runtime-search.component.html",
})
export class RuntimeSearchComponent implements OnInit {
  pluginImageList: BlockImageModel[] = [
    // {
    //     githubUrl: 'https://github.com/KangnamUnivShuttle/plugin_simple_toss.git',
    //     imageId: 1,
    //     name: 'toss',
    //     orderNum: 1,
    // } as BlockImageModel
  ];

  searchImageName = "";
  searchForm = this.formBuilder.group({
    searchImageName: new FormControl(this.searchImageName, [
      Validators.required,
    ]),
  });

  @Output() onDragStartPos: EventEmitter<{
    x: number;
    y: number;
    id: string;
    ele: any;
  }> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {}

  onSearchSubmit() {
    this.httpService
      .reqGet("plugin", { name: this.searchImageName })
      .toPromise()
      .then((res) => {
        // console.log(res)
        if (res.data && res.data.length > 0) {
          this.pluginImageList = res.data.slice(1, res.data.length);
        }
      });
  }

  onBtnOpenUrlInNewTab(url: string) {
    window.open(url, "_blank").focus();
  }
}
