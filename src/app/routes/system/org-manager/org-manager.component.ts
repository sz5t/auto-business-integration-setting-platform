import {Component, Injectable, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';


@Injectable()
export class OrgService {
    OrgNodeUrl = APIResource.OrgNode;
    moduleServiceUrl = `${APIResource.OrgNode}/_root/${APIResource.OrgNode}?_recursive=true&_deep=4&_root.ApplyId=3935eb43532d435398d5189d5ece0f5d&_root.parentid=in("",null)`;
    getorg(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
        return this.http.get(`${this.OrgNodeUrl}`, {
            _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
        });
    }

    deleteorg(name?) {
        const ids = name.join(',');
        if( ids.length > 0 ) {
            return this.http.deleteProj(this.OrgNodeUrl, { _ids: ids});
        }
    }

    constructor(private http: ApiService) {
    }
}

@Component({
  selector: 'app-org-manager',
  templateUrl: './org-manager.component.html',
    providers: [OrgService],
  styles: [
        `
    .table-operations {
      margin-bottom: 16px;
    }
    
    .table-operations > button {
      margin-right: 8px;
    }
    .selectedRow{
        color:blue;
    }
    `
    ]
})
export class OrgManagerComponent implements OnInit {

    _allChecked = false;
    _indeterminate = false;
    _current = 1;
    _pageSize = 2;
    _total = 1;
    _dataSet = [];
    _loading = true;
    _sortValue = 'asc';
    _sortField = 'CreateTime';
    _cacheMapData;
    _editCache = {};
    _parentid = 'XXX';

    constructor(
        private orgService: OrgService
    ) { }

    ngOnInit() {
        this.refreshOrg();
    }
    //
    // _checkAll() {
    //     this._dataSet.forEach(item => item.checked = this._allChecked);
    //     this._cacheMapData.forEach( mpa =>{mpa.checked = this._allChecked});
    // }

    refresh() {
        this.refreshOrg();
    }

    add() {
        console.log('Add');
    }

    update() {
        console.log('Update');
    }

    delete() {
        console.log('Delete');
    }

    refreshOrg(reset = false){
        if( reset ){
            this._current = 1;
        }
        this._cacheMapData = new Map();
        // this._allChecked = false;
        this._loading = true;
        this.orgService.getorg(this._current, this._pageSize, this._sortField, this._sortValue).subscribe( (response) => {
            this._loading = false;
            this._total = response.Data.Total;
            this._dataSet = response.Data.Rows;
            this._dataSet.forEach(item => {
                this._cacheMapData.set(item.Id, {checked: false, dataItem: item});
            });
        } );
    }

}
