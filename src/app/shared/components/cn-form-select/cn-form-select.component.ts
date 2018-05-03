import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-form-select',
  templateUrl: './cn-form-select.component.html',
})
export class CnFormSelectComponent implements OnInit {
    @Input() config;
    @Input() formGroup;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }
}
