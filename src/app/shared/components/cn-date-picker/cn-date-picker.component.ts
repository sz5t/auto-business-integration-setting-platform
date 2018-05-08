import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-date-picker',
  templateUrl: './cn-date-picker.component.html',
  styles: [
      `.picker
        {
          width: '250px';
          border: '1px solid #d9d9d9';
          borderRadius: '4px';
          position:absolute;
          z-index: 1000; 
        }
      `
  ]
})
export class CnDatePickerComponent implements OnInit {
    date;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
