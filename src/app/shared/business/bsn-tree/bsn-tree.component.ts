import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService } from 'ng-zorro-antd';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { APIResource } from '@core/utility/api-resource';
import { CnComponentBase } from '@shared/components/cn-component-base';
@Component({
    selector: 'cn-bsn-tree',
    templateUrl: './bsn-tree.component.html',
})
export class CnBsnTreeComponent extends CnComponentBase implements OnInit, OnDestroy {
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
            this._relativeResolver.relations = this.config.relations;
            this._relativeResolver.resolverRelation();
            this._tempValue = this._relativeResolver._tempValue;
        }
        this.loadTreeData();
    }

    async getTreeData() {
        let params = {};
        if (this.config.ajax.params) {
            this.config.ajax.params.map(p => {
                params = {...params, ...p};
            });
        }
        if (this._tempValue) {
            params = {...params, ...this._tempValue};
        }
        return this._http.getProj(APIResource[this.config.ajax.url], params).toPromise();
    }

    loadTreeData() {
        (async () => {
            const data = await this.getTreeData();
            if (data.Data && data.Status === 200) {
                this.treeData = this.listToTreeData(data.Data, '');
            }
        })();
    }

    listToTreeData(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].ParentId === parentid) {
                temp = this.listToTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                } else {
                    data[i]['isLeaf'] = true;
                }
                result.push(data[i]);
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
}
