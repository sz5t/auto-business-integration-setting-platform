import {Component, Injectable, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';


@Injectable()
export class OrgService {
    OrgNodeUrl = APIResource.OrgNode;

    getorg(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
        return this.http.getProj(`${this.OrgNodeUrl}`, {
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

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
