import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-and-tabs',
  templateUrl: './tree-and-tabs.component.html',
})
export class TreeAndTabsComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
