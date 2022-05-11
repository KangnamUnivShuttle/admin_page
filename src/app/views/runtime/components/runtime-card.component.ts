import { ChangeDetectionStrategy } from "@angular/compiler/src/compiler_facade_interface";
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
  ApplicationRef,
  ViewChild,
} from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BasicResponseModel } from "../../../models/basicResponse.model";
import { HttpService } from "../../../services/http.services";
import {
  BlockRuntimeModel,
  ReqBlockRuntimeModel,
  ReqBlockRuntimeStateModel,
} from "../block.model";
import { RuntimeItem } from "../../../interfaces/template.interface";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "runtime-card",
  templateUrl: "runtime-card.component.html",
})
export class RuntimeCardComponent
  implements OnInit, RuntimeItem, AfterViewChecked
{
  @ViewChild("myModal") public myModal: ModalDirective;
  stateList = ["start", "stop", "remove", "Down"];

  recentLog = "";

  @Input()
  data: BlockRuntimeModel;

  @Input()
  id: string = environment.DEFAULT_RUNTIME_ID;

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
  @Output() onSortChange: EventEmitter<{ dir: number; ele: any }> =
    new EventEmitter();
  @Output() onDeleteRequested: EventEmitter<{
    runtime: BlockRuntimeModel;
    id: string;
  }> = new EventEmitter();

  lastX: number = 0;
  lastY: number = 0;
  w: number;
  h: number;
  backupX: number;
  backupY: number;

  render: boolean = true;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private httpService: HttpService
  ) {}

  ngAfterViewChecked(): void {
    // console.log('checked', this.elementRef.nativeElement.getBoundingClientRect(), this.elementRef.nativeElement.querySelector('div'), this.elementRef.nativeElement.querySelector('div').getBoundingClientRect())
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

  onDragStart(event) {
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
    this.backupX = this.x;
    this.backupY = this.y;
    this.x += event.x - this.lastX;
    this.y += event.y - this.lastY;
  }

  onResized(event: any) {
    console.log("re", event);
  }

  onBtnShowLog() {}

  onBtnSortChange(dir: number) {
    this.onSortChange.emit({
      dir,
      ele: this,
    });
  }

  onBtnDeleteClicked(runtime: BlockRuntimeModel) {
    if (!confirm(environment.MSG_DELETE_WARN)) {
      return;
    }
    this.onDeleteRequested.emit({
      runtime,
      id: this.id,
    });
  }

  updateRuntimeInfo(runtime: BlockRuntimeModel): Promise<BasicResponseModel> {
    if (runtime.blockRuntimeId) {
      return this.httpService
        .reqPut(
          "runtime/modify",
          {
            blockRuntimeID: runtime.blockRuntimeId,
            blockID: runtime.blockId,
            imageID: runtime.imageId,
            order_num: runtime.orderNum,
            container_url: runtime.containerUrl,
            container_port: runtime.containerPort,
            container_env: runtime.containerEnv,
            x: this.x,
            y: this.y,
          } as ReqBlockRuntimeModel,
          null
        )
        .toPromise();
    } else {
      return Promise.resolve({ success: true } as BasicResponseModel);
    }
  }

  onRuntimeStateChange(runtime: BlockRuntimeModel, silence: boolean = false) {
    this.render = false;
    if (!silence && !confirm(environment.MSG_CHANGE_STATE_WARN)) {
      this.appRef.tick();
      this.cdr.detectChanges();
      console.log(
        "can u see me?",
        this.data.containerState,
        runtime.containerStateOrigin
      );
      this.data.containerState = runtime.containerStateOrigin;
      console.log(
        "can u see me?",
        this.data.containerState,
        runtime.containerStateOrigin
      );
      this.appRef.tick();
      this.cdr.detectChanges();
      this.render = true;
      return;
    }
    this.render = true;
    console.log(
      "can u see asdfas?",
      this.data.containerState,
      runtime.containerStateOrigin
    );
    if (
      runtime.blockRuntimeId &&
      (runtime.containerState !== runtime.containerStateOrigin || silence)
    ) {
      this.updateRuntimeInfo(runtime).then((res) => {
        if (res.success) {
          runtime.containerStateOrigin = runtime.containerState;
          this.httpService
            .reqPost(
              "runtime/state",
              {
                blockRuntimeID: runtime.blockRuntimeId,
                container_name: runtime.containerUrl,
                container_state: runtime.containerState,
                image_url: runtime.image.githubUrl,
                cpu: "0.1",
                ram: "128M",
                path: ".",
                env: runtime.containerEnv.split("\n"),
              } as ReqBlockRuntimeStateModel,
              null
            )
            .toPromise()
            .then((_res) => {
              if (_res.message) {
                this.recentLog = _res.message;
              }
            });
        }
      });
    } else {
      return;
    }
  }

  onBtnUpdateReq(runtime: BlockRuntimeModel) {
    if (!confirm(environment.MSG_CONTAINER_BUILD_REQ_NOTIFY)) {
      return;
    }

    this.httpService
      .reqPost(
        "runtime/state",
        {
          blockRuntimeID: runtime.blockRuntimeId,
          container_name: runtime.containerUrl,
          container_state: "build",
          image_url: runtime.image.githubUrl,
          cpu: "0.1",
          ram: "128M",
          path: ".",
          env: runtime.containerEnv.split("\n"),
        } as ReqBlockRuntimeStateModel,
        null
      )
      .toPromise()
      .then((res) => {
        if (res.message) {
          this.recentLog = res.message;
        }
        this.onRuntimeStateChange(runtime, true);
      });
  }

  dynamicStateList() {
    if (this.data.containerState === "Down") {
      return ["start", "Down"];
    } else if (this.data.containerState === "start") {
      return ["start", "stop"];
    } else if (this.data.containerState === "stop") {
      return ["start", "stop", "remove"];
    } else if (this.data.containerState === "remove") {
      return ["remove", "Down"];
    }
  }
}
