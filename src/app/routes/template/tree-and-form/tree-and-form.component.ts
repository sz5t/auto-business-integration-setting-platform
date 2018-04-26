import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
    selector: 'app-tree-and-form',
    templateUrl: './tree-and-form.component.html',
})
export class TreeAndFormComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '左树',
                            span: 6,
                            size: {
                                nzXs: 6,
                                nzSm: 6,
                                nzMd: 6,
                                nzLg: 6,
                                ngXl: 6
                            },
                            viewCfg: [
                                {
                                    config: {
                                        'viewId': 'tree_and_form_tree',
                                        'component': 'bsnTree',
                                        'asyncData': true, // 
                                        'expandAll': true, //  
                                        'checkable': false,  //    在节点之前添加一个复选框 false
                                        'showLine': false,  //   显示连接线 fal
                                        'columns': [ // 字段映射，映射成树结构所需
                                            { title: '主键', field: 'key', valueName: 'Id' },
                                            { title: '父节点', field: 'parentId', valueName: 'ParentId' },
                                            { title: '标题', field: 'title', valueName: 'CaseName' },
                                        ],
                                        'componentType': {
                                            'parent': true,
                                            'child': false,
                                            'own': false
                                        },
                                        'parent': [
                                            { name: 'ParentId', type: 'value', valueName: '取值参数名称', value: 'null' }
                                        ],
                                        'ajaxConfig': {
                                            'url': 'ShowCase',
                                            'ajaxType': 'get',
                                            'params': [
                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                            ]
                                        },
                                        'relations': [{
                                            'relationViewId': 'tree_and_form_tree',
                                            'relationSendContent': [
                                                {
                                                    'name': 'clickNode',
                                                    'sender': 'tree_and_form_tree',
                                                    'aop': 'after',
                                                    'receiver': 'tree_and_form_form',
                                                    'relationData': {
                                                        'name': 'refreshAsChild',
                                                        'params': [
                                                            { 'pid': 'key', 'cid': '_id' }
                                                        ]
                                                    },
                                                }
                                            ],
                                            'relationReceiveContent': []
                                        }]
                                    },
                                    dataList: []
                                }
                            ]
                        },
                        {
                            id: 'area2',
                            title: '右表',
                            span: 18,
                            size: {
                                nzXs: 18,
                                nzSm: 18,
                                nzMd: 18,
                                nzLg: 18,
                                ngXl: 18
                            },
                            viewCfg: [
                                {
                                    config: {
                                        'viewId': 'tree_and_form_form',
                                        'component': 'form_view',
                                        'keyId': 'Id',
                                        ajaxConfig: {
                                            'url': 'ShowCase',
                                            'ajaxType': 'get',
                                            'params': [
                                                { name: 'Id', type: 'tempValue', valueName: '_id', value: '' }
                                            ]
                                        },
                                        componentType: {
                                            'parent': false,
                                            'child': true,
                                            'own': false
                                        },
                                        'forms':
                                            [
                                                {
                                                    'type': 'input',
                                                    'labelSize': '6',
                                                    'controlSize': '10',
                                                    'inputType': 'text',
                                                    'name': 'CaseName',
                                                    'label': '名称',
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
                                                    'name': 'Type',
                                                    'label': '类别Id',
                                                    'notFoundContent': '',
                                                    'selectModel': false,
                                                    'showSearch': true,
                                                    'placeholder': '--请选择--',
                                                    'disabled': false,
                                                    'size': 'default',
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
                                                },
                                                {
                                                    'type': 'input',
                                                    'labelSize': '6',
                                                    'controlSize': '10',
                                                    'inputType': 'text',
                                                    'name': 'CaseCount',
                                                    'label': '数量',
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
                                                    'name': 'Level',
                                                    'label': '级别',
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
                                                    'name': 'Remark',
                                                    'label': '备注',
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
                                                    'name': 'Enable',
                                                    'label': '状态',
                                                    'notFoundContent': '',
                                                    'selectModel': false,
                                                    'showSearch': true,
                                                    'placeholder': '--请选择--',
                                                    'disabled': false,
                                                    'size': 'default',
                                                    'options': [
                                                        {
                                                          'label': '启用',
                                                          'value': 1,
                                                          'disabled': false
                                                        },
                                                        {
                                                          'label': '禁用',
                                                          'value': 0,
                                                          'disabled': false
                                                        }
                                                      ]
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
                                                relationViewId: 'tree_and_form_form',
                                                relationSendContent: [],
                                                relationReceiveContent: []
                                            }
                                        ]
                                    },
                                    dataList: []
                                }
                            ]
                        }
                    ]
                }
            }

        ]
    };




}
