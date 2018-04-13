import { Component, OnInit,Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'app-bsn-tree',
  templateUrl: './bsn-tree.component.html',
})
export class BsnTreeComponent implements OnInit {

    @Input() config;

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
