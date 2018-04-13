import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-date-picker',
  templateUrl: './cn-date-picker.component.html',
})
export class CnDatePickerComponent implements OnInit {
    date;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
