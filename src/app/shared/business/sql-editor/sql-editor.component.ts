import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import { RelativeResolver, RelativeService } from '@core/relative-Service/relative-service';
import { NzMessageService } from 'ng-zorro-antd';

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
export class SqlEditorComponent implements OnInit {

    total = 0;
    pageIndex = 1;
    pageSize = 10;
    tableData = [];
    _tempValue = {};
    scriptName;
    @Input() config;
    @ViewChild('editor') editor: CnCodeEditComponent;
    constructor(
        private _http: ApiService,
        private _relativeResolver: RelativeResolver,
        private _relativeService: RelativeService,
        private _message: NzMessageService
    ) { }

    ngOnInit() {
        this._tempValue['_moduleId'] = '647d11660882564f88051e9141a42220';
        // this._relativeResolver.reference = this;
        // this._relativeResolver.relations = this.config.relations;
        // this._relativeResolver.resolverRelation();
        this.load();
    }

    async load(condition?) {
        // tslint:disable-next-line:no-debugger
        let param = {
            _page: this.pageIndex,
            _rows: this.pageSize
        };
        if (condition) {
            param = {...param, ...condition};
        }
        const response  = await this._http.getProj(APIResource.DbCommandConfig, param).toPromise();
        if (response.Data && response.Status === 200) {
            this.tableData = response.Data.Rows;
            this.total = response.Data.Total;
            this.tableData.map(d => {
                d['expand'] = false;
                d['selected'] = false;
            });
        }
    }

    selectRow(row) {
        this.tableData.map(d => {
            d.selected = false;
        });
        row.selected = true;
        this.editor.setValue(row.ScriptText);
    }

    add() {
        this.editor.setValue('');
        this._tempValue['_id'] && delete this._tempValue['_id'];
    }

    async save() {
        const sqlString = this.editor.getValue();
        let returnValue: any;
        if (this._tempValue['_id']) {
            // update
            returnValue = this.updateSql(sqlString);
        } else {
            // add
            if (sqlString && sqlString.length > 0) {
                returnValue = await this.addSql(sqlString);
                if (returnValue.Data && returnValue.Status === 200) {
                    this._tempValue['_id'] = returnValue.Data.Id;
                    const rel = await this.addSqlRelative();
                }
            }
        }
        switch (returnValue.Status) {
            case 200:
                this._message.create('success', 'SQL 保存成功');
                this.load({_focusedId: this._tempValue['_id']});
                break;
            case 500:
                this._message.create('error', returnValue.Message);
                break;
            default:
                this._message.create('info', returnValue.Message);
        }
    }

    delete (id) {
        (async() => {
            const resSql = await this.delSql(id);
            const resParams = await this.delSqlRelative(id);
            switch (resSql.Status) {
                case 200:
                    this._message.create('success', 'SQL 删除成功');
                    this.load({_focusedId: this._tempValue['_id']});
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

    private async addSql(sql) {
        const params = {
            ScriptText: sql,
            Name: this.scriptName
        };
        return this._http.postProj(APIResource.DbCommandConfig, params).toPromise();
    }

    private async addSqlRelative() {
        const params = {
            LeftId: this._tempValue['_moduleId'],
            RightId: this._tempValue['_id'],
            LinkNode: 'sql'
        };
        return this._http.postProj(APIResource.SysDataLink, params).toPromise();
    }

    private async delSql(id) {
        return this._http.deleteProj(APIResource.DbCommandConfig, {Id: id}).toPromise();
    }

    private async delSqlRelative(id) {
        const params = {
            RightId: id,
            LeftId: this._tempValue['_moduleId'],
            LinkNote: 'sql'
        };
        return this._http.deleteProj(APIResource.DbCommandConfig, {Id: id}).toPromise();
    }

    private async updateSql(sql) {
        const params = {
            ScriptText: sql,
            Name: this.scriptName,
            Id: this._tempValue['_id']
        };
        return this._http.putProj(APIResource.DbCommandConfig, params).toPromise();
    }

}
