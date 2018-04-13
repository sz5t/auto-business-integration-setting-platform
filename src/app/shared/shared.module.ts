import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
import { ComponentResolverComponent } from '@shared/resolver/component-resolver/component-resolver.component';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { LayoutSettingResolverComponent } from '@shared/resolver/layout-resolver/layout-setting-resolver.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { CnFormInputComponent } from '@shared/components/cn-form-input/cn-form-input.component';
import { CnFormSubmitComponent } from '@shared/components/cn-form-submit/cn-form-submit.component';
import { CnFormCheckboxGroupComponent } from '@shared/components/cn-form-checkbox-group/cn-form-checkbox-group.component';
import { CnFormRangePickerComponent } from '@shared/components/cn-form-range-picker/cn-form-range-picker.component';
import { CnFormCheckboxComponent } from '@shared/components/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormRadioGroupComponent } from '@shared/components/cn-form-radio-group/cn-form-radio-group.component';
import { CnGridInputComponent } from '@shared/components/cn-grid-input/cn-grid-input.component';
import { CnGridSelectComponent } from '@shared/components/cn-grid-select/cn-grid-select.component';
import { BsnDataTableComponent } from '@shared/business/bsn-data-table/bsn-data-table.component';
import { BsnTableComponent } from '@shared/business/bsn-data-table/bsn-table.component';
import { TabsResolverComponent } from '@shared/resolver/tabs-resolver/tabs-resolver.component';
import { CnContextMenuComponent } from '@shared/components/cn-context-menu/cn-context-menu.component';
import { CnFormSelectComponent } from '@shared/components/cn-form-select/cn-form-select.component';
import { FormResolverDirective } from '@shared/resolver/form-resolver/form-resolver.directive';
import { GridEditorDirective } from '@shared/resolver/grid-resolver/grid-editor.directive';
// import { NzSchemaFormModule } from 'nz-schema-form';
const THIRDMODULES = [
    NgZorroAntdModule,
    CountdownModule,
    UEditorModule,
    NgxTinymceModule,
    // NzSchemaFormModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [
    ComponentResolverComponent,
  ComponentSettingResolverComponent,
  LayoutResolverComponent,
  LayoutSettingResolverComponent,
  FormResolverComponent,
  CnFormInputComponent,
  CnFormSubmitComponent,
  CnFormSelectComponent,
  //CnDatePickerComponent,
  //CnTimePickerComponent,
  //CnFormRangePickerComponent,
  CnFormCheckboxComponent,
  CnFormCheckboxGroupComponent,
  CnFormRadioGroupComponent,
  CnGridInputComponent,
  CnGridSelectComponent,
  //CnGridDatePickerComponent,
  //CnGridTimePickerComponent,
  //CnGridRangePickerComponent,
  //CnGridCheckboxComponent,
  BsnDataTableComponent,
  BsnTableComponent,
  CnContextMenuComponent,
  //CnCodeEditComponent,
  TabsResolverComponent,
  FormResolverComponent
  
];
const DIRECTIVES = [
    FormResolverDirective,
    GridEditorDirective
];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        // third libs
        ...THIRDMODULES
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AlainThemeModule,
        DelonABCModule,
        DelonACLModule,
        // i18n
        TranslateModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    entryComponents:[
        ...COMPONENTS
    ]
})
export class SharedModule { }