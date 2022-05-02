import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root",
})
class InfiniteScrollEventBroadcaster extends EventEmitter {}

@Injectable({
  providedIn: "root",
})
export class InfiniteScrollService {
  refreshLine = 300;
  refreshReqSended = false;
  //   https://stackoverflow.com/a/33344803
  constructor(public infiniteBroadcaster: InfiniteScrollEventBroadcaster) {}

  onScroll(event) {
    //scrollTop, scrollHeight, clientHeight

    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollHeight > clientHeight) {
      const scrollGap = scrollHeight - (scrollTop + clientHeight);
      if (!this.refreshReqSended && scrollGap < this.refreshLine) {
        console.log(
          `[InfiniteScrollService] [onScroll] Refresh line ${scrollGap}`
        );
        this.refreshReqSended = true;
        this.infiniteBroadcaster.next();
      } else if (scrollGap >= this.refreshLine) {
        if (this.refreshReqSended) {
          this.refreshReqSended = false;
          console.log(
            `[InfiniteScrollService] [onScroll] Toggle refresh req sended val to false`
          );
        }
      }
    } else if (scrollHeight <= clientHeight) {
      console.warn(
        `[InfiniteScrollService] [onScroll] scrollHeight <= clientHeight, no scroll detected.`
      );
    }
  }
}
