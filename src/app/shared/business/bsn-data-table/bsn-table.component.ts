import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';
import { LayoutResolverComponent } from './../../resolver/layout-resolver/layout-resolver.component';
import { TypeOperationComponent } from './../../../routes/system/data-manager/type-operation.component';
import { Component, OnInit, Input, OnDestroy, Type } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonUtility } from '@core/utility/Common-utility';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: FormResolverComponent
  };

@Component({
    selector: 'cn-bsn-table,[cn-bsn-table]',
    templateUrl: './bsn-table.component.html',
    styles: [
        `
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
.selectedRow{
    color:blue;
}
`
    ]
})
export class BsnTableComponent extends CnComponentBase implements OnInit, OnDestroy {

    @Input() config; // dataTables 的配置参数
    @Input() dataList = []; // 表格数据集合

    // region: 分页默认参数
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    // endregion

    // region: 表格操作
    allChecked = false;
    indeterminate = false;
    // endregion

    // region: 业务对象
    _tempParameters = {};
    _relativeResolver;
    selfEvent = {
        selectRow: [],
        selectRowBySetValue: [],
        load: [],
        saveRow: [],
        deleteRow: [],
        delete: [],
        post: [],
        put: [],
        get: []
    };
    _toolbar;
    editCache = {};
    rowContent = {};
    // endregion

    constructor(
        private http: _HttpClient,
        private _http: ApiService,
        private message: NzMessageService,
        private modalService: NzModalService,
        private relativeMessage: RelativeService
    ) {
        super();
    }

