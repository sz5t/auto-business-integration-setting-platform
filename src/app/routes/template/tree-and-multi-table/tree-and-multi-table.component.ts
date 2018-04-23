import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-and-multi-table',
  templateUrl: './tree-and-multi-table.component.html',
})
export class TreeAndMultiTableComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
