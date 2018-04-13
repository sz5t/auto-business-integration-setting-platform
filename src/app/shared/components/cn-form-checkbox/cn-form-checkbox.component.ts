import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-form-checkbox',
  templateUrl: './cn-form-checkbox.component.html',
})
export class CnFormCheckboxComponent implements OnInit {

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
