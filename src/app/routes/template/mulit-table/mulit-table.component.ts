import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-mulit-table',
  templateUrl: './mulit-table.component.html',
})
export class MulitTableComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
