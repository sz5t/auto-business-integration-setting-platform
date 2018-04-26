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
                      'url': 'ShowCase',
                      'ajaxType': 'get',
                      'params': []
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
                        'name': 'showDialogForm', 'class': 'editable-add-btn', 'text': '弹出新增表单',
                        'type': 'showForm', 'dialogConfig': {
                          'keyId': 'Id',
                          'layout': 'horizontal',
                          'title': '新增数据',
                          'width': '600',
                          'isCard': true,
                          'ajaxConfig': {
                            'url': 'ShowCase',
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
                              { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'type': 'default' },
                              {
                                'name': 'saveForm', 'class': 'editable-add-btn', 'text': '保存', 'type': 'primary'
                              }
                            ]
                        }
                      },
                      {
                        'name': 'showDialogForm', 'class': 'editable-add-btn', 'text': '弹出编辑表单',
                        'type': 'showForm',
                        'dialogConfig': {
                          'keyId': 'Id',
                          'title': '编辑',
                          'width': '600',
                          'ajaxConfig': {
                            'url': 'ShowCase',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
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
                                'controlSize': '18',
                                'inputType': 'text',
                                'name': 'operationOrder',
                                'label': '顺序',
                                'placeholder': '',
                                'disabled': false,
                                'readonly': false,
                                'size': 'default'
                              },

                            ],
                          'buttons':
                            [
                              {
                                'name': 'saveForm', 'class': 'editable-add-btn', 'text': '保存'
                              },
                              { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                            ],
                          'dataList': [],
                        }
                      },
                      {
                        'name': 'showDialogPage', 'class': 'editable-add-btn', 'text': '弹出页面',
                        'type': 'showLayout'
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
