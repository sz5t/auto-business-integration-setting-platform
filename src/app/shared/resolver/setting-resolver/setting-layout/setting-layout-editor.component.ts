import { Component, OnInit, ViewChild, ComponentRef, ViewContainerRef, TemplateRef, ComponentFactoryResolver, AfterViewInit, Input, Type, OnChanges } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { NzDropdownContextComponent, NzMessageService, NzDropdownService } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { TabsResolverComponent } from '@shared/resolver/tabs-resolver/tabs-resolver.component';
const component: { [type: string]: Type<any> } = {
    tabs: TabsResolverComponent
  };
@Component({
    selector: 'cn-setting-layout-editor',
    templateUrl: './setting-layout-editor.component.html',
})
export class SettingLayoutEditorComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() config;
    @Input() blockId;
    @Input() layoutId;
    @Input() area;
    _serverLayoutId;
    menuConfig = [
        {
            label: '布局',
            value: {},
            children: [
                {
                    label: '标签页',
                    value: {
                        component: 'tabs',
                        type: 'list',
                        config: [
                            {
                                id: `tab_${this.uuID(6)}`,
                                name: `Tab 1`,
                                config: {}
                            }
                        ]
                    }
                },
                {
                    label: '分步页',
                    value: {}
                },
                {
                    label: '折叠面板',
                    value: {}
                }
            ]
        }
    ];
    componentRef: ComponentRef<any>;
    @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
    _currentComponentData;
    private dropdown: NzDropdownContextComponent;
    constructor(
        private _http: ApiService,
        private message: NzMessageService,
        private resolver: ComponentFactoryResolver,
        private nzDropdownService: NzDropdownService
    ) { }

    ngOnInit() {
    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template);
    }

    async ngAfterViewInit() {
        // 获取组件区域数据
        const params = {
            Name: this.blockId,     // 区域ID
            // TagB: '',               // 组件类型
            ParentId: this.layoutId // 布局ID
        };
        this._http.get(APIResource.AppConfigPack, params).subscribe(result => {
            if (result && result.Status === 200) {
                result.Data.forEach(data => {
                    const component = data.TagB.substring(data.TagB.lastIndexOf('.') + 1, data.TagB.length);
                    if (component === 'tabs') {
                        const d = {};
                        d['config'] = JSON.parse(data.Metadata);
                        d['dataList'] = [];
                        d['component'] = component;
                        this.createBsnComponent(d);
                    } else {
                        // this.createBsnComponent(this._dataStruct[component]);
                    }

                    this._serverLayoutId = data.Id;
                });

                /*result.Data.forEach(data => {
                  this.menuConfig.forEach(menu => {
                    menu.children.forEach(componentCfg => {
                      if(componentCfg.value.component === data.Name) {
                        this.createBsnComponent(componentCfg.value);
                        this._serverLayoutId = data.Id;
                      }
                    });
                  });
                });*/
            }
        });
    }

    ngOnChanges() {
        this.createBsnComponent();
    }

    createBsnComponent(event?) {
        if (event) {
            this.config = event;
        }
        if (this.config && this.config.component) {
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
            this.componentRef.instance.dataList = this.config.dataList;
            this.componentRef.instance.layoutId = this.layoutId;
            this.componentRef.instance.blockId = this.blockId;

            // 保存选中组件数据
            // BlockId,component,type,Metadata,Title,ParentId
            this._currentComponentData = {
                BlockId: this.blockId,
                Component: this.config.component,
                Type: this.config.type,
                Title: this.config.name,
                ParentId: this.layoutId,
                Metadata: JSON.stringify(this.config)
            };

            console.log(this._currentComponentData);



        }

    }

    saveComponent(data) {
        if (this.config.type === 'list') {
            if (this.config.component === 'tabs') {

            }
        } else {
            this._http.postProj(APIResource.ViewSetting, data).subscribe(result => {
                if (result && result.Status === 200) {
                    if (result && result.Status === 200) {
                        this.message.success('保存成功');
                    } else {
                        this.message.warning(`出现异常: ${result.Message}`);
                    }
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            });
        }
    }

   /*  _saveComponent() {
        const body: AppConfigPack_Block = {
            ParentId: this.layoutId,
            Name: this.blockId, // 组件名称
            TagA: this.uuID(10),
        };
        if (this.config.component === 'tabs') {
            body.Metadata = JSON.stringify(this.config.config);
            body.TagB = `tabs.${this.config.component}`;
        } else {
            body.TagB = `component.${this.config.component}`;
        }
        if (this._serverLayoutId) {
            body.Id = this._serverLayoutId;
            this._http.putProj(APIResource.AppConfigPack, body, { Id: this._serverLayoutId }).subscribe(result => {
                if (result && result.Status === 200) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.Message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            }
            );
        } else {
            this._http.postProj(APIResource.AppConfigPack, body).subscribe(result => {
                if (result && result.Status === 200) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.Message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            }
            );
        }
    } */

    async getTabComponent(blockId) {
        const params = {
            ParentId: this.layoutId,
            TagA: blockId
        };
        return this._http.get(APIResource.AppConfigPack, params).toPromise();
    }

    uuID(w) {
        let s = '';
        const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < w; i++) {
            s += str.charAt(Math.round(Math.random() * (str.length - 1)));
        }
        return s;
    }

}
