import 'zone.js';
import 'reflect-metadata';
import { Component, NgModule, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';




@Component({
  selector: 'line-chart,#chart_line',
  encapsulation: ViewEncapsulation.None,
  template: `
  <v-chart [forceFit]="forceFit" [height]="height" [data]="data" [scale]="scale">
      <v-line position="year*value"></v-line>
      <v-point position="year*value" shape="circle"></v-point>
      <v-tooltip></v-tooltip>
      <v-axis></v-axis>
  </v-chart>
  `,
  styles: [
    `
    `
  ]
})
export class LineChartComponent implements OnInit, AfterViewInit {
  forceFit;
  height;
  data;
  width;
  scale;
  constructor() {

  }
  ngOnInit(): void {
    this.data = [
      { year: '1991年', value: 3 },
      { year: '1992年', value: 4 },
      { year: '1993年', value: 3.5 },
      { year: '1994年', value: 5 },
      { year: '1995年', value: 4.9 },
      { year: '1996年', value: 6 },
      { year: '1997年', value: 7 },
      { year: '1998年', value: 9 },
      { year: '1999年', value: 13 }
    ];

    this.height = 400;
    //this.width = 400;
    this.scale = [{
      dataKey: 'value',
      min: 0,
    },
    {
      dataKey: 'year',
      min: 0,
      max: 1,
    }];
    this.forceFit = true;
  }
  ngAfterViewInit(): void {

  }
}

