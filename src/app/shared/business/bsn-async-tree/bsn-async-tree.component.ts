import { CommonTools } from './../../../core/utility/common-tools';
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { RelativeService, RelativeResolver } from '../../../core/relative-Service/relative-service';
import { ApiService } from '../../../core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { APIResource } from '../../../core/utility/api-resource';
import { NzTreeNode } from 'ng-zorro-antd';

@Component({
    selector: 'cn-bsn-async-tree',
    templateUrl: './bsn-async-tree.component.html',
})
export class BsnAsyncTreeComponent extends CnComponentBase implements OnInit, OnDestroy {

    @Input() config;
    treeData;
    _relativeResolver;
    _tempValue;
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
            this._tempValue = this._relativeResolver._tempParameter;
        }
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.loadTreeData();
            }
        } else {
            this.loadTreeData();
        }
    }

    async getAsyncTreeData(nodeValue = null) {
        return await this.execAjax(this.config.ajaxConfig, nodeValue, 'load');
    }


    loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData();
            // if (data.Data && data.Status === 200) {
            //     this.treeData = this.listToAsyncTreeData(data.Data, '');
            // }
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
                            const fieldIdentity = CommonTools.uuID(10);
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
                result[0].children.push(...this.listToAsyncTreeData(TotreeBefore, parent));
                this.treeData = result;
            }


        })();
    }

    listToAsyncTreeData(data, parentid): NzTreeNode[] {
        const result: NzTreeNode[] = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].ParentId === parentid) {
                temp = this.listToAsyncTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                    data[i]['isLeaf'] = false;
                } else {
                    data[i]['isLeaf'] = false;
                }
                data[i].level = '';
                result.push(new NzTreeNode(data[i]));
            }
        }
        return result;
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
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param.type === 'componentValue') {
                    params[param.name] = componentValue;
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
                        const fieldIdentity = CommonTools.uuID(10);
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
            return this._http.getProj(url, params).toPromise();
        }
    }

    onMouseAction(actionName, $event) {
        this[actionName]($event);
    }


    expandNode = (e) => {
        (async () => {
            if (e.node.getChildren().length === 0 && e.node.isExpanded) {
                
                const s = await Promise.all(this.config.expand
                .filter(p => p.type === e.node.isLeaf)
                .map(async expand => {
                    const  data =  await this.execAjax(expand.ajaxConfig, e.node.key, 'load');
                    if (data.Data && data.Status === 200) {
                    data.Data.forEach(item => {
                        item['isLeaf'] = false;
                        item['children'] = [];
                        if (this.config.columns) {
                            this.config.columns.forEach(col => {
                                item[col['field']] = item[col['valueName']];
                            });
                        }
                    });
                    e.node.addChildren(data.Data);
                }
                }));

                
                
                // if (data.Data && data.Status === 200) {
                //     data.Data.forEach(item => {
                //         item['isLeaf'] = false;
                //         item['children'] = [];
                //     });
                //     e.node.addChildren(data.Data);
                // }



                // this.config.expand.map(async expand => {
                //     if (expand.type === e.node.level) {
                //         const data = await this.execAjax(expand.ajaxConfig, e.node.key, 'load');
                //         console.log(data);
                //         if (data.Data && data.Status === 200) {
                //             data.Data.forEach(item => {
                //                 item['isLeaf'] = false;
                //                 item['children'] = [];
                //             });
                //             e.node.addChildren(data.Data);
                //         }
                //     }
                // });


                
            }
        })();
    }



    clickNode = (e) => {
        console.log('node click', e);
    }

    ngOnDestroy() {
        if (this._messageService) {
            this._messageService.clearMessage();
        }
    }

    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}
