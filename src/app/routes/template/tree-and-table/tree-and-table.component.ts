import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-and-table',
  templateUrl: './tree-and-table.component.html',
})
export class TreeAndTableComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
