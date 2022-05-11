import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { environment } from "../../../../environments/environment";
import { HttpService } from "../../../services/http.services";
import { BlockLinkModel } from "../block.model";
import { RuntimeItem } from "../../../interfaces/template.interface";

@Component({
  selector: "runtime-link",
  templateUrl: "runtime-link.component.html",
  styleUrls: ["./runtime-link.component.css"],
})
export class RuntimeLinkComponent
  implements OnInit, RuntimeItem, AfterViewChecked
{
  @Input()
  data: BlockLinkModel[];

  @Input()
  id: string = "untitled";

  @Input()
  drag: string = "view";

  @Input()
  x: number = 0;

  @Input()
  y: number = 0;

  @Input()
  orderNum: number = 0;

  @Output() onDragStartPos: EventEmitter<{
    x: number;
    y: number;
    id: string;
    ele: any;
  }> = new EventEmitter();
  @Output() onRectChange: EventEmitter<{ w: number; h: number }> =
    new EventEmitter();

  lastX: number = 0;
  lastY: number = 0;
  w: number;
  h: number;
  backupX: number;
  backupY: number;

  blockID: string;
  searchBlockName: string;
  searchedBlockList: BlockLinkModel[] = [];
  isBlockLinkDragging: boolean = false;
  swapLinkIdx: number;

  @ViewChild("quickModal") public quickModal: ModalDirective;

  editingQuick: BlockLinkModel = {
    action: null,
    blockId: null,
    blockLinkId: null,
    enabled: null,
    label: null,
    messageText: null,
    nextBlockId: null,
    orderNum: null,
    registerDatetime: null,
    updateDatetime: null,
    webLinkUrl: null,
    isMlCategory: null,
    //   nextBlockName: null
  };

  quickForm = this.formBuilder.group({
    action: new FormControl(this.editingQuick.action, []),
    label: new FormControl(this.editingQuick.label, []),
    messageText: new FormControl(this.editingQuick.messageText, []),
    nextBlockId: new FormControl(this.editingQuick.nextBlockId, []),
    webLinkUrl: new FormControl(this.editingQuick.webLinkUrl, []),
    //   nextBlockName: new FormControl(this.editingQuick.nextBlockName, [])
  });

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private route: ActivatedRoute
  ) {
    this.blockID = this.route.snapshot.params["blockID"] || "intro";
  }

  ngAfterViewChecked(): void {
    const rect = this.elementRef.nativeElement
      .querySelector("div")
      .getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.onRectChange.emit({
      w: rect.width,
      h: rect.height,
    });
  }

  ngOnInit(): void {
    this.backupX = this.x;
    this.backupY = this.y;
  }

  getStyle(): Object {
    return {
      top: `${this.y}px`,
      left: `${this.x}px`,
      cursor: `${this.drag === "view" ? "default" : "move"}`,
    };
  }

  onQuickReplyDragStart(event, blockLink: BlockLinkModel) {
    console.log("st", blockLink);
    this.isBlockLinkDragging = true;
    this.swapLinkIdx = this.data.indexOf(blockLink);
  }

  onQuickReplyDragging(event) {
    event.preventDefault();
  }

  onQuickReplyDragDrop(event, blockLink: BlockLinkModel) {
    event.preventDefault();
    const targetIdx = this.data.indexOf(blockLink);
    if (this.swapLinkIdx >= 0 && targetIdx >= 0) {
      const tmp = this.data[this.swapLinkIdx];
      this.data[this.swapLinkIdx] = this.data[targetIdx];
      this.data[targetIdx] = tmp;
    }
    this.data.forEach((_, idx) => {
      this.data[idx].orderNum = idx;
    });
    console.log("drop data", this.data);
    // this.isBlockLinkDragging = false
  }

  onDragStart(event) {
    if (this.isBlockLinkDragging) {
      return;
    }
    this.lastX = event.x;
    this.lastY = event.y;
    this.onDragStartPos.emit({
      x: event.x,
      y: event.y,
      id: this.id,
      ele: this,
    });
  }

  onDrop(event: any) {
    if (this.isBlockLinkDragging) {
      this.isBlockLinkDragging = false;
      return;
    }
    this.backupX = this.x;
    this.backupY = this.y;
    this.x += event.x - this.lastX;
    this.y += event.y - this.lastY;
  }

  onQuickReplyClicked(blockLink: BlockLinkModel) {
    this.editingQuick = blockLink;
    this.quickModal.show();
  }

  onBtnAddQuickReply() {
    console.log("this.data", this.data, this.data.length);
    this.data.push({
      blockId: this.blockID,
      nextBlockId: null,
      messageText: "내용을 입력해주세요.",
      action: "message",
      label: "라벨 입력",
      webLinkUrl: null,
      enabled: 1,
      orderNum:
        this.data.length >= 1
          ? this.data[this.data.length - 1].orderNum + 1
          : 1,
      registerDatetime: undefined,
      updateDatetime: undefined,
      isMlCategory: 1,
    });
  }

  onBtnSearchBlockClicked() {
    this.httpService
      .reqGet("runtimeBlock", { name: this.searchBlockName })
      .toPromise()
      .then((res) => {
        console.log("re", res);
        if (res.data && res.data.length > 0) {
          this.searchedBlockList = res.data.slice(1, res.data.length);
        }
      });
  }

  onBtnBlockLinkDeleteClicked(blockLink: BlockLinkModel) {
    if (!confirm(environment.MSG_DELETE_WARN)) {
      return;
    }
    const idx = this.data.indexOf(blockLink);
    if (idx < 0) {
      return;
    }
    if (blockLink.blockLinkId) {
      this.httpService
        .reqDelete(`runtimeLink/${blockLink.blockLinkId}`, null)
        .toPromise()
        .then((res) => {
          if (res.success) {
            this.data.splice(idx, 1);
          }
        });
    } else {
      this.data.splice(idx, 1);
    }
    this.quickModal.hide();
  }
}
