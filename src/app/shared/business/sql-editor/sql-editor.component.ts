import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';

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
  `]
})
export class SqlEditorComponent implements OnInit {

    total = 0;
    pageIndex = 1;
    pageSize = 10;
    tableData = [];

    @ViewChild('editor') editor: CnCodeEditComponent;
    constructor(
        private _http: ApiService
    ) { }

    ngOnInit() {
        (async () => {
            const response = await this.load();
            if (response.Data && response.Status === 200) {
                this.tableData = response.Data.Rows;
                this.total = response.Data.Total;
                this.tableData.map(d => {
                    d['expand'] = false;
                    d['selected'] = false;
                });

                console.log(this.tableData);
            }
        })();
    }

    async load() {
        return this._http.get(APIResource.DbCommandConfig, {
            _page: this.pageIndex,
            _rows: this.pageSize
        }).toPromise();
    }

    selectRow(row) {
        this.tableData.map(d => {
            d.selected = false;
        });
        row.selected = true;
        this.editor.setValue(row.ScriptText);
    }

}
