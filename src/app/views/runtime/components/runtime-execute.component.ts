import { Component, Input, OnInit } from "@angular/core";
import { HttpService } from "../../../services/http.services";

@Component({
  selector: "runtime-execute",
  templateUrl: "runtime-execute.component.html",
})
export class RuntimeExecuteComponent implements OnInit {
  @Input()
  blockId: string;

  msg: string;

  sendLog: string[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  onBtnTestClicked() {
    if (!this.msg) {
      return;
    }
    this.sendLog.push(this.msg);
    this.httpService
      .reqPost(
        "runtime/executeRuntime",
        {
          intent: {
            id: this.blockId /* block의 id */,
            name: "스킬테스트" /* block의 이름 */,
          },
          userRequest: {
            timezone: "Asia/Seoul",
            block: {
              id: "5a56ec0008cc1461d75291f6",
              name: "스킬테스트",
            },
            utterance: this.msg /* 사용자가 입력한 대화 내용 */,
            lang: "kr",
            user: {
              id: "test_user" /* 유저의 id 값 */,
              type: "talk_user_id" /* 유저의 값의 종류  */,
              properties: {
                /* 부가적인 아이디 정보들  */ appUserId: "708203191",
                appUserStatus: "REGISTERED",
                plusfriend_user_key: "BlGTEYoiNoSh",
              },
            },
          },
          contexts: [],
          bot: {
            id: "5a548e36aea1a43fa851ecd9",
            name: "또봇",
          },
          action: {
            name: "스킬원" /* 스킬의 이름 */,
            clientExtra:
              "null" /* button 혹은 바로연결에서 넘겨주는 `extra`의 내용 */,
            params: {} /* 스킬 호출시 함께 넘어가는 action parameter */,
            id: "5a56ebaa211ee046633e958d",
            detailParams: {} /* resolve 된 action parameter 내용 */,
          },
        },
        null
      )
      .toPromise()
      .then((res) => {
        // console.log("res", res);
        this.sendLog.push(JSON.stringify(res));
      })
      .catch((err) => {
        this.sendLog.push(err.message);
      });
    this.msg = "";
  }
}
