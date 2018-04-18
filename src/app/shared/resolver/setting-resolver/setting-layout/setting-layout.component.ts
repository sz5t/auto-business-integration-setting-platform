import { NzMessageService } from 'ng-zorro-antd';
import { APIResource } from '@core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';
import { SettingComponentEditorComponent } from '@shared/resolver/setting-resolver/setting-component/setting-component-editor.component';

@Component({
  selector: 'cn-setting-layout',
  templateUrl: './setting-layout.component.html',
})
export class SettingLayoutComponent implements OnInit {

  @Input() config;
  @Input() layoutId;
  @ViewChild(SettingComponentEditorComponent)
  componentsettingResolver: ComponentSettingResolverComponent;
  _isRows = false;
  isVisible = false;
  isConfirmLoading = false;
  blockEntity: {
    Title: string,
    Icon: string,
    Id: ''
  } = { Title: '', Icon: '', Id: '' };
  constructor(
    private _http: ApiService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    console.log('blockData', this.config);
    if (this.config) {
      this._isRows = Array.isArray(this.config.rows);
    }


  }

  edit() {
    if (this.config) {
      (async () => {
        const block: any = await this._loadBlockData();
        this.blockEntity.Title = block.Data.Title ? block.Data.Title : '';
        this.blockEntity.Icon = block.Data.Icon ? block.Data.Icon : '';
        this.blockEntity.Id = block.Data.Id ? block.Data.Icon : '';
        this.isVisible = true;
      })();
    }
  }

  delete() {

  }

  async _loadBlockData() {
    return this._http.getProj(`${APIResource.BlockSetting}/${this.config.id}`).toPromise();
  }

  _updateBlockData() {
    this._http.putProj(APIResource.BlockSetting, this.blockEntity).subscribe(result => {
      if (result && result.Status === 200) {
        this.message.create('success', '保存成功');
        
        this.isVisible = false;
      } else {
        this.message.create('info', '保存失败');
      }
    }, error => {
      this.message.create('error', error.Message);
    }
    );
  }

  handleOk() {
    this._updateBlockData();
  }

  handleCancel() {
    this.isVisible = false;
  }

}
