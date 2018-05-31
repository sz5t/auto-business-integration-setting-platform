import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { APIResource } from '@core/utility/api-resource';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonUtility } from '@core/utility/Common-utility';
@Component({
    selector: 'cn-bsn-tree',
    templateUrl: './bsn-tree.component.html',
})
export class CnBsnTreeComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input() config;
    treeData;
    _relativeResolver;
    _tempValue = {};
    selfEvent = {
        clickNode: [],
        expandNode: [],
        load: []
    };
    constructor(
        private _http: ApiService,
        private _messageService: RelativeService
    ) {
        super();
    }

    ngOnInit() {
        if (this.config.relations) {
            this._relativeResolver = new RelativeResolver();
            this._relativeResolver.reference = this;
            this._relativeResolver.relativeService = this._messageService;
            this._relativeResolver.initParameter = [this.loadTreeData];
            this._relativeResolver.initParameterEvents = [this.loadTreeData];
            this._relativeResolver.relations = this.config.relations;
            this._relativeResolver.resolverRelation();
            this._tempValue = this._relativeResolver. _tempParameter;
        }
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.loadTreeData();
            }
        } else {
            this.loadTreeData();
        }
       // this.loadTreeData();
    }

    async getTreeData() {
        const ajaxData = await this.execAjax(this.config.ajaxConfig, null, 'load');
        return ajaxData;
    }

    loadTreeData() {
        console.log ( '执行树刷新');
        (async () => {
            const data = await this.getTreeData();
            if (data.Data && data.Status === 200) {
                const TotreeBefore = data.Data;
                TotreeBefore.forEach(d => {
                    if (this.config.columns) {
                        this.config.columns.forEach(col => {
                            d[col['field']] = d[col['valueName']];
                        });
                    }
                });
                let parent = '';
                // 解析出 parentid ,一次性加载目前只考虑一个值
                if (this.config.parent) {
                    this.config.parent.forEach(param => {
                        if (param.type === 'tempValue') {
                            parent = this._tempValue[param.valueName];

                        } else if (param.type === 'value') {
                            if (param.value === 'null') {
                                param.value = null;
                            }
                            parent = param.value;

                        } else if (param.type === 'GUID') {
                            const fieldIdentity = CommonUtility.uuID(10);
                            parent = fieldIdentity;
                        }
                    });
                }
                const result = [new NzTreeNode({
                    title: '根节点',
                    key: 'null',
                    isLeaf: false,
                    children: []
                })];
                result[0].children.push(...this.listToTreeData(TotreeBefore, parent));
                this.treeData = result;
            }
        })();
    }

    load() {
        this.loadTreeData();
    }
    listToTreeData(data, parentid):  NzTreeNode[] {
        const result: NzTreeNode[] = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].ParentId === parentid) {
                temp = this.listToTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                } else {
                    data[i]['isLeaf'] = true;
                }
                data[i].level = '';
                result.push(new NzTreeNode(data[i]));
            }
        }
        
        return result;
    }

    onMouseAction(actionName, $event) {
        console.log(actionName);
        this[actionName]($event);
    }

    clickNode = (e) => {
        console.log('node click', e);
    }

    ngOnDestroy() {
        if (this._relativeResolver) {
            this._relativeResolver.unsubscribe();
        }
    }

    async execAjax(p?, componentValue?, type?) {
        
        const params = {
        };
        let url;
        let tag = true;
       /*  if (!this._tempValue)  {
            this._tempValue = {};
        } */
        if (p) {
            p.params.forEach(param => {
                if (param.type === 'tempValue') {
                    if (type) {
                        if (type === 'load') {
                            if (this._tempValue[param.valueName]) {
                                params[param.name] = this._tempValue[param.valueName];
                            } else {
                                console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this._tempValue[param.valueName];
                        }
                    } else {
                        params[param.name] = this._tempValue[param.valueName];
                    }
                } else if (param.type === 'value') {

                    params[param.name] = param.value;

                } else if (param.type === 'GUID') {
                    const fieldIdentity = CommonUtility.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param.type === 'componentValue') {
                    params[param.name] = componentValue.value;
                }
            });
            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = 'null';
                p.url.params.forEach(param => {
                    if (param['type'] === 'value') {
                        pc = param.value;
                    } else if (param.type === 'GUID') {
                        const fieldIdentity = CommonUtility.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === 'componentValue') {
                        pc = componentValue.value;
                    } else if (param.type === 'tempValue') {
                        pc = this._tempValue[param.valueName];
                    }
                });
                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }
        if (p.ajaxType === 'get' && tag) {
            console.log('get参数', params);
            return this._http.getProj(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            console.log('put参数', params);
            return this._http.putProj(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            console.log('post参数', params);
            return this._http.postProj(url, params).toPromise();
        } else {
            return null;
        }
    }
    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

}
