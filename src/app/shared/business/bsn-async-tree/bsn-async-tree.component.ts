import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { ApiService } from '@core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { APIResource } from '@core/utility/api-resource';

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
            this._relativeResolver.relations = this.config.relations;
            this._relativeResolver.resolverRelation();
            this._tempValue = this._relativeResolver._tempValue;
        }
        this.loadTreeData();
    }

    async getAsyncTreeData() {
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
            const data = await this.getAsyncTreeData();
            if (data.Data && data.Status === 200) {
                this.treeData = this.listToAsyncTreeData(data.Data, '');
            }
        })();
    }

    listToAsyncTreeData(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
          if (data[i].ParentId === parentid) {
            temp = this.listToAsyncTreeData(data, data[i].key);
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

    
    expandNode = (e) => {
        console.log('expandNode');
        (async () => {
          if (e.node.getChildren().length === 0 && e.node.isExpanded) {
    
            const data = await this.getAsyncTreeData();
            if (data.Data && data.Status === 200) {
              data.Data.forEach(item => {
                item['isLeaf'] = false;
                item['children'] = [];
              });
              e.node.addChildren(data.Data);
            }
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

}
