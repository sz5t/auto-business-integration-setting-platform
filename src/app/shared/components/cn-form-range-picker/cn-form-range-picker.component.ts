import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-form-range-picker',
  templateUrl: './cn-form-range-picker.component.html',
})
export class CnFormRangePickerComponent implements OnInit {
    date;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
