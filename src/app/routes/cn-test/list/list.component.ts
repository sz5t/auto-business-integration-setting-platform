import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
// import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { RelativeService } from '@core/relative-Service/relative-service';

// import { RandomUserService } from '../randomUser.service';
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
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
export class ListComponent implements OnInit {

    pi = 1;
    ps = 10;
    total = 5; // mock total
    list = [];
    loading = false;
    args: any = {};
    _indeterminate = false;
    _allChecked = false;
    events: any[] = [];

    load(pi?: number) {
        if (typeof pi !== 'undefined') {
            this.pi = pi || 1;
        }

        this.loading = true;
        this._allChecked = false;
        this._indeterminate = false;
        /* this._randomUser.getUsers(this.pi, this.ps, this.args)
            .pipe(
                map(data => {
                    data.results.forEach(item => {
                        item.checked = false;
                        item.price = +((Math.random() * (10000000 - 100)) + 100).toFixed(2);
                    });
                    return data;
                })
            )
            .subscribe(data => {
                this.loading = false;
                this.list = data.results;
            }); */

        this.list = []; // liu
    }

    clear() {
        this.args = {};
        this.load(1);
    }

    _checkAll() {
        this.list.forEach(item => item.checked = this._allChecked);
        this.refChecked();
    }
    refChecked() {
        const checkedCount = this.list.filter(w => w.checked).length;
        this._allChecked = checkedCount === this.list.length;
        this._indeterminate = this._allChecked ? false : checkedCount > 0;
    }
    // private _randomUser: RandomUserService,
    constructor(private http: _HttpClient, private message: NzMessageService,
        private modalService: NzModalService,
        //  private relativeMessage: RelativeService

    ) {
    }
    ngOnInit() {
        this.load();
        //  this.http.get('/chart/visit').subscribe((res: any) => this.events = res);
        for (let i = 0; i < 5; i++) {
            this.list.push({
                key: i.toString(),
                name: `Edrward ${i}`,
                age: 32,
                sex: '2',
                sexname: '女',
                address: `London Park no. ${i}`,
                style: ''
            });
        }
        this.updateEditCache();
    }

    showMsg(msg: string) {
        this.message.info(msg);
    }

    /**
     * 行内编辑
     */
    i = 100;
    editCache = {};

    startEdit(key: string): void {
        this.editCache[key].edit = true;
    }

    cancelEdit(key: string): void {
        this.editCache[key].edit = false;
    }

    saveEdit(key: string): void {
        const index = this.list.findIndex(item => item.key === key);
        this.list[index] = this.editCache[key].data;
        this.editCache[key].edit = false;
    }

    deleteEdit(i: string): void {
        const dataSet = this.list.filter(d => d.key !== i);
        this.list = dataSet;
    }
    updateEditCache(): void {
        // const datalist=JSON.parse(JSON.stringify(this.list));
        this.list.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }
    /**排序 */
    sortName = null;
    sortValue = null;
    // sort(sort: { key: string, value: string }): void {
    //     this.sortName = sort.key;
    //     this.sortValue = sort.value;
    //     this.search();
    //   }
    // search(): void {
    //     /** filter data **/
    //     const filterFunc = item => (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) && (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    //     const data = this.data.filter(item => filterFunc(item));
    //     /** sort data **/
    //     if (this.sortName) {
    //       this.list = this.list.sort((a, b) => (this.sortValue === 'ascend') ? (a[ this.sortName ] > b[ this.sortName ] ? 1 : -1) : (b[ this.sortName ] > a[ this.sortName ] ? 1 : -1));
    //     } else {
    //       this.list = this.list;
    //     }
    //   }

