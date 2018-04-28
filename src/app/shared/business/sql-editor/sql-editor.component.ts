import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import { RelativeResolver, RelativeService } from '@core/relative-Service/relative-service';
import { NzMessageService } from 'ng-zorro-antd';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
    selector: 'cn-sql-editor',
    templateUrl: './sql-editor.component.html',
    styles: [`
  :host ::ng-deep .ant-table-expanded-row > td:last-child {
    padding: 0 48px 0 8px;
  }

  :host ::ng-deep .ant-table-expanded-row > td:last-child .ant-table-thead th {
    border-bottom: 1px solid #e9e9e9;
  }

  :host ::ng-deep .ant-table-expanded-row > td:last-child .ant-table-thead th:first-child {
    padding-left: 0;
  }

  :host ::ng-deep .ant-table-expanded-row > td:last-child .ant-table-row td:first-child {
    padding-left: 0;
  }

  :host ::ng-deep .ant-table-expanded-row .ant-table-row:last-child td {
    border: none;
  }

  :host ::ng-deep .ant-table-expanded-row .ant-table-thead > tr > th {
    background: none;
  }

  :host ::ng-deep .table-operation a.operation {
    margin-right: 24px;
  }
  .table-operations {
    margin-bottom: 0px;
  }
  
  .table-operations > button {
    margin-right: 8px;
  }

  .example-input .ant-input {
    width: 200px;
    margin: 0 8px 8px 0;
  }
  `]
})
export class SqlEditorComponent extends CnComponentBase implements OnInit, OnDestroy {
    total = 1;
    pageIndex = 1;
    pageSize = 15;
    tableData = [];
    _tempValue = {};
    _relativeResolver;
    scriptName;
    loading = true;
    @Input() config;
    @ViewChild('editor') editor: CnCodeEditComponent;

    constructor(
        private _http: ApiService,
        private _relativeService: RelativeService,
        private _message: NzMessageService
    ) { 
        super();
    }

    ngOnInit() {
        if (this.config.relations) {
            this._relativeResolver = new RelativeResolver(),
            this._relativeResolver.reference = this;
            this._relativeResolver.relations = this.config.relations;
            this._relativeResolver.relativeService = this._relativeService;
            this._relativeResolver.initParameterEvents = [this.load];
            this._relativeResolver.resolverRelation();
        }
    }

    async load(condition?) {
        let param = {
            _page: this.pageIndex + 1,
            _rows: this.pageSize
        };
        if (this._relativeResolver.tempParameter) {
            param = {...param, ...this._relativeResolver.tempParameter};
        }
        if (condition) {
            param = {...param, ...condition};
        }

        const response  = await this._http.getProj(`${APIResource.SysDataLink}/${param['_moduleId']}/${APIResource.DbCommandConfig}`, param).toPromise();
        if (response.Data && response.Status === 200) {
            this.tableData = response.Data.Rows;
            this.total = response.Data.Total;
            this.tableData.map(d => {
                d['expand'] = false;
                d['selected'] = false;
            });
        }
        this.loading = false;
    }

    selectRow(row) {
        this.tableData.map(d => {
            d.selected = false;
        });
        row.selected = true;
        this.editor.setValue(row.ScriptText);
        this.scriptName = row.Name;
    }

    add() {
        this.editor.setValue('');
        this._relativeResolver.tempParameter['_id'] && delete this._relativeResolver.tempParameter['_id'];
    }

    async save() {
        const sqlString = this.editor.getValue();
        let returnValue: any;
        if (this._relativeResolver.tempParameter['_id']) {
            // update
            returnValue = this.updateSql(sqlString);
        } else {
            // add
            if (sqlString && sqlString.length > 0) {
                returnValue = await this.addSql(sqlString);
                if (returnValue.Data && returnValue.Status === 200) {
                    this._relativeResolver.tempParameter['_id'] = returnValue.Data.Id;
                    const rel = await this.addSqlRelative();
                }
            }
        }
        switch (returnValue.Status) {
            case 200:
                this._message.create('success', 'SQL 保存成功');
                this.load({_focusedId: this._relativeResolver.tempParameter['_id']});
                break;
            case 500:
                this._message.create('error', returnValue.Message);
                break;
            default:
                this._message.create('info', returnValue.Message);
        }
    }

    // 删除SQL语句
    delete (id) {
        (async() => {
            const resSql = await this.delSql(id);
            const resRelative = await this.delSqlRelative(id);
            switch (resSql.Status) {
                case 200:
                    this._message.create('success', 'SQL 删除成功');
                    this.load({_focusedId: this._relativeResolver.tempParameter['_id']});
                    break;
                case 500:
                    this._message.create('error', resSql.Message);
                    break;
                default:
                    this._message.create('info', resSql.Message);
            }
            this.load();
        })();
    }

     // 删除SQL 参数
    deleteParam(id) {

    }

    private async addSql(sql) {
        const params = {
            ScriptText: sql,
            Name: this.scriptName,
            Enabled: true,
            DbObjType: '脚本',
            NeedAlterDb: true,
            IssueFlag: '已发布',
            ShareScope: 'Project',
            // DrmId: '787008d9029c4b40847d08c32a18699d',
            ResultType: 'Dynamic',
            ResultLength: 0
        };
        return this._http.postProjSys(APIResource.DbCommandConfig, params).toPromise();
    }

    private async addSqlRelative() {
        const params = {
            LeftId: this._relativeResolver.tempParameter['_moduleId'],
            RightId: this._relativeResolver.tempParameter['_id'],
            LinkNode: 'sql'
        };
        return this._http.postProjSys(APIResource.SysDataLink, params).toPromise();
    }

    
    private async delSql(id) {
        return this._http.deleteProjSys(APIResource.DbCommandConfig, {Id: id}).toPromise();
    }

   
    private async delSqlParam(id) {

    }
    // 删除SQL关联表数据
    private async delSqlRelative(id) {
        const params = {
            RightId: id,
            LeftId: this._relativeResolver.tempParameter['_moduleId'],
            LinkNote: 'sql'
        };
        return this._http.deleteProjSys(APIResource.SysDataLink, params).toPromise();
    }

    private async updateSql(sql) {
        const params = {
            Id: this._relativeResolver.tempParameter['_id'],
            ScriptText: sql,
            Name: this.scriptName,
            Enabled: true,
            DbObjType: '脚本',
            NeedAlterDb: true,
            IssueFlag: '已发布',
            ShareScope: 'Project',
            DrmId: '787008d9029c4b40847d08c32a18699d'
        };
        return this._http.putProjSys(APIResource.DbCommandConfig, params).toPromise();
    }

    ngOnDestroy () {
        if (this._relativeResolver) {
            this._relativeResolver.unsubscribe();
        }
    }

    cancel() {}

}
