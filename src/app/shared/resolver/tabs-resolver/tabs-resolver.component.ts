import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {CommonUtility} from "@core/utility/common-utility";

@Component({
  selector: 'cn-tabs-resolver',
  templateUrl: './tabs-resolver.component.html',
})
export class TabsResolverComponent implements OnInit {
  @Input() layoutId;
  @Input() config;
  isVisible = false;
  _tabName;
  isEdit = false;
  _tab;
  _index;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

  uuID(w){
    let s="";
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < w; i++) {
      s += str.charAt(Math.round(Math.random() * (str.length - 1)));
    }
    return s;
  }

  showModal = (type) => {
    if (type === 'new') {
      this.isEdit = false;
      //this._tabName = this._tab.name;
    } else if (type === 'edit'){
      this.isEdit = true;
      //this._tabName = name;
    }
    this.isVisible = true;
  };

  handleOk = (e) => {
    if(this.isEdit) {
      this._tab.name = this._tabName;
    } else {
      const id = `tab_${this.uuID(6)}`;
      //this._tab.id = id;
      this.config.push({
        id: id,
        name: this._tabName
      });
      this._index = this.config.length -1;
    }

    this.isVisible = false;
  };

  handleCancel = (e) => {
    this.isVisible = false;
  };


  selectedTab = (tab) => {
    this._tab = tab;
  }

  closeTab(tab: any): void {
    this.config.splice(this.config.indexOf(tab), 1);
  }

}
