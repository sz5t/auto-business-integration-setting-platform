import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'cn-date-picker',
  templateUrl: './cn-date-picker.component.html'
})
export class CnDatePickerComponent implements OnInit {
  @Input() config;
  date;
  constructor(
  ) { }

  ngOnInit() {
  }

}
