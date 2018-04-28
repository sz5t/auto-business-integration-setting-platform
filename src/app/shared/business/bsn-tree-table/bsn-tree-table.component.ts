import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ApiService } from '@core/utility/api-service';
import { CommonUtility } from '@core/utility/Common-utility';
import { APIResource } from '@core/utility/api-resource';

@Component({
    selector: 'bsn-tree-table,[bsn-tree-table]',
    templateUrl: './bsn-tree-table.component.html',
    styles: [
        `
            .table-operations {
                margin-bottom: 16px;
            }
            .table-operations > button {
                margin-right: 8px;
            }
            .selectedRow{
                color: blue;
            }
        `
    ]
})
export class BsnTreeTableComponent implements OnInit {
    @Input() config = {
        'viewId': 'testTreetable',
        'component': 'bsnTable',
        'keyId': 'Id',
        'nzIsPagination': true, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'pageSizeOptions': [1, 5, 10, 20, 30, 40, 50],
        'ajaxConfig': {
            'url': 'ShowCase',
            'ajaxType': 'get',
            'params': [
                { name: 'ParentId', type: 'value', valueName: '', 'value': null }
            ]
        },
        'componentType': {
            'parent': false,
            'child': false,
            'own': true
        },
        'relations': [{
            'relationViewId': 'testTreetable',
            'relationSendContent': [],
            'relationReceiveContent': []
        }],
        'ShowName': [
            { title: '标题', field: 'name', valueName: 'CaseName' },
        ],
        'expand': {
            'ajaxConfig': {
                'url': 'ShowCase',
                'ajaxType': 'get',
                'params': [
                    { name: 'ParentId', type: 'componentValue', valueName: 'Id', 'value': '' }
                ]
            }
        },
        'columns': [
            {
                title: 'Id', field: 'Id', width: 80, hidden: true,
                editor: {
                    type: 'input',
                    field: 'Id',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '名称', field: 'CaseName', width: 80,
                editor: {
                    type: 'input',
                    field: 'CaseName',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '类别Id', field: 'Type', width: 80, hidden: false,
                editor: {
                    type: 'select',
                    field: 'Type',
                    options: {
                        'type': 'select',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'submit',
                        'name': 'sex',
                        'label': 'Type',
                        'notFoundContent': '',
                        'selectModel': false,
                        'showSearch': true,
                        'placeholder': '-请选择-',
                        'disabled': false,
                        'size': 'default',
                        'clear': true,
                        'width': '130px',
                        'options': [
                            {
                                'label': '表',
                                'value': '1',
                                'disabled': false
                            },
                            {
                                'label': '树',
                                'value': '2',
                                'disabled': false
                            },
                            {
                                'label': '树表',
                                'value': '3',
                                'disabled': false
                            },
                            {
                                'label': '表单',
                                'value': '4',
                                'disabled': false
                            },
                            {
                                'label': '标签页',
                                'value': '5',
                                'disabled': false
                            }
                        ]
                    }
                }
            },
            {
                title: '数量', field: 'CaseCount', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'CaseCount',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '级别', field: 'Level', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'Level',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '创建时间', field: 'CreateTime', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'CreateTime',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '备注', field: 'Remark', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'Remark',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '状态', field: 'Enable', width: 80, hidden: false,
                editor: {
                    type: 'select',
                    field: 'Enable',
                    options: {
                        'type': 'select',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'submit',
                        'name': 'Enable',
                        'notFoundContent': '',
                        'selectModel': false,
                        'showSearch': true,
                        'placeholder': '-请选择-',
                        'disabled': false,
                        'size': 'default',
                        'clear': true,
                        'width': '80px',
                        'options': [
                            {
                                'label': '启用',
                                'value': true,
                                'disabled': false
                            },
                            {
                                'label': '禁用',
                                'value': false,
                                'disabled': false
                            }
                        ]
                    }
                }
            }
        ],
        'toolbar': [
            {
                'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
            },
            {
                'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增'
            },
            {
                'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改'
            },
            {
                'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除',
                'ajaxConfig': {
                    delete: [{
                        'actionName': 'delete',
                        'url': 'ShowCase',
                        'ajaxType': 'delete'
                    }]
                }
            },
            {
                'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
                'type': 'method/action',
                'ajaxConfig': {
                    post: [{
                        'actionName': 'add',
                        'url': 'ShowCase',
                        'ajaxType': 'post',
                        'params': [
                            { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                            { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                            { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                            { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                            { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                            { name: 'ParentId', type: 'componentValue', valueName: 'ParentId', value: '' },
                            { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                            { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                        ],
                        'output': [
                            {
                                name: '_id',
                                type: '',
                                dataName: 'Id'
                            }
                        ]
                    }],
                    put: [{
                        'url': 'ShowCase',
                        'ajaxType': 'put',
                        'params': [
                            { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                            { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                            { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                            { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                            { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                            { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                            { name: 'ParentId', type: 'componentValue', valueName: 'ParentId', value: '' },
                            { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                            { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                        ]
                    }]
                }
            },
            {
                'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消',
            },
            {
                'name': 'showModal', 'class': 'editable-add-btn', 'text': '测试方法注入',
                'type': 'modal',
                'ajaxConfig': {
                    add: {
                        'url': 'AppConfigPack_test',
                        'ajaxType': 'post',
                        'params': [
                            { name: 'ParentId', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'Name', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'TagA', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'TagB', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: 'liutest11' }

                        ]
                    },
                    update: {
                        'url': 'AppConfigPack_test',
                        'ajaxType': 'put',
                        'params': [
                            { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }
                        ]
                    }
                },
            },
            {
                'name': 'showDialogPage', 'class': 'editable-add-btn', 'text': '弹出页面',
                'type': 'showLayout'
            }
        ]
    }; // dataTables 的配置参数
    @Input() dataList = []; // 表格数据集合

    expandDataCache = {};
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

    constructor(private http: _HttpClient,
        private _http: ApiService) {

    }

    data = [
        {
            key: 1,
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            children: [
                {
                    key: 11,
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park'
                },
                {
                    key: 12,
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    children: [{
                        key: 121,
                        name: 'Jimmy Brown',
                        age: 16,
                        address: 'New York No. 3 Lake Park'
                    }]
                },
                {
                    key: 13,
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    children: [
                        {
                            key: 131,
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            children: [
                                {
                                    key: 1311,
                                    name: 'Jim Green jr.',
                                    age: 25,
                                    address: 'London No. 3 Lake Park'
                                },
                                {
                                    key: 1312,
                                    name: 'Jimmy Green sr.',
                                    age: 18,
                                    address: 'London No. 4 Lake Park'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            key: 2,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park'
        }
    ];

    async collapse(array: any[], data: any, $event: boolean){
        console.log('点击树节点展开', array, data, $event);
        if ($event === false) {
            console.log('点击树节点关闭');
           
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key);
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        } else {
            console.log('点击树节点展开->异步请求');
            // data.children =  await this.expandLoad(data);
            this.dataList[0]['children'] = await this.expandLoad(data);
            console.log('组装结果', data.children);
            if (data.children) {
                data.children.forEach(d => {
                    // const target = array.find(a => a.key === d.key);
                    // target['expand'] = true;
                    // this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }

        console.log('最终展示有关的数据', this.expandDataCache);
    }


    async expandLoad(componentValue?) {
        let childs = [];
        const url = this._buildURL(this.config.expand.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.expand.ajaxConfig.params , componentValue),
        };

        const loadData = await this._load(url, params);
        console.log('#数表展开节点异步返回#', loadData);
        if (loadData && loadData.Status === 200) {

            if (loadData.Data && loadData.Data) {
                loadData.Data.forEach(row => {
                    row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
                    if (this.config.ShowName) {
                        this.config.ShowName.forEach(col => {
                            row[col['field']] = row[col['valueName']];
                        });
                    }
                    row['children'] = [];
                });
                this. dataToTreetable(loadData.Data); 
                childs = loadData.Data; 
               
            }
        }
        return childs;

    }


    convertTreeToList(root: object): any[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
                }
            }
        }

        return array;
    }

    visitNode(node: any, hashMap: object, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    ngOnInit(): void {
        /* this.data.forEach(item => {
            this.expandDataCache[item.key] = this.convertTreeToList(item);
        }); */
        // this.dataToTreetable(this.data);

        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.load();
            }
        } else {
            this.load();
        }
    }

    /**
     * 处理根节点数据，转换格式 liu
     */
    dataToTreetable(data?) {
        data.forEach(item => {
            this.expandDataCache[item.key] = this.convertTreeToList(item);
        });
    }
    /**
     * 树表加载方法 liu
     */
    load(pageIndex = 1) {

        // load 上来数据  ，计算分页 条数 等展示信息
        // 根据数据集，初次格式处理，select，check，状态 等字段信息扩充
        this.pageIndex = pageIndex;
        this.loading = true;
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
            ...this._buildPaging()
        };
        (async () => {
            const loadData = await this._load(url, params);
            console.log('#数表异步返回#', loadData);
            if (loadData && loadData.Status === 200) {

                if (loadData.Data && loadData.Data.Rows) {
                    console.log('zxcg');
                    loadData.Data.Rows.forEach(row => {
                        row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
                        if (this.config.ShowName) {
                            this.config.ShowName.forEach(col => {
                                row[col['field']] = row[col['valueName']];
                            });
                        }
                        row['children'] = [];
                    });
                    this._updateEditCacheByLoad(loadData.Data.Rows);
                    this.convertTreeToList( loadData.Data.Rows);
                    this.dataList = loadData.Data.Rows;
                    this.total = loadData.Data.Total;
                } else {
                    this._updateEditCacheByLoad([]);
                    this.dataList = loadData.Data;
                    this.total = 0;
                }
            } else {
                this._updateEditCacheByLoad([]);
                this.dataList = [];
                this.total = 0;
            }

            this.loading = false;
        })();

    }

    private _buildParameters(paramsConfig, componentValue?) {
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
                     params[param.name] = componentValue[param.valueName];
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
    private _updateEditCacheByLoad(dataList) {
        this.editCache = {};
        dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });

        this.expandDataCache = {};
        dataList.forEach(item => {
            this.expandDataCache[item.key] = this.convertTreeToList(item);
        });
    }
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


    toolbarAction(btn) {
        if (this[btn.name]) {
            this[btn.name]() && this._toolbarEnables(btn.enables);
        } else if (this[btn.type]) {
            const buttons = this.config.toolbar.filter(button => button['type'] === btn.type);
            const index = buttons.findIndex(button => button.name === btn.name);
            if (index >= 0) {
                this[buttons[index]['type']](buttons[index]['dialogConfig']);

            }
        }
    }

    valueChange(data) {
        const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

    private _toolbarEnables(enables) {

        this.config.toolbar.map(btn => {
            if (!enables[btn.name]) {
                delete btn['disabled'];
            } else {
                btn['disabled'] = '';
            }
        });
    }


    addRow() {
        console.log('新增');
    }

    updateRow() {
        console.log('修改');

    }

    deleteRow() {
        console.log('删除');
    }

}
