import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';

@Component({
  selector: 'app-block-setting',
  templateUrl: './block-setting.component.html',
})
export class BlockSettingComponent implements OnInit {
  // 加载模块数据
  _funcOptions: any[] = [];
  _funcValue;
  _layoutNameValue;
  _layoutConfig;
  // 布局列表数据
  _layoutList = [];
  _selectedModuleText;
  _layoutId;
  constructor(
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    const params = { _select: 'Id,Name,ParentId' };
    const moduleData = await this.getModuleData(params);
    // 初始化模块列表，将数据加载到及联下拉列表当中
    this._funcOptions = this.arrayToTree(moduleData.Data, '');
  }

  // 改变模块选项
  _changeModuleValue($event?) {
    this._layoutList = [];
    // 选择功能模块，首先加载服务端配置列表
    // const params = new HttpParams().set('TagA', this._funcValue.join(','));
    if (this._funcValue.length > 0) {
      const params = {
        ModuleId: this._funcValue[this._funcValue.length - 1],
        _select: 'Id,Name,Metadata'
      };
      this.getLayoutConfigData(params).then(serverLayoutData => {
        if (serverLayoutData.Status === 200 && serverLayoutData.Data.length > 0) {
          serverLayoutData.Data.forEach((data, index) => {
            const metadata = JSON.parse(data.Metadata);
            this._layoutList.push({ label: data.Name, value: { id: data.Id, metadata: metadata } });
          });
        } else {
          this._layoutList = [];
        }

      });
    }
  }

  // 获取布局设置列表
  getLayoutConfigData(params) {
    return this.apiService.getProj(APIResource.LayoutSetting, params).toPromise();
  }

  // 获取模块信息
  async getModuleData(params) {
    return this.apiService.getProj(APIResource.AppModuleConfig, params).toPromise();
  }

  // 选择布局名称
  _changeLayoutName($event) {
    // 创建布局
    this._layoutConfig = $event.metadata;
    //
    this._layoutId = $event.id;
  }

  _onSelectionChange(selectedOptions: any[]) {
    this._selectedModuleText = `【${selectedOptions.map(o => o.label).join(' / ')}】`;
  }

  arrayToTree(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        const obj = { 'label': data[i].Name, 'value': data[i].Id };
        temp = this.arrayToTree(data, data[i].Id);
        if (temp.length > 0) {
          obj['children'] = temp;
        } else {
          obj['isLeaf'] = true;
        }
        result.push(obj);
      }
    }
    return result;
  }

}
