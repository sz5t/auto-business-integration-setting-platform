import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-time-picker',
  templateUrl: './cn-time-picker.component.html',
})
export class CnTimePickerComponent implements OnInit {
  @Input() config;
  _time;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
