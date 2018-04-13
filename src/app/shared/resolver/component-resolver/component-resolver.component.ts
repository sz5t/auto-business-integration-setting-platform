import {
  Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnInit, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {BsnDataTableComponent} from "@shared/business/bsn-data-table/bsn-data-table.component";
import {FormResolverComponent} from "@shared/resolver/form-resolver/form-resolver.component";
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
const component: { [type: string]: Type<any> } = {
  code_edit: CnCodeEditComponent,
  bsnDataTable: BsnDataTableComponent,
  form_view: FormResolverComponent
};
@Component({
  selector: 'cn-component-resolver',
  templateUrl: './component-resolver.component.html',
})
export class ComponentResolverComponent implements OnInit, OnChanges {
  @Input() config;
  componentRef: ComponentRef<any>;
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
  constructor(
      private http: _HttpClient,
      private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    if(this.config){
      this.createBsnComponent();
    }

  }

  ngOnChanges() {
    if (this.componentRef) {
      this.createBsnComponent();
    }
  }

  createBsnComponent() {
    if (!component[this.config.component]) {
      const supportedTypes = Object.keys(component).join(', ');
      throw new Error(
        `Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`
      );
    }
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(component[this.config.component]);
    this.componentRef = this.container.createComponent(comp);
    this.componentRef.instance.config = this.config.config;
    if(this.componentRef.instance.dataList) {
      this.componentRef.instance.dataList = this.config.dataList;
    }
  }
}
