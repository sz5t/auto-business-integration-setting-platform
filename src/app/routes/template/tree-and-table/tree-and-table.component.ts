import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-and-table',
  templateUrl: './tree-and-table.component.html',
})
export class TreeAndTableComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              title: '结构树',
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
                    'viewId': 'tree_and_table_tree',
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
                      'url': 'SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [
                       // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                      ]
                    },
                    'relations': [{
                      'relationViewId': 'tree_and_table_tree',
                      'relationSendContent': [
                        {
                          'name': 'clickNode',
                          'sender': 'tree_and_table_tree',
                          'aop': 'after',
                          'receiver': 'tree_and_table_table',
                          'relationData': {
                            'name': 'refreshAsChild',
                            'params': [
                              { 'pid': 'key', 'cid': '_parentId' }
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
                    'viewId': 'tree_and_table_table',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.GetCase',
                      'ajaxType': 'get',
                      'params': [
                        {
                          name: 'ParentId', type: 'tempValue', valueName: '_parentId', 'value': ''
                        }
                      ]
                    },
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': false
                    },
                    'relations': [{
                      'relationViewId': 'tree_and_table_table',
                      'relationSendContent': [
                        // {
                        //   'name': 'saveRow',
                        //   'sender': 'tree_and_table_table',
                        //   'aop': 'after',
                        //   'receiver': 'tree_and_table_tree',
                        //   'relationData': {
                        //     'name': 'refreshAsChild',
                        //     'params': [
                        //     ]
                        //   },
                        // },
                        // {
                        //   'name': 'deleteRow',
                        //   'sender': 'tree_and_table_table',
                        //   'aop': 'after',
                        //   'receiver': 'tree_and_table_tree',
                        //   'relationData': {
                        //     'name': 'refreshAsChild',
                        //     'params': [
                        //     ]
                        //   },
                        // }
                      ],
                      'relationReceiveContent': []
                    }],
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
                        title: '名称', field: 'CaseName', width: 80, hidden: false,
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
                            'label': '性别',
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
                            'url': 'SinoForce.AppData.ShowCase',
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
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'post',
                            'params': [
                              { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                              { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                              { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                              { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                              { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                              { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
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
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'put',
                            'params': [
                              { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                              { name: 'CaseName', type: 'componentValue', valueName: '', value: '' },
                              { name: 'CaseCount', type: 'componentValue', valueName: '', value: '' },
                              { name: 'CreateTime', type: 'componentValue', valueName: '', value: '' },
                              { name: 'Enable', type: 'componentValue', valueName: '', value: '' },
                              { name: 'Level', type: 'componentValue', valueName: '', value: '' },
                              { name: 'ParentId', type: 'componentValue', valueName: '', value: '' },
                              { name: 'Remark', type: 'componentValue', valueName: '', value: '' },
                              { name: 'Type', type: 'componentValue', valueName: '', value: '' }
                            ]
                          }]
                        }
                      },
                      {
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消'
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
