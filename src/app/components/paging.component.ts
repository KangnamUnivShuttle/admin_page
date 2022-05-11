import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  templateUrl: "paging.component.html",
  selector: "paging",
})
export class PagingComponent implements OnInit {
  @Input()
  page: number = 1;

  @Input()
  pageSize: number = 10;

  @Input()
  totalCnt: number = 0;

  @Output() onPrevBtnClicked: EventEmitter<number> = new EventEmitter();
  @Output() onNextBtnClicked: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {}

  pageBtnGen() {
    return new Array(Math.floor(this.totalCnt / this.pageSize) + 1)
      .fill(0)
      .map((val, idx) => idx + 1);
  }
}
