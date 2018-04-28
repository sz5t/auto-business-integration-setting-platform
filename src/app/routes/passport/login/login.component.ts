import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService , TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { OnlineUser } from '../../../model/APIModel/OnlineUser';
import { AppUser, CacheInfo } from '../../../model/APIModel/AppUser';
import { APIResource } from '@core/utility/api-resource';
import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnInit, OnDestroy {
    form: FormGroup;
    error = '';
    errorApp = '';
    type = 0;
    loading = false;

    onlineUser: OnlineUser;
    appUser: AppUser;
    cacheInfo: CacheInfo;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private httpClient: HttpClient,
        private cacheService: CacheService,
        private apiService: ApiService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        private titleService: TitleService,
        private menuService: MenuService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(1)]],
            password: [null, Validators.required],
            uName: [null, [Validators.required, Validators.minLength(1)]],
            uPassword: [null, [Validators.required]],
            remember: [true]
        });
        modalSrv.closeAll();
    }

    ngOnInit(): void {
        this.titleService.setTitle('配置平台');
        this.cacheService.set('AppName', '自动化业务装配系统');
    }
    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get uName() { return this.form.controls.uName; }
    get uPassword() { return this.form.controls.uPassword; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
        if (ret.index === 0) {
            this.titleService.setTitle('配置平台');
        } else {
            this.titleService.setTitle('解析平台');
            this.cacheService.set('AppName', 'XXX信息化系统');
        }
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.error = '';
        this.errorApp = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.uName.markAsDirty();
            this.uName.updateValueAndValidity();
            this.uPassword.markAsDirty();
            this.uPassword.updateValueAndValidity();
            if (this.uName.invalid || this.uPassword.invalid) return;
        }
        // mock http
        this.loading = true;
        this.reuseTabService.clear();

        setTimeout(() => {
            this.onlineUser = new OnlineUser();
            this.cacheInfo = new CacheInfo();
            this.loading = false;
            if (this.type === 0) {
                this.onlineUser.Identify = this.userName.value;
                this.onlineUser.Password = Md5.hashStr(this.password.value).toString().toUpperCase();
                environment.SERVER_URL = APIResource.SettingUrl;
                environment.COMMONCODE = APIResource.SettingCommonCode;
                this.cacheService.set('IsSettings', 'SETTING');
            } else {
                this.onlineUser.Identify = this.uName.value;
                this.onlineUser.Password = Md5.hashStr(this.uPassword.value).toString().toUpperCase();
                environment.SERVER_URL = APIResource.LoginUrl;
                environment.COMMONCODE = APIResource.LoginCommonCode;
                this.cacheService.set('IsSettings', 'LOGING');
            }
            this.apiService.post(APIResource.OnlineUser, this.onlineUser).toPromise()
                .then(response => {
                    this.onlineUser = { ...response.Data };
                    if (!this.onlineUser.Online) {
                        if(this.type === 0 )
                            this.error = this.onlineUser.Message;
                        else this.errorApp = this.onlineUser.Message;
                        return null;
                    }
                    this.cacheService.set('OnlineUser', this.onlineUser);
                    this.cacheInfo.ProjectId = this.onlineUser.ProjId;
                    this.cacheInfo.PlatCustomerId = this.onlineUser.PlatCustomerId;

                    return response;
                }).then(param => {
                    if (param) {
                        this.tokenService.set({
                            token: param.Data.Token
                        });
                        this.apiService.get(APIResource.AppUser + '/' + param.Data.UserId)
                            .toPromise()
                            .then((response) => {
                                this.appUser = { ...response.Data };
                                this.settingsService.setUser(this.appUser);
                                this.cacheInfo.RealName = this.appUser.RealName;
                                this.cacheService.set('User', this.appUser);
                                return this.apiService.get(APIResource.SysCommonCode, {
                                    name: environment.COMMONCODE,
                                    ApplyId: 'ApplyId'
                                }).toPromise();
                            })
                            .then(commonCode => {
                                this.cacheInfo.ApplyId = commonCode['Data'][0].Id;
                                this.cacheService.set('ParamsUrl', this.cacheInfo);
                                return this.apiService.getProj(`${APIResource.AppModuleConfig}/_root/${APIResource.AppModuleConfig}?_recursive=true&_deep=4&_root.ApplyId=${this.cacheInfo.ApplyId}&_root.parentid=in("",null)`, {
                                    _orderBy: 'order asc'
                                }).toPromise();
                            })
                            .then((menuList) => {

                                if (environment.COMMONCODE === APIResource.LoginCommonCode) {
                                    //运行平台菜单
                                    let Menu  = this.arrayToTree(menuList.Data, '');
                                    this.cacheService.set('Menus', Menu);
                                    this.menuService.add(Menu);
                                } else {
                                    //需要调整部分  配置平台菜单
                                    this.httpClient.get<any>(APIResource.localUrl).toPromise().then(apprem => {
                                        this.cacheService.set('Menus', apprem.menu);
                                        this.menuService.add(apprem.menu);
                                    })
                                }
                                return this.apiService.get(APIResource.AppPermission + '/Func.SinoForceWeb前端').toPromise();
                            })
                            .then((appPermission) => {
                                if (appPermission['Status'].toString() === '200') {
                                    if(this.type === 0){
                                        this.router.navigate(['/']);
                                    }else{
                                        const appper = appPermission.Data;
                                        // this.cacheService.set('AppPermission', appper);
                                        this.appPerMerge(appper);
                                        this.router.navigate(['/dashboard/analysis']);
                                    }
                                }
                            })
                            .catch(errMsg => {
                                this.showError(errMsg);
                            });
                    }
                }

            ).catch(errMsg => {
                this.showError(errMsg);
            });
        }, 1000);
    }

    appPerMerge(data) {
        const menus: any[] = this.cacheService.getNone('Menus');
        const permis = data['FuncResPermission'].SubFuncResPermissions[0].SubFuncResPermissions;
        this.seachModule(menus, permis);
        this.cacheService.set('Menus', menus);
        this.menuService.add(menus);
}

    seachModule(menus, data) {
        menus.forEach(item => {
                const strPer = JSON.stringify(this.searchAppper(item.id, data));
                const Perer = JSON.parse(strPer.substring(strPer.indexOf('[{'), strPer.lastIndexOf('}]') + 2));
                switch(Perer[0].Permission){
                    case 'Invisible':
                        // console.log(111, item.hide);
                        item.hide = true;
                        // console.log(222, item.hide);
                        break;
                    case 'Permitted':
                        // console.log(333, item.hide);
                        item.hide = false;
                        // console.log(444, item.hide);
                        break;
                    default:
                        // console.log(555, item.hide);
                }
                if(item.children) {
                    this.seachModule(item.children, data);
                }
            }
        )
    }

    searchAppper(moduleId, data): string  {
        var OpPer:any=[];
        if(data && data.length > 0) {
            data.forEach( item => {
                if (item.Id === moduleId) {
                    OpPer.push(item.OpPermissions);
                }else {
                    var getAppper = this.searchAppper(moduleId, item.SubFuncResPermissions)
                    if(getAppper && item.Name.length>0)
                        OpPer.push(getAppper);
                };
            });
        } return OpPer;
    }

    showError(errmsg) {
        if(this.type === 0 )
            this.error = errmsg;
        else this.errorApp = errmsg;
    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }

    arrayToTree(data, parentid): any[] {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].ParentId === parentid || !data[i].ParentId) {
                const obj = {
                    text: data[i].Name,
                    id: data[i].Id,
                    group: JSON.parse(data[i].ConfigData).group,
                    link: JSON.parse(data[i].ConfigData).link,
                    icon: JSON.parse(data[i].ConfigData).icon,
                    hide: JSON.parse(data[i].ConfigData).hide ? true : false
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
