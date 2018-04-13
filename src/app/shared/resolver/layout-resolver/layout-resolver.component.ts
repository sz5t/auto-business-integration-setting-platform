import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-layout-resolver',
  templateUrl: './layout-resolver.component.html',
})
export class LayoutResolverComponent implements OnInit {
  @Input() config;
  _isRows = false;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
    this._isRows = Array.isArray(this.config.rows);
  }

  getMenuData(event) {
    this.config = event;
  }

}