    // region: 生命周期事件
    ngOnInit() {
        this._relativeResolver = new RelativeResolver();
        if (this.config.relations && this.config.relations.length > 0) {
            this._relativeResolver.reference = this;
            this._relativeResolver.relativeService = this.relativeMessage;
            this._relativeResolver.relations = this.config.relations;
            this._relativeResolver.initParameterEvents = [this.load];
            this._relativeResolver.tempParameter = this._tempParameters;
            this._relativeResolver.resolverRelation();
        }
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.load();
            }
        } else {
            this.load();
        }
    }
    ngOnDestroy() {
        if (this._relativeResolver) {
            this._relativeResolver.unsubscribe();
        }
    }
    // endregion

    // region: 功能实现
    load(pageIndex = 1) {
        this.pageIndex = pageIndex;
        this.loading = true;
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
            ...this._buildPaging()
        };
        (async () => {
            const loadData = await this._load(url, params);
            if (loadData && loadData.Status === 200) {
                if (loadData.Data && loadData.Data.Rows) {
                    loadData.Data.Rows.forEach(row => {
                        row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
                    });
                    this.dataList = loadData.Data.Rows;
                    this.total = loadData.Data.Total;
                } else {
                    this.dataList = loadData.Data;
                    this.total = 0;
                }
            } else {
                this.dataList = [];
                this.total = 0;
            }
            this._updateEditCacheByLoad();
            this.loading = false;
        })();
    }

    private _buildParameters(paramsConfig) {
        const params = {};
        if (paramsConfig) {
            paramsConfig.map(param => {
                if (param['type'] === 'tempValue') {
                    params[param['name']] = this._tempParameters[param['valueName']];
                } else if (param['type'] === 'value') {
                    params[param.name] = param.value;
                } else if (param['type'] === 'GUID') {
                    const fieldIdentity = CommonUtility.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param['type'] === 'componentValue') {
                    // params[param.name] = componentValue[param.valueName];
                }
            });
        }
        return params;
    }

    private _buildURL(urlConfig) {
        let url = '';
        if (urlConfig && this._isUrlString(urlConfig)) {
            url = APIResource[urlConfig] ? APIResource[urlConfig] : urlConfig;
        } else if (urlConfig) {
            let parent = '';
            urlConfig.params.map(param => {
                if (param['type'] === 'tempValue') {
                    parent = this._tempParameters[param.value];
                } else if (param['type'] === 'value') {
                    if (param.value === 'null') {
                        param.value = null;
                    }
                    parent = param.value;
                } else if (param['type'] === 'GUID') {
                    // todo: 扩展功能
                } else if (param['type'] === 'componentValue') {
                    // parent = componentValue[param['valueName']];
                }
            });
        }
        return url;
    }

    private _buildPaging() {
        const params = {};
        if (this.config['nzIsPagination']) {
            params['_page'] = this.pageIndex;
            this.pageSize = this.pageSize ? this.pageSize : this.config.pageSize;
            params['_rows'] = this.pageSize;
        }
        return params;
    }

    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === '[object String]';
    }

    private _updateEditCacheByLoad() {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }

    private selectRow(data, $event) {
        if ($event.srcElement.type === 'checkbox' || $event.target.type === 'checkbox') {
            return;
        }
        $event.stopPropagation();
        this.dataList.map(row => {
            row.selected = false;
        });
        data['selected'] = true;
    }

    private searchData(reset: boolean = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.load(this.pageIndex);
    }

    // endregion

    // region: 表格操作

    checkAll(value) {
        this.dataList.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refChecked();
    }

    refChecked() {
        const checkedCount = this.dataList.filter(w => w.checked).length;
        this.allChecked = checkedCount === this.dataList.length;
        this.indeterminate = this.allChecked ? false : checkedCount > 0;
    }

    async saveRow() {
        const addRows = [];
        const updateRows = [];
        let isSuccess = false;
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'adding') {
                addRows.push(item);
            } else if (item['row_status'] === 'updating') {
                updateRows.push(item);
            }
        });
        if (addRows.length > 0) {
            // save add;
            console.log(addRows);

            isSuccess = await this.executeSave(addRows, 'post');
        }

        if (updateRows.length > 0) {
            // 
            console.log(updateRows);
            isSuccess = await this.executeSave(updateRows, 'put');
        }
        return isSuccess;
    }

    async executeSave(rowsData, method) {
        const index = this.config.toolbar.findIndex(item => item.name === 'saveRow');
        const postConfig = this.config.toolbar[index].ajaxConfig[method];
        let isSuccess = false;
        if (postConfig) {
            for (let i = 0, len = postConfig.length; i < len; i++) {
                const submitData = [];
                rowsData.map(rowData => {
                    const submitItem = {};
                    postConfig[i].params.map(param => {
                        if (param.type === 'tempValue') {
                            console.log(this._tempParameters[param['valueName']]);
                            submitItem[param['name']] = this._tempParameters[param['valueName']];
                        } else if (param.type === 'componentValue') {
                            submitItem[param['name']] = rowData[param['valueName']];
                        } else if (param.type === 'GUID') {

                        } else if (param.type === 'value') {
                            submitItem[param['name']] = rowData[param['value']];
                        }
                    });
                    submitData.push(submitItem);
                });

                const response = await this[method](postConfig[i].url, submitData);
                if (response && response.Status === 200) {
                    this.message.create('success', '保存成功');
                    isSuccess = true;
                } else {
                    this.message.create('error', response.Message);
                }
            }
            if (isSuccess) {
                rowsData.map(row => {
                    this._saveEdit(row.key);
                });
                this.load();

            }
        }
        return isSuccess;
    }

    async executeDelete(ids) {
        let isSuccess = false;
        if (ids && ids.length > 0) {
            const index = this.config.toolbar.findIndex(item => item.name === 'deleteRow');
            const deleteConfig = this.config.toolbar[index].ajaxConfig['delete'];
            if (deleteConfig) {
                for (let i = 0, len = deleteConfig.length; i < len; i++) {
                    const params = {
                        _ids: ids.join(',')
                    };
                    const response = await this['delete'](deleteConfig[i].url, params);
                    if (response && response.Status === 200) {
                        this.message.create('success', '删除成功');
                        isSuccess = true;
                    } else {
                        this.message.create('error', response.Message);
                    }
                }
                if (isSuccess) {
                    this.load();
                }
            }
        }
        return isSuccess;
    }

    cancelRow() {
        this.dataList.forEach(item => {
            if (item.checked === true) {
                this._cancelEdit(item.key);
            }
        });
        return true;
    }

    private _startEdit(key: string): void {
        console.log('start edit', key);
        this.editCache[key].edit = true;
    }

    private _cancelEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        this.editCache[key].edit = false;
        this.editCache[key].data = JSON.parse(JSON.stringify(this.dataList[index]));
    }

    private _saveEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        let checked = false;
        let selected = false;

        if (this.dataList[index].checked) {
            checked = this.dataList[index].checked;
        }
        if (this.dataList[index].selected) {
            selected = this.dataList[index].selected;
        }

        this.dataList[index] = this.editCache[key].data;
        this.dataList[index].checked = checked;
        this.dataList[index].selected = selected;

        this.editCache[key].edit = false;
    }

    private _deleteEdit(i: string): void {
        const dataSet = this.dataList.filter(d => d.key !== i);
        this.dataList = dataSet;
    }

    private _updateEditCache(): void {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }

    // 获取行内编辑是行填充数据 
    private _getContent() {
        this.rowContent['key'] = null;
        this.config.columns.forEach(element => {
            const colsname = element.field.toString();
            this.rowContent[colsname] = '';
        });
    }

    addRow() {
        const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
        const fieldIdentity = CommonUtility.uuID(6);
        rowContentNew['key'] = fieldIdentity;
        rowContentNew['checked'] = true;
        rowContentNew['row_status'] = 'adding';
        this.dataList = [...this.dataList, rowContentNew];
        // this.dataList.push(this.rowContent);
        this._updateEditCache();
        this._startEdit(fieldIdentity.toString());

        return true;
    }

    updateRow() {
        this.dataList.forEach(item => {
            if (item.checked) {
                if (item['row_status'] && item['row_status'] === 'adding') {

                } else {
                    item['row_status'] = 'updating';
                }
                this._startEdit(item.key);
            }
        });
        return true;
    }

    deleteRow() {
        this.modalService.confirm({
            nzTitle: '确认删除选中的记录？',
            nzContent: '',
            nzOnOk: () => {
                const newData = [];
                const serverData = [];
                this.dataList.forEach(item => {
                    if (item.checked === true && item['row_status'] === 'adding') {
                        // 删除新增临时数据
                        newData.push(item.key);
                    }
                    if (item.checked === true) {
                        // 删除服务端数据
                        serverData.push(item.Id);
                    }
                });
                if (newData.length > 0) {
                    newData.forEach(d => {
                        this.dataList.splice(this.dataList.indexOf(d), 1);
                    });
                }
                if (serverData.length > 0) {
                    this.executeDelete(serverData);
                }
            },
            nzOnCancel() {
            }
        });
    }

    toolbarAction(btn) {
        if (this[btn.name]) {
            this[btn.name]() && this._toolbarEnables(btn.enables);
        } else if (this[btn.type]) {
            const buttons = this.config.toolbar.filter(button => button.type === btn.type);
            const index = buttons.findIndex(button => button.name === btn.name);
            if (index >= 0) {
                this[buttons[index].type](buttons[index].dialogConfig);
                
            }
        }
    }

    valueChange(data) {
        const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

    private _toolbarEnables(enables) {

        this.config.toolbar.map(btn => {
            if (enables[btn.name]) {
                delete btn['disabled'];
            } else {
                btn['disabled'] = '';
            }
        });
    }
    // endregion

    // region: 弹出UI
    private showForm(dialog) {
        const footer = [];
        if (dialog.buttons) {
            dialog.buttons.forEach(btn => {
                const button = {};
                button['lable'] = btn.text;
                button['onClick'] = (componentInstance) => {
                    componentInstance.saveForm();
                };
            });
        }
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzContent: dialog.forms ? component['form'] : dialog. component['layout'],
            nzComponentParams: {
                config: dialog
            },
            nzFooter: [
                {
                    label: dialog.title ? dialog.title : '',
                    onClick: (componentInstance) => {
                        console.log('component click');
                    }
                }
            ]
        });
    }

    private showLayout(dialog) {
        const modal = this.modalService.create({
            nzTitle: '',
            nzContent: dialog.forms ? component['form'] : dialog. component['layout'],
            nzComponentParams: {
                config: dialog
            },
            nzFooter: [
                {
                    label: dialog.title ? dialog.title : '',
                    onClick: (componentInstance) => {
                        console.log('component click');
                    }
                }
            ]
        });
    }
    // endregion

    // region: 服务区端交互
    private async _load(url, params) {
        return this._http.getProj(url, params).toPromise();
    }

    private async post(url, body) {
        return this._http.postProj(url, body).toPromise();
    }

    private async put(url, body) {
        return this._http.putProj(url, body).toPromise();
    }

    private async delete(url, params) {
        return this._http.deleteProj(url, params).toPromise();
    }

    private async get() {

    }
    // endregion
}
