import {
  ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type,
  ViewContainerRef
} from '@angular/core';
import {CnFormInputComponent} from "@shared/components/cn-form-input/cn-form-input.component";
import {CnFormSubmitComponent} from "@shared/components/cn-form-submit/cn-form-submit.component";
import {CnFormSelectComponent} from "@shared/components/cn-form-select/cn-form-select.component";
import {CnDatePickerComponent} from "@shared/components/cn-date-picker/cn-date-picker.component";
import {CnTimePickerComponent} from "@shared/components/cn-time-picker/cn-time-picker.component";
import {CnFormRangePickerComponent} from "@shared/components/cn-form-range-picker/cn-form-range-picker.component";
import {CnFormCheckboxComponent} from "@shared/components/cn-form-checkbox/cn-form-checkbox.component";
import {CnFormCheckboxGroupComponent} from "@shared/components/cn-form-checkbox-group/cn-form-checkbox-group.component";
import {CnFormRadioGroupComponent} from "@shared/components/cn-form-radio-group/cn-form-radio-group.component";
const components: {[type: string]: Type<any>} = {
  input: CnFormInputComponent,
  submit: CnFormSubmitComponent,
  select: CnFormSelectComponent,
  datePicker: CnDatePickerComponent,
  timePicker: CnTimePickerComponent,
  rangePicker: CnFormRangePickerComponent,
  checkbox: CnFormCheckboxComponent,
  checkboxGroup: CnFormCheckboxGroupComponent,
  radioGroup: CnFormRadioGroupComponent
};
@Directive({
  selector: '[cnFormResolverDirective]'
})
export class FormResolverDirective implements OnInit, OnChanges{
  @Input() config;
  @Input() formGroup;
  component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }
  ngOnChanges() {
    if(this.component) {
      this.component.instance.config = this.config;
      this.component.instance.formGroup = this.formGroup;
    }
  }

  ngOnInit() {
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
      );
    }
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
    this.component = this.container.createComponent(comp);
    this.component.instance.config = this.config;
    if(this.config.type !== 'submit' || this.config.type !== 'button') {
      this.component.instance.formGroup = this.formGroup;
    }

  }
}
