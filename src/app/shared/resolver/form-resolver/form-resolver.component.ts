import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { CommonUtility } from '@core/utility/Common-utility';
import { APIResource } from '@core/utility/api-resource';
import { concat } from 'rxjs/observable/concat';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
  selector: 'cn-form-resolver,[cn-form-resolver]',
  templateUrl: './form-resolver.component.html',
})
export class FormResolverComponent extends CnComponentBase implements OnInit, OnChanges {

  @Input() config = {
    ajaxConfig: {
    },
    componentType: {
      'parent': false,
      'child': false,
      'own': true
    },
    forms: [
      {
        'type': 'input',
        'labelSize': '6',
        'controlSize': '10',
        'inputType': 'text',
        'name': 'userName',
        'label': '用户姓名',
        'placeholder': '例如：Company.cn.app',
        'disabled': false,
        'readonly': false,
        'size': 'default',
        'validations': [
          {
            'validator': 'required',
            'errorMessage': '不能为空'
          },
          {
            'validator': 'minlength',
            'length': 6,
            'errorMessage': '最小长度为6'
          }
        ],
        'validation': [Validators.required, Validators.minLength(6)]
      },
      {
        'type': 'input',
        'labelSize': '6',
        'controlSize': '10',
        'inputType': 'text',
        'name': 'userPassword',
        'label': '用户密码',
        'placeholder': '',
        'disabled': false,
        'readonly': false,
        'size': 'default',
        /*'validations': [
          {
            'validator': 'required',
            'errorMessage': ''
          },
          {
            'validator': 'minLength',
            'length': 6,
            'errorMessage': ''
          }
        ]*/
      },
      {
        'type': 'select',
        'labelSize': '6',
        'controlSize': '10',
        'inputType': 'submit',
        'name': 'sex',
        'label': '性别',
        'notFoundContent': '',
        'selectModel': false,
        'showSearch': true,
        'placeholder': '--请选择--',
        'disabled': false,
        'size': 'default',
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
      },
      {
        'type': 'datePicker',
        'labelSize': '6',
        'controlSize': '10',
        'name': 'datePicker',
        'label': '日期',
        'placeholder': '--请选择日期--',
        'dateModel': 'day',
        'format': 'YYYY-MM-DD',
        'disabled': false,
        'readonly': false,
        'size': 'default'
      },
      {
        'type': 'timePicker',
        'labelSize': '6',
        'controlSize': '10',
        'format': 'HH:mm:ss',
        'name': 'timePicker',
        'label': '时间',
        'placeholder': '--请选择时间--',
        'disabled': false,
        'readonly': false,
        'size': 'default'
      },
      {
        'type': 'rangePicker',
        'labelSize': '6',
        'controlSize': '10',
        'format': 'YYYY-MM-DD',
        'name': 'dateRangePicker',
        'dateModel': 'day',
        'label': '日期',
        'placeholder': ['--开始日期--', '--结束日期--'],
        'disabled': false,
        'readonly': false,
        'size': 'default'
      },
      {
        'type': 'checkbox',
        'labelSize': '6',
        'controlSize': '10',
        'name': 'checkbox',
        'label': '爱好',
        'disabled': false
      },
      {
        'type': 'checkboxGroup',
        'labelSize': '6',
        'controlSize': '10',
        'name': 'checkbox',
        'label': '特长',
        'disabled': false,
        'options': [
          { label: 'Apple', value: 'Apple', checked: true },
          { label: 'Pear', value: 'Pear' },
          { label: 'Orange', value: 'Orange' }
        ]
      },
      {
        'type': 'radioGroup',
        'labelSize': '6',
        'controlSize': '10',
        'name': 'radioGroup',
        'label': '专业',
        'disabled': false,
        'options': [
          { label: 'Apple', value: 'Apple', checked: true },
          { label: 'Pear', value: 'Pear' },
          { label: 'Orange', value: 'Orange' }
        ]
      },
      {
        'type': 'submit',
        'offsetSize': '6',
        'controlSize': '10',
        'name': 'submit'
      }
    ],
    toolbar: [
      {
        'name': 'saveFrom', 'class': 'editable-add-btn', 'text': '保存',
        'ajaxConfig': {}
      },
      {
        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消',
        'ajaxConfig': {}
      }
    ],
    relations: [

    ]
  };

  @Input() dataList;
  form: FormGroup;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  _relativeResolver;
  selfEvent = {
    initParameters: []
  };
  constructor(
    private http: _HttpClient,
    private formBuilder: FormBuilder,
    private _http: ApiService,
    private message: NzMessageService, private modalService: NzModalService,
    private relativeMessage: RelativeService
  ) {
    super();
   }

  get controls() {
    return this.config.forms.filter(({ type }) => {
      return type !== 'button' && type !== 'submit';
    });
  }

  get changes() {
    return this.form.valueChanges;
  }

  get valid() {
    return this.form.valid;
  }

  get value() {
    return this.form.value;
  }

  ngOnInit() {
    console.log(this.config);
    this.form = this.createGroup();
    this._relativeResolver = new RelativeResolver();
    this._relativeResolver.relations = this.config.relations;
    this._relativeResolver.reference = this;
    this._relativeResolver.relativeService = this.relativeMessage;
    if (this.config.ajaxConfig) {
      if (this.config.componentType) {
        if (!this.config.componentType.child) {
          this.load();
        }
      }else {
        this.load();
      }
    }
  }

