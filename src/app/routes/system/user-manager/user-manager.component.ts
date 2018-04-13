import { Component, Injectable, OnInit } from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import {CacheService} from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class RandomUserService {
  randomUserUrl = APIResource.AppUser;

  getUsers(pageIndex = 1, pageSize = 2, sortField, sortOrder, genders) {
    return this.http.get(`${this.randomUserUrl}`, {
      _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
    });
  }
  constructor(private http: ApiService) {
  }
}

@Component({
  selector: 'app-user-manager',
  providers: [ RandomUserService ],
  templateUrl: './user-manager.component.html',
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


export class UserManagerComponent implements OnInit {
  //region
  content:any;
  contentConfigPack:any;
  contentModule:any;

  addcontent:any;
  addcontentConfigPack:any;
  addcontentModule:any;

  putcontent:any;
  putcontentConfigPack:any;
  putcontentModule:any;

  delcontent:any;
  delcontentConfigPack:any;
  delcontentModule:any;
  // location: Location;
  //endregion

  _current = 1;
  _pageSize = 2;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = 'asc';
  _sortField = 'CreateTime';
  _filterGender = [];

  Gender= {Unknown: '未知', Male: '男', Female: '女'};
  sort(sort) {
      console.log(111,sort.value === 'descend')
    this._sortValue = (sort.value == 'descend') ? 'DESC' : 'ASC';
    this._sortField = sort.key;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }
    constructor(
      private cacheService: CacheService,
      private apiService: ApiService,
      public msgSrv: NzMessageService,
      private _randomUser: RandomUserService
    ) { }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this._randomUser.getUsers(this._current, this._pageSize, this._sortField, this._sortValue,'').subscribe((data: any) => {
      this._loading = false;
      this._total = data.Data.Total;
      this._dataSet = data.Data.Rows;
    });
  };

  ngOnInit() {
    this.refreshData();
    }

    //region
    clear()
    {
      this.content = '';
      this.contentConfigPack = '';
      this.contentModule = '';

      this.addcontent = '';
      this.addcontentConfigPack = '';
      this.addcontentModule = '';

      this.putcontent = '';
      this.putcontentConfigPack = '';
      this.putcontentModule = '';

      this.delcontent = '';
      this.delcontentConfigPack = '';
      this.delcontentModule = '';
    }

  getUser()
  {
    this.clear();
    this.apiService.get(APIResource.AppUser, {
      _select: 'Id,RealName'}).toPromise().then(
      response => {
        this.content = JSON.stringify(response.Data);
      }
    );
  }
    currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean }>)
    {

    }
  getModule()
  {
    this.clear();
    this.apiService.getProj(APIResource.AppModuleConfig, {_select : 'Id,Name'}).toPromise().then(
      response => {
        this.contentModule = JSON.stringify(response.Data);
      }
    );
  }

  getAppConfigPack()
  {
    this.clear();
    this.apiService.getProj(APIResource.AppConfigPack, {
      _select: 'Id,Name'
    }).toPromise().then(
      response => {
        this.contentConfigPack = JSON.stringify(response.Data);
      }
    );
  }

  addUser()
  {
    this.clear();
    this.apiService.post(APIResource.AppUser,
      {
        "UserType":"测试账号",
        "Name":"test",
        "Code":"180306986165123",
        "Password":"6",
        "OrgId":"333",
        "RealName":"测试",
        "NickName":"测试",
        "Gender":"Male",
        "LoginLimitKind":"None",
        "Status":"Normal",
        "Remark":null,
        "Id":'46d5c928d26b47c0a70235479bb9cfd4'
      }).toPromise().then(
      response => {
        this.addcontent = JSON.stringify(response.Data);
      }
    );
  }

  addModule()
  {
    this.clear();
    this.apiService.postProj(APIResource.AppModuleConfig, ).toPromise().then(
      response => {
        this.addcontentModule = JSON.stringify(response.Data);
      }
    );
  }

  addAppConfigPack()
  {
    this.clear();
    this.apiService.postProj(APIResource.AppConfigPack, ).toPromise().then(
      response => {
        this.addcontentConfigPack = JSON.stringify(response.Data);
      }
    );
  }

  putUser()
  {
    this.clear();
    this.apiService.put(APIResource.AppUser, {
      Id: '46d5c928d26b47c0a70235479bb9cfd4'},{
    "PersonId":" ",
      "UserType":"修改了测试账号",
      "Name":"test",
      "Code":"188888986165123",
      "Password":"6",
      "OrgId":"888",
      "RealName":"测试88",
      "NickName":"测试88",
      "Gender":"Male",
      ID:'46d5c928d26b47c0a70235479bb9cfd4'
  }).toPromise().then(
      response => {
        this.putcontent = JSON.stringify(response.Data);
      }
    );
  }

  putModule()
  {
    this.clear();
    this.apiService.putProj(APIResource.AppModuleConfig, {_select : 'Id,Name'}).toPromise().then(
      response => {
        this.putcontentModule = JSON.stringify(response.Data);
      }
    );
  }

  putAppConfigPack()
  {
    this.clear();
    this.apiService.putProj(APIResource.AppConfigPack, {
      _select: 'Id,Name'
    }).toPromise().then(
      response => {
        this.putcontentConfigPack = JSON.stringify(response.Data);
      }
    );
  }

  delUser()
  {
    this.clear();
    this.apiService.delete(APIResource.AppUser, {
      Id: '46d5c928d26b47c0a70235479bb9cfd4'}).toPromise().then(
      response => {
        if(response.Data) {
          this.delcontent = JSON.stringify(response.Data);
        }
      }
    );
  }

  delModule()
  {

    this.clear();
    this.apiService.deleteProj(APIResource.AppModuleConfig, {_select : 'Id,Name'}).toPromise().then(
      response => {
        this.delcontentModule = JSON.stringify(response.Data);
      }
    );
  }

  delAppConfigPack()
  {
    // console.log(1111,this.location);
    this.clear();

    this.apiService.deleteProj(APIResource.AppConfigPack, {
      _select: 'Id,Name'
    }).toPromise().then(
      response => {
        this.delcontentConfigPack = JSON.stringify(response.Data);
      }
    );
  }
  //endregion

}