    copyData = [...this.list];
    sortMap = {};
    /**
     * 排序 
     */
    sort(sortName, value) {
        this.sortName = sortName;
        this.sortValue = value;
        Object.keys(this.sortMap).forEach(key => {
            if (key !== sortName) {
                this.sortMap[key] = null;
            } else {
                this.sortMap[key] = value;
            }
        });
        this.search();
    }
    /**
     * 查询
     */
    search() {

        this.list = [...this.list.sort((a, b) => {
            if (a[this.sortName] > b[this.sortName]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[this.sortName] < b[this.sortName]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        })];
    }

    /**新增 */
    addRow(): void {
        this.i++;
        this.list = [...this.list, {
            key: `${this.i}`,
            name: `Edward King ${this.i}`,
            age: '32',
            sex: '',
            address: `London, Park Lane no. ${this.i}`,
            checked: true,
            style: ''
        }];
        this.updateEditCache();
        this.startEdit(this.i.toString());

    }
    /**修改 */
    updateRow(): void {
        this.list.forEach(item => {
            if (item.checked === true) {
                this.startEdit(item.key);
            }
        });
    }
    /**删除 */
    deleteRow(): void {
        // this.modalService.confirm({
        //     title: '确认框',
        //     content: '确认要删除？',
        //     onOk: () => {
        //         this.list.forEach(item => {
        //             if (item.checked === true) {
        //                 this.deleteEdit(item.key);
        //             }
        //         });
        //     },
        //     onCancel() {
        //     }
        // });

    }
    /**保存 */
    saveRow(): void {
        this.list.forEach(item => {
            if (item.checked === true) {
                this.saveEdit(item.key);
            }
        });
    }
    /**取消 */
    cancelRow(): void {
        this.list.forEach(item => {
            if (item.checked === true) {
                this.cancelEdit(item.key);
            }
        });
    }

    /**
     * 选中行
     * @param data 
     * @param edit 
     */
    selectRow(data?, edit?) {

        // data.checked='true'; // 行勾选


        this.list.forEach(item => {
            item.selected = false;
        });
        data.selected = true; // 行选中
        // 单选(check=select)，如果是未勾选，第一次点击选中，再次点击取消选中
        // 多选（check=select），如果是未勾选，第一次点击选中，再次点击取消选中
        // 多勾选单选中行（check》select）勾选和行选中各自独立，互不影响
        // console.log('行',data);
        console.log('update', edit);

    }

    userNameChange(data?) {
        console.log('子页面', data);
        const index = this.list.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }


    /**
     * datatable 的配置树
     */
    config = {
        'viewId': '0001',
        'component': 'form_view',
        'keyId': 'key',
        'nzIsPagination': false, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false, // 是否显示加载中
        'nzBordered': false, // 是否显示边框
        'relation': [{
            'relationViewId': '0002',
            'relationSendContent': [
                {
                    name: 'selectRow',
                    sender: '0001',
                    receiver: '0002',
                    relationData: {
                        name: 'refreshAsChild',
                        params: [{ pid: 'key', cid: 'parentId' }]
                    },
                }
            ]
        }],
        'columns': [
            {
                title: '主键', field: 'key', width: 80, hidden: true, editor: {
                    type: 'input',
                    field: 'key',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '姓名', field: 'name', width: 80,
                editor: {
                    type: 'input',
                    field: 'name',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '性别', field: 'sexname', width: 80, hidden: false,
                editor: {
                    type: 'select',
                    field: 'sex',
                    options: {
                        'type': 'select',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'submit',
                        'name': 'sex',
                        'label': '性别',
                        'notFoundContent': '',
                        'selectModel': false,
                        'showSearch': true,
                        'placeholder': '-请选择-',
                        'disabled': false,
                        'size': 'default',
                        'clear': true,
                        'width': '60px',
                        'options': [
                            {
                                'label': '男',
                                'value': '1',
                                'disabled': false
                            },
                            {
                                'label': '女',
                                'value': '2',
                                'disabled': false
                            }
                        ]
                    }
                }
            },
            {
                title: '年龄', field: 'age', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'age',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '地址', field: 'address', width: 80, hidden: false,
            }
        ],
        'toolbar': [
            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
            { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
        ]

    };
    dataList = [
        {
            key: `key0`,
            name: `元春`,
            age: '32',
            sexname: '女',
            sex: '1',
            address: `皇宫`,
        },
        {
            key: `key1`,
            name: `惜春`,
            age: '32',
            sexname: '女',
            sex: '1',
            address: `贾府`,
        },
        {
            key: `key2`,
            name: `探春`,
            age: '32',
            sexname: '女',
            sex: '1',
            address: `贾府`,
        }
    ];

    config1 = {
        'viewId': '0002',
        'component': 'form_view',
        'keyId': 'key',
        'nzIsPagination': false, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false, // 是否显示加载中
        'nzBordered': false, // 是否显示边框
        'ajaxConfig': {
            'url': 'AppConfigPack',
            'ajaxType': 'get',
            'params': [
                { name: 'Id', type: 'value', valueName: '_id', value: 'aee8f8386ba1410a8c2d079e2d4fe934' },
            ]
        },
        'componentType': {
            'parent': false,
            'child': false,
            'own': true
        },
        'relation': [{
            'relationViewId': '0002',
            'relationSendContent': [],
            'relationReceiveContent': []
        }],
        'columns': [
            {
                title: '主键', field: 'key', width: 80, hidden: true, editor: {
                    type: 'input',
                    field: 'key',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '姓名', field: 'name', width: 80,
                editor: {
                    type: 'input',
                    field: 'name',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                        'disabled': false
                    }
                }
            },
            {
                title: '性别', field: 'sexname', width: 80, hidden: false,
                editor: {
                    type: 'select',
                    field: 'sex',
                    options: {
                        'type': 'select',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'submit',
                        'name': 'sex',
                        'label': '性别',
                        'notFoundContent': '',
                        'selectModel': false,
                        'showSearch': true,
                        'placeholder': '-请选择-',
                        'disabled': false,
                        'size': 'default',
                        'clear': true,
                        'width': '60px',
                        'options': [
                            {
                                'label': '男',
                                'value': '1',
                                'disabled': false
                            },
                            {
                                'label': '女',
                                'value': '2',
                                'disabled': false
                            }
                        ]
                    }
                }
            },
            {
                title: '年龄', field: 'age', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'age',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '地址', field: 'address', width: 80, hidden: false,
            }
        ],
        'toolbar': [
            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
            {
                'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
                'ajaxConfig': {
                    add: {
                        'url': 'AppConfigPack',
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
                        'url': 'AppConfigPack',
                        'ajaxType': 'put',
                        'params': [
                            { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }

                        ]
                    }
                },
            },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
        ]

    };
    dataList1 = [];
    /**
     * 动态执行方法
     * @param name 
     */
    execFun(name?) {
        switch (name) {
            case 'refresh':
                this.refresh();
                break;
            case 'addRow':
                this.addRow();
                break;
            case 'updateRow':
                this.updateRow();
                break;
            case 'deleteRow':
                this.deleteRow();
                break;
            case 'saveRow':
                this.saveRow();
                break;
            case 'cancelRow':
                this.cancelRow();
                break;
            default:
                break;
        }
    }

    /**
     * 刷新
     */
    refresh() {

    }

    nodes1 = [

        {
            id: '1',
            name: 'root3',
            data: 'ahhahah'
        },
        {
            id: '2',
            name: 'async root4',
            hasChildren: true,
            children: [
                {
                    name: '子节点1'
                },
                {
                    name: '子节点2'
                }
            ]
        },
        {
            id: '3',
            name: 'root1'
        },
        {
            id: '4',
            name: 'root2'
        }
    ];

    options1 = {
        allowDrag: true
    };

    nodes = [
        {
            name: 'root1',
            children: [
                {
                    name: 'child1'
                }, {
                    name: 'child2'
                }
            ]
        },
        {
            name: 'root2',
            children: [
                {
                    name: 'child2.1'
                }, {
                    name: 'child2.2',
                    children: [
                        {
                            id: 1001,
                            name: 'subsub'
                        }
                    ]
                }
            ]
        }
    ];

    // options: ITreeOptions = {
    //     actionMapping: {
    //         mouse: {
    //             contextMenu: (tree, node, $event) => {
    //                 $event.preventDefault();
    //                 //alert(`context menu for ${node.data.name}`);
    //                 this.showMsg(node.data.name);
    //                 this.visible = true;
    //             },
    //             dblClick: (tree, node, $event) => {
    //                 if (node.hasChildren) {
    //                     TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    //                 }
    //             },
    //             click: (tree, node, $event) => {
    //                 $event.shiftKey
    //                     ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
    //                     : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
    //             }
    //         },
    //         keys: {
    //             [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
    //         }
    //     }
    // };
    /*     actionMapping: IActionMapping = {
            mouse: {
                contextMenu: (tree, node, $event) => {
                    $event.preventDefault();
                    alert(`context menu for ${node.data.name}`);
                },
                dblClick: (tree, node, $event) => {
                    if (node.hasChildren) {
                        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
                    }
                },
                click: (tree, node, $event) => {
                    $event.shiftKey
                        ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
                        : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                }
            },
            keys: {
                [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
            }
        }; */
    onEvent(ev: any) {
        console.log('onEvent,点击树节点', ev);
    }
    onActivate(ev: any) {
        console.log('激活树节点', ev);
        this.visible = false;
        console.log(this.fn(this.nodestree, 0));
    }

    // nzAutoExpandParent 是否自动展开父节点，当数字时展开最大节点 false
    // nzAllowChildLinkage 是否开启父节点的checkbox状态的会影响子节点状态 true
    // nzAllowParentLinkage 是否开启子节点的checkbox状态的会影响父节点状态 true
    // nzCheckable  在节点之前添加一个复选框
    // nzShowLine 显示连接线

    treeconfig = {
        nzAutoExpandParent: true, // 是否自动展开父节点，当数字时展开最大节点 false
        nzAllowChildLinkage: true, // 是否开启父节点的checkbox状态的会影响子节点状态 true
        nzAllowParentLinkage: true, // 是否开启子节点的checkbox状态的会影响父节点状态 true
        nzCheckable: false, //  在节点之前添加一个复选框 false
        nzShowLine: false, // 显示连接线 false
    };

    nzContextMenu(ev: any) {
        console.log('yj');

    }


    // 气泡
    visible = false;

    nodestree = [
        { 'id': 2, 'title': '第一级1', 'parentid': 0 },
        { 'id': 3, 'title': '第二级1', 'parentid': 2 },
        { 'id': 4, 'title': '第二级2', 'parentid': 2 },
        { 'id': 5, 'title': '第三级1', 'parentid': 4 },
        { 'id': 6, 'title': '第三级2', 'parentid': 3 }
    ];
    fn(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentid === parentid) {
                const obj = { 'text': data[i].name, 'id': data[i].id };
                temp = this.fn(data, data[i].id);
                if (temp.length > 0) {
                    obj['children'] = temp;
                }
                result.push(obj);
            }
        }
        return result;
    }


    // 单行操作
    config2 = {
        'viewId': '0003',
        'component': 'form_view',
        'keyId': 'key',
        'nzIsPagination': true, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false, // 是否显示加载中
        'nzBordered': false, // 是否显示边框
        'ajaxConfig': {
            'url': 'DbCommonConfig',
            'ajaxType': 'get',
            'params': []
        },
        'componentType': {
            'parent': false,
            'child': false,
            'own': true
        },
        'relation': [{
            'relationViewId': '0002',
            'relationSendContent': [],
            'relationReceiveContent': []
        }],
        'columns': [
            {
                title: '主键', field: 'key', width: 80, hidden: true, editor: {
                    type: 'input',
                    field: 'key',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: 'sqlid', field: 'Id', width: 80, hidden: false,
            }
        ],
        'toolbar': [
            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
            {
                'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存'
            },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
        ]

    };





    /**
     *表单配置
     */
    configForm = {
        ajaxConfig: {
            'url': 'AppModuleConfig',
            'ajaxType': 'get',
            'params': []
        },
        componentType: {
            'parent': false,
            'child': false,
            'own': true
        },
        'forms':
            [
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'Name',
                    'label': '名称',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'operationName',
                    'label': '操作名称',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'operationIcon',
                    'label': '操作图标',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationType',
                    'label': '操作类型',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '无',
                            'value': 'none'
                        },
                        {
                            'label': '刷新数据',
                            'value': 'refresh'
                        },
                        {
                            'label': '执行SQL',
                            'value': 'exec_sql'
                        },
                        {
                            'label': '执行SQL后刷新',
                            'value': 'after_sql'
                        },
                        {
                            'label': '弹出确认框',
                            'value': 'confirm'
                        },
                        {
                            'label': '弹出窗体',
                            'value': 'dialog'
                        },
                        {
                            'label': '弹出表单',
                            'value': 'form'
                        },
                        {
                            'label': '执行SQL后刷新主界面',
                            'value': 'refresh_parent'
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationActionType',
                    'label': '动作类型',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '操作',
                            'value': 'operation'
                        },
                        {
                            'label': '动作',
                            'value': 'action'
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationStatus',
                    'label': '操作后状态',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '浏览状态',
                            'value': 'normal'
                        },
                        {
                            'label': '新增状态',
                            'value': 'new'
                        },
                        {
                            'label': '编辑状态',
                            'value': 'edit'
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationNullData',
                    'label': '空数据状态',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '启用',
                            'value': true
                        },
                        {
                            'label': '禁用',
                            'value': false
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationDefaultStatus',
                    'label': '默认状态',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '启用',
                            'value': true
                        },
                        {
                            'label': '禁用',
                            'value': false
                        }
                    ]
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'operationOrder',
                    'label': '顺序',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },

            ],
        'toolbar':
            [
                {
                    'name': 'saveForm', 'class': 'editable-add-btn', 'text': '保存'
                },
                { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
            ],

        'dataList': [],
        'relations': [
            {
              relationViewId: 'viewId_testList',
              relationSendContent: [],
              relationReceiveContent: []
            }
          ]
    };

}
