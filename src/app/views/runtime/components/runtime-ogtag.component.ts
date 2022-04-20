import { Component, Input, OnInit } from "@angular/core";
import { HttpService } from "../../../services/http.services";
// import * as ogs from 'open-graph-scraper'

@Component({
    selector: 'runtime-ogtag',
    templateUrl: 'runtime-ogtag.component.html'
})
export class RuntimeOgtagComponent implements OnInit {

    @Input()
    url: string = 'https://github.com/KangnamUnivShuttle'

    constructor(private httpService: HttpService) {}

    ngOnInit(): void {
        // this.httpService.reqGet(`https://developers.facebook.com/tools/debug/`,
        // {q: encodeURIComponent(this.url)}).toPromise()
        // .then(res => {
        //     console.log('res', res)
        // })
        // ogs({url: this.url})
        // .then(res => {
        //     console.log('res', res)
        // })
    }
}