import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
})
export class TreeTableComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
