import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-form-radio-group',
  templateUrl: './cn-form-radio-group.component.html',
})
export class CnFormRadioGroupComponent implements OnInit {
    _radioValue;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
