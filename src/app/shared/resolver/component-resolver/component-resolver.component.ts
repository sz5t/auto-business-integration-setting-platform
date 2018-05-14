import { SearchResolverComponent } from '@shared/resolver/form-resolver/search-resolver.component';
import { BsnTableComponent } from './../../business/bsn-data-table/bsn-table.component';
import {
  Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnInit, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { BsnDataTableComponent } from '@shared/business/bsn-data-table/bsn-data-table.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import { CnBsnTreeComponent } from '@shared/business/bsn-tree/bsn-tree.component';
const component: { [type: string]: Type<any> } = {
  code_edit: CnCodeEditComponent,
  bsnDataTable: BsnDataTableComponent,
  bsnTable: BsnTableComponent,
  form_view: FormResolverComponent,
  search_view: SearchResolverComponent,
  bsnTree: CnBsnTreeComponent
};
@Component({
  selector: 'cn-component-resolver',
  templateUrl: './component-resolver.component.html',
})
export class ComponentResolverComponent implements OnInit, OnChanges {
  @Input() config;
  @Input() blockId;
  @Input() layoutId;
  componentRef: ComponentRef<any>;
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
  constructor(
    private http: _HttpClient,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    if (this.config) {
      this.createBsnComponent();
    }

  }

  ngOnChanges() {
    console.log('ngchange', this.config, this.componentRef);
    if (this.componentRef && this.config) {
      this.container.clear();
      this.createBsnComponent();
    }
  }

  createBsnComponent() {
    if (!component[this.config.config.component]) {
      const supportedTypes = Object.keys(component).join(', ');
      throw new Error(
        `Trying to use an unsupported types (${this.config.config.component}).Supported types: ${supportedTypes}`
      );
    }
    const comp = this.resolver.resolveComponentFactory<any>(component[this.config.config.component]);
    this.componentRef = this.container.createComponent(comp);
    this.componentRef.instance.config = this.config.config;
    if (this.componentRef.instance.dataList) {
      this.componentRef.instance.dataList = this.config.dataList;
    }
    this.componentRef.instance.layoutId = this.layoutId;
    this.componentRef.instance.blockId = this.blockId;
  }
}