  ngOnChanges() {
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map(item => item.name);

      controls
        .filter(control => !configControls.includes(control))
        .forEach(control => this.form.removeControl(control));
      configControls
        .filter(control => !controls.includes(control))
        .forEach(name => {
          const config = this.config.forms.find(control => control.name === name);
          this.form.addControl(name, this.createControl(config));
        });
    }
  }
  createGroup() {
    const group = this.formBuilder.group({});
    this.controls.forEach(control => group.addControl(control.name, this.createControl(control)));
    return group;
  }

  createControl(config) {
    const { disabled, validation, value } = config;
    return this.formBuilder.control({ disabled, value }, validation);
  }

  getFormControl(name) {
    return this.form.controls[name];
  }

  _submitForm($event) {
    event.preventDefault();
    event.stopPropagation();
    console.log(this.value);
    this.submit.emit(this.value);
  }

  /**
   * 表单元素赋值
   */
  setValue(name: string, value: any) {
    const control = this.form.controls[name];
    if (control) {
      control.setValue(value, { emitEvent: true });
    }
  }
  /**
   * 表单赋值
   */
  setFormValue(data) {
    if (data) {
      for (const d in data) {
        if (data.hasOwnProperty(d)) {
          this.setValue(d, data[d]);
        }
      }
    }
  }


  tempParameters = {};
  /**
   * 执行异步数据
   * @param p 路由参数信息
   * @param ajaxType 异步请求类别，post、put、get
   * @param componentValue
   */
  async execAjax(p?, componentValue?, type?) {
    const params = {
    };
    let tag = true;
    let url;
    if (p) {
      if (p.params) {
        p.params.forEach(param => {
          if (param.type === 'tempValue') {
            if (type) {
              if (type === 'load') {
                if (this.tempParameters[param.valueName]) {
                  params[param.name] = this.tempParameters[param.valueName];
                }else {
                  console.log('参数不全不能加载');
                  tag = false;
                  return;
                }
              }else {
                params[param.name] = this.tempParameters[param.valueName];
              }
            }else {
              params[param.name] = this.tempParameters[param.valueName];
            }

          }else if (param.type === 'value') {

            params[param.name] = param.value;

          }else if (param.type === 'GUID') {
            const fieldIdentity = CommonUtility.uuID(10);
            params[param.name] = fieldIdentity;
          }else if (param.type === 'componentValue') {
            params[param.name] = componentValue[param.valueName];
          }
        });
      }

      if (this.isString(p.url)) {
        url = APIResource[p.url];
      }else {
        let pc = 'null';
        p.url.params.forEach(param => {
          if (param['type'] === 'value') {
            pc = param.value;
          } else if (param.type === 'GUID') {
            const fieldIdentity = CommonUtility.uuID(10);
            pc = fieldIdentity;
          } else if (param.type === 'componentValue') {
            pc = componentValue[param.valueName];
          } else if (param.type === 'tempValue') {
            pc = this.tempParameters[param.valueName];
          }
        });

        url = APIResource[p.url['parent']] + '/' + pc + '/' + APIResource[p.url['child']];
      }
    }
    if (p.ajaxType === 'get' && tag) {
      console.log('get参数', params);
      return this._http.getProj(url, params).toPromise();
    }else if (p.ajaxType === 'put') {
      console.log('put参数', params);
      return this._http.putProj(url, params).toPromise();
    }else if (p.ajaxType === 'post') {
      console.log('post参数', params);
      console.log(url);
      return this._http.postProj(url, params).toPromise();
    }else {
      return null;
    }
  }


  isString(obj) { // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }

  /**
   * 默认远程加载数据
   */
  async load() {
    const ajaxData = await this.execAjax(this.config.ajaxConfig, null, 'load');
    if (ajaxData) {
      console.log('异步加载表单数据load', ajaxData);
      if (ajaxData.Data) {
        console.log('待赋值的表单数据', ajaxData.Data);
        this.setFormValue(ajaxData.Data[0]);
      }
    }
  }
  async saveForm() {

    const testValue = {
      operationActionType: 'operation',
      operationDefaultStatus: 'true',
      operationIcon: '1',
      operationName: '操作名称',
      operationNullData: 'true',
      operationOrder: '3',
      operationStatus: 'normal',
      operationType: 'refresh',
    };
    this.setFormValue(testValue);
    console.log('执行保存方法', this.value);

    if (this.config.toolbar) {
      const index = this.config.toolbar.findIndex(item => item.name === 'saveForm');
      if (this.config.toolbar[index].ajaxConfig) {
        const pconfig = JSON.parse(JSON.stringify(this.config.toolbar[index].ajaxConfig));
        if (this.tempParameters['_id']) {
          // 修改保存
          const ajaxData = await this.execAjax(pconfig['update'], this.value);
          if (ajaxData) {
            console.log('修改保存成功', ajaxData);
            // this.tempParameters['_id'] = ajaxData.Data[0].Id;

          }
        }else {
          // 新增保存
          if (Array.isArray(pconfig['add'])) {
            for (let i = 0; i < pconfig['add'].length; i++) {
              const ajaxData = await this.execAjax(pconfig['add'][i], this.value);
              if (ajaxData) {

                // console.log(ajaxData, pconfig['add'][i]);
                if (pconfig['add'][i]['output']) {
                  pconfig['add'][i]['output'].forEach(out => {
                    this.tempParameters[out.name] = ajaxData.Data[out['dataName']];
                  });
                }

                console.log('新增保存成功循环', ajaxData);

              }
            }
          } else {
            const ajaxData = await this.execAjax(pconfig['add'], this.value);
            if (ajaxData) {
              console.log('新增保存成功', ajaxData);

            }
          }
        }
      }


    }
  }
  /**
   * 动态执行方法
   * @param name
   */
  execFun(name?) {
    switch (name) {
      case 'saveForm':
        this.saveForm();
        break;
      default:
        break;
    }
  }

  initParameters(data?) {
    for (const d in data) {
      this.tempParameters[d] = data[d];
    }
    console.log('初始化参数', this.tempParameters);
  }

}

