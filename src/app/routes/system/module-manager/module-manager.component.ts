import {Component, Injectable, OnInit} from '@angular/core';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';
import {CacheService} from '@delon/cache';
import {CacheInfo} from '../../../model/APIModel/AppUser';

@Injectable()
export class ModuleService {
  moduleServiceUrl = `${APIResource.AppModuleConfig}/_root/${APIResource.AppModuleConfig}?_recursive=true&_deep=4&_root.ApplyId=3935eb43532d435398d5189d5ece0f5d&_root.parentid=in("",null)`;
  getModule(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
    return this.http.get(`${this.moduleServiceUrl}` , {
      _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
    } );
  }
  constructor(private http: ApiService) {
  }
}

@Component({
  selector: 'cn-module-manager',
  providers: [ModuleService],
  templateUrl: './module-manager.component.html',
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
export class ModuleManagerComponent implements OnInit {
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = 'asc';
  _sortField = 'order';

  constructor(
      private cacheService: CacheService,
      private apiService: ApiService,
      private _moduleService: ModuleService
    ) { }

    expandDataCache = {};

  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root) {
    const stack = [], array = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  reset() {
    this.loadData(true);
  }


  visitNode(node, hashMap, array) {
    if (!hashMap[ node.id ]) {
      hashMap[ node.id ] = true;
      array.push(node);
    }
  }

    ngOnInit() {
      this.loadData();
  }

    loadData(reset = false, event?)
    {
      if (reset) {
        this._current = 1;
        this._pageSize = event;
      }
      this._loading = true;
      this._moduleService.getModule(this._current, this._pageSize, this._sortField, this._sortValue).subscribe( (data:any) => {
        this._loading = false;
        this._total = data.Data.Total;
        this._dataSet = this.arrayToTree(data.Data.Rows, '')
        this._dataSet.forEach(item => {
          this.expandDataCache[ item.id ] = this.convertTreeToList(item);
        });
      });
    }

    add(event?) {
      console.log('新增', event );
    }

    refresh(event?){
    this._current=1;
    this._pageSize=10;
      this.loadData();
    }

    update(event?){
    }

    delete(event?){
    }

  arrayToTree(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId == parentid || !data[i].ParentId) {
        const obj =
          { text: data[i].Name,
            id: data[i].Id,
            group: JSON.parse(data[i].ConfigData).group,
            link: JSON.parse(data[i].ConfigData).link,
            icon: JSON.parse(data[i].ConfigData).icon,
            hide:  JSON.parse(data[i].ConfigData).hide,
            remark: data[i].Remark,
            order: data[i].Order,
            createtime: data[i].CreateTime,
            applyid: data[i].ApplyId,
            projid: data[i].ProjId,
            platcustomerid: data[i].PlatCustomerId

          };
        temp = this.arrayToTree(data[i].Children, data[i].Id);
        if (temp.length > 0) {
          obj['children'] = temp;
        } else {
          obj['isLeaf'] = true;
        }
        result.push(obj);
      }
    }
    return result;
  }

}
