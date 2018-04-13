import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-form-checkbox-group',
  templateUrl: './cn-form-checkbox-group.component.html',
})
export class CnFormCheckboxGroupComponent implements OnInit {

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
