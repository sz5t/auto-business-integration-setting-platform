import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'cn-single-table',
  templateUrl: './single-table.component.html',
})
export class SingleTableComponent implements OnInit {
  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area2',
              title: '右表单',
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
                    'viewId': 'search_form',
                    'component': 'form_view',
                    'keyId': 'Id',
                    componentType: {
                      'parent': true,
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
                          'name': 'searchForm', 'class': 'editable-add-btn', 'text': '查询'
                        },
                        { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '重置' }
                      ],

                    'dataList': [],
                    'relations': [{
                      'relationViewId': 'search_form',
                      'relationSendContent': [
                        {
                          name: 'searchFormByValue',
                          sender: 'search_form',
                          aop: 'after',
                          receiver: 'singleTable',
                          relationData: {
                            name: 'refreshAsChild',
                            params: [
                              { pid: 'CaseName', cid: '_caseName' },
                              { pid: 'Type', cid: '_type' },
                            ]
                          },
                        }
                      ],
                      'relationReceiveContent': []
                    }],
                  },
                  dataList: []
                }
              ]
            },
            {
              id: 'area1',
              title: '单表',
              span: 24,
              size: {
                nzXs: 24,
                nzSm: 24,
                nzMd: 24,
                nzLg: 24,
                ngXl: 24
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'singleTable',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'nzIsPagination': true, // 是否分页
                    'nzShowTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 18, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [],
                      'filter': [
                        {
                          name: 'CaseName', valueName: '_caseName', type: '', value: ''
                        }
                      ]
                    },
                    'componentType': {
                      'parent': true,
                      'child': false,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'singleTable',
                      'relationSendContent': [],
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
                            'controlSize': '18',
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
                            'controlSize': '18',
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
                            'controlSize': '18',
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
                            'dataSet': 'moduleDataSet',
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
                            'controlSize': '18',
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
                            'controlSize': '18',
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
                            'controlSize': '18',
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
                            'controlSize': '18',
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
                            'controlSize': '18',
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
                            'url': 'SinoForce.AppData.ShowCase',
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
                        'name': 'addForm', 'class': 'editable-add-btn', 'text': '弹出新增表单',
                        'type': 'showForm', 'dialogConfig': {
                          'keyId': 'Id',
                          'layout': 'horizontal',
                          'title': '新增数据',
                          'width': '600',
                          'isCard': true,
                          'componentType': {
                            'parent': false,
                            'child': false,
                            'own': true
                          },
                          'forms':
                            [
                              {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                    'value': true,
                                    'disabled': false
                                  },
                                  {
                                    'label': '禁用',
                                    'value': false,
                                    'disabled': false
                                  }
                                ]
                              },

                            ],
                          'buttons':
                            [
                              {
                                'name': 'save', 'class': 'editable-add-btn', 'text': '保存',
                                'ajaxConfig': {
                                  post: [{
                                    'url': 'SinoForce.AppData.ShowCase',
                                    'params': [
                                      { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                      { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                      { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                      { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                      { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                      { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                      { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                      { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                    ]
                                  }]
                                }
                              },
                              { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                            ],

                        }
                      },
                      {
                        'name': 'editForm', 'class': 'editable-add-btn', 'text': '弹出编辑表单',
                        'type': 'showForm',
                        'dialogConfig': {
                          'keyId': 'Id',
                          'title': '编辑',
                          'width': '600',
                          'ajaxConfig': {
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'get',
                            'params': [
                              {
                                name: 'Id', type: 'tempValue', valueName: '_id', value: ''
                              }
                            ]
                          },
                          'componentType': {
                            'parent': false,
                            'child': false,
                            'own': true
                          },
                          'forms':
                            [
                              {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                    'value': true,
                                    'disabled': false
                                  },
                                  {
                                    'label': '禁用',
                                    'value': false,
                                    'disabled': false
                                  }
                                ]
                              },

                            ],
                          'buttons':
                            [
                              { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                              { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' },
                              {
                                'name': 'save', 'class': 'editable-add-btn', 'text': '保存',
                                'type': 'primary',
                                'ajaxConfig': {
                                  put: [{
                                    'url': 'SinoForce.AppData.ShowCase',
                                    'params': [
                                      { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
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
                              }

                            ],
                          'dataList': [],
                        }
                      },
                      {
                        'name': 'showDialogPage', 'class': 'editable-add-btn', 'text': '弹出页面',
                        'type': 'showLayout'
                      }
                    ],
                    'dataSet': [
                      {
                        'name': 'moduleDataSet',
                        'ajaxConfig': 'AppUser',
                        'ajaxType': 'get',
                        'params': [],
                        'fields': [
                          {
                            'label': 'ID',
                            'field': 'Id',
                            'name': 'value'
                          },
                          {
                            'label': '模块',
                            'field': 'Name',
                            'name': 'label'
                          }
                        ]
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

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
