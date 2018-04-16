import {Component, Injectable, OnInit} from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';



@Injectable()
export class RoleService {
  roleServiceUrl = APIResource.PrivRole;

  getPrivRole(pageIndex = 1, pageSize = 2, sortField, sortOrder, genders) {
    return this.http.get(`${this.roleServiceUrl}`, {
      _page: pageIndex, _rows: pageSize//, _orderBy: `${sortField} ${sortOrder}`
    });
  }
  constructor(private http: ApiService) {
  }
}


@Component({
  selector: 'app-role-manager',
  providers: [RoleService],
  templateUrl: './role-manager.component.html',
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
export class RoleManagerComponent implements OnInit {

  _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet = [];
    _loading = true;
    _sortValue = 'asc';
    _sortField = 'order';
    _filterGender = [];
  sort(field , value) {
    this._sortValue = (value === 'descend') ? 'DESC' : 'ASC';
    this._sortField = field;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }

  constructor(private _randomBase: RoleService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this._randomBase.getPrivRole(this._current, this._pageSize, this._sortField, this._sortValue,'').subscribe((data: any) => {
      this._loading = false;
      this._total = data.Data.Total;
      this._dataSet = data.Data.Rows;
    });
  };

  ngOnInit() {
    this.refreshData();
  }

}
