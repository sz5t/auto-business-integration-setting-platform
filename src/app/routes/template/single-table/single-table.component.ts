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
                    'component': 'bsnDataTable',
                    'keyId': 'key',
                    'nzIsPagination': false, // 是否分页
                    'nzShowTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                    'nzLoading': false, // 是否显示加载中
                    'nzBordered': false, // 是否显示边框
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
                    'relation': [{
                      'relationViewId': 'singleTable',
                      'relationSendContent': [],
                      'relationReceiveContent': []
                    }],
                    'columns': [
                      {
                        title: 'Id', field: 'Id', width: 80, hidden: true, editor: {
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
                          field: 'Type',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'submit',
                            'name': 'sex',
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
                                'value': 1,
                                'disabled': false
                              },
                              {
                                'label': '禁用',
                                'value': 0,
                                'disabled': false
                              }
                            ]
                          }
                        }
                      }
                    ],
                    'toolbar': [
                      {
                        'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新',
                        'enables': {
                          'addRow': true,
                          'updateRow': true,
                          'deleteRow': true,
                          'saveRow': true,
                          'cancelRow': true,
                          'showDialog': true
                        }
                      },
                      {
                        'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增',
                        'enables': {
                          'addRow': true,
                          'updateRow': false,
                          'deleteRow': false,
                          'saveRow': true,
                          'cancelRow': true,
                          'showDialog': false
                        }
                      },
                      {
                        'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改', 'enable': true,
                        'enables': {
                          'addRow': false,
                          'updateRow': true,
                          'deleteRow': false,
                          'saveRow': true,
                          'cancelRow': true,
                          'showDialog': false
                        }
                      },
                      {
                        'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'enable': true,
                        'enables': {
                          'addRow': true,
                          'updateRow': true,
                          'deleteRow': true,
                          'saveRow': true,
                          'cancelRow': true,
                          'showDialog': true
                        }
                      },
                      {
                        'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存', 'enable': false,
                        'enables': {
                          'addRow': true,
                          'updateRow': true,
                          'deleteRow': true,
                          'saveRow': false,
                          'cancelRow': false,
                          'showDialog': true
                        }
                      },
                      {
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'enable': false,
                        'enables': {
                          'addRow': true,
                          'updateRow': true,
                          'deleteRow': true,
                          'saveRow': false,
                          'cancelRow': false,
                          'showDialog': true
                        }
                      },
                      {
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '测试方法注入',
                        'enables': {
                          'addRow': true,
                          'updateRow': true,
                          'deleteRow': true,
                          'saveRow': false,
                          'cancelRow': false,
                          'showDialog': true
                        },
                        'type': 'method/action',
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
                        'name': 'showDialog', 'class': 'editable-add-btn', 'text': '弹出框'
                      },
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
