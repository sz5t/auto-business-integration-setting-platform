import {Component, Injectable, OnInit} from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import {NzMessageService} from 'ng-zorro-antd';


@Injectable()
export class ResourceTypeService {
    ResourceTypeUrl = APIResource.Resource_Type;

    getResourceType(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
        return this.http.getProj(`${this.ResourceTypeUrl}`, {
            _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
            });
    }

    deleteType(name?) {
        const ids = name.join(',');
        if( ids.length > 0 ) {
            return this.http.deleteProj(this.ResourceTypeUrl, { _ids: ids});
        }
    }

    constructor(private http: ApiService) {
    }
}


@Injectable()
export class EntityProDefService {
    EntityProDefUrl = APIResource.EntityPropertyDefine;

    getResourceType(pageIndex = 1, pageSize = 2, sortField, sortOrder, parentId) {
        return this.http.getProj(`${this.EntityProDefUrl}`, {
            OwnerId: parentId, _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}` });
    }

    constructor(private http: ApiService) {
    }
}

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
    providers: [ResourceTypeService, EntityProDefService],
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
export class DataManagerComponent implements OnInit {
    _tallChecked = false;
    _tindeterminate = false;
    _tcurrent = 1;
    _tpageSize = 10;
    _ttotal = 1;
    _tdataSet = [];
    _tloading = true;
    _tsortValue = 'asc';
    _tsortField = 'CreateTime';
    _tcacheMapData;
    _teditCache = {};

    _eallChecked = false;
    _eindeterminate = false;
    _ecurrent = 1;
    _epageSize = 10;
    _etotal = 1;
    _edataSet = [];
    _eloading = false;
    _esortValue = 'asc';
    _esortField = 'CreateTime';
    _ecacheMapData;
    _eeditCache = {};

    shared;


    _tcheckAll() {
        this._tdataSet.forEach(item => item.checked = this._tallChecked);
        this._tcacheMapData.forEach( mpa =>{mpa.checked = this._tallChecked});
    }

    tselectRow(data?){
        this._tdataSet.forEach( item => {
            item.selected = false;
        });
        this.refreshEntityProDef(data.Id);
        data.selected = true;
        this._tcacheMapData.get(data.Id).checked = data.checked;
    }

    _echeckAll() {
        this._edataSet.forEach(item => item.checked = this._eallChecked);
        this._ecacheMapData.forEach( mpa =>{mpa.checked = this._eallChecked});
    }

    eselectRow(data?){
        this._edataSet.forEach( item => {
            item.selected = false;
        });
        data.selected = true;
        this._ecacheMapData.get(data.Id).checked = data.checked;
    }

    constructor(private resourceType: ResourceTypeService,
                public msgSrv: NzMessageService,
                private entityProDef: EntityProDefService ) {
        this.shared = new Map();
        this.shared.set('Customer', '当前客户');
        this.shared.set('Project', '项目的授权客户');
        this.shared.set('All', '所有客户');

    }

    ngOnInit() {
        this.refreshResourceType();
    }


    sortType(sort) {
        this._tsortValue = (sort.value === 'descend') ? 'DESC' : 'ASC';
        this._tsortField = sort.key;
        this.refreshResourceType();
    }

    sortEntity(sort) {
        this._esortValue = (sort.value === 'descend') ? 'DESC' : 'ASC';
        this._esortField = sort.key;
        this.refreshEntityProDef();
    }

    refreshResourceType(reset = false){
        if( reset ){
            this._tcurrent = 1;
        }
        this._tcacheMapData = new Map();
        this._tallChecked = false;
        this._tloading = true;
        this.resourceType.getResourceType(this._tcurrent, this._tpageSize, this._tsortField, this._tsortValue).subscribe( (response) => {
            this._tloading = false;
            this._ttotal = response.Data.Total;
            this._tdataSet = response.Data.Rows;
            this._tdataSet.forEach(item => {
                this._tcacheMapData.set(item.Id, {checked: false, dataItem: item});
            });
        } );
    }

    refreshEntityProDef(parentId?: string, reset = false){
        if( reset ){
            this._ecurrent = 1;
        }
        this._ecacheMapData = new Map();
        this._eallChecked = false;
        this._eloading = true;
        this.entityProDef.getResourceType(this._ecurrent, this._epageSize, this._esortField, this._esortValue, parentId).subscribe( (response) => {
            this._eloading = false;
            this._etotal = response.Data.Total;
            this._edataSet = response.Data.Rows;
            this._edataSet.forEach(item => {
                this._ecacheMapData.set(item.Id, {checked: false, dataItem: item});
            });
        } );
    }

    tdelete(event?) {
        const name = this.gettSelectId();
        if(name.length >= 1) {
            this.resourceType.deleteType(name).subscribe(response => {
                if (response.Status === 200) {
                    this.msgSrv.success(response.Message);
                    name.forEach( na =>{
                        this._tcacheMapData.delete(na);
                    })
                    this.refreshResourceType();
                } else {
                    this.msgSrv.error(response.Message);
                }
            });
        }else {
            this.msgSrv.success('请选中要删除的数据！');
        }
    }

    gettSelectId() {
        const name = [] ;
        this._tcacheMapData.forEach(item =>{
            if(item.checked){
                name.push(item.dataItem.Id);
            }
        })
        return name;
    }



    getShared(data?)
    {
        return this.shared.get(data);
    }
}