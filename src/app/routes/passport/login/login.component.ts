import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
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
            userName: [null, [Validators.required, Validators.minLength(5)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
        modalSrv.closeAll();
    }

    ngOnInit(): void {
        this.titleService.setTitle('配置平台');
    }
    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
        if (ret.index === 0)
            this.titleService.setTitle('配置平台');
        else
            this.titleService.setTitle('解析平台');
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
        debugger;
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;
        /* 
        setTimeout(() => {
        //     this.onlineUser = new OnlineUser();
        //     this.cacheInfo = new CacheInfo();
        //     this.loading = false;
        //     if (this.type === 0) {
        //         if (this.userName.value !== 'admin' || this.password.value !== '888888') {
        //             this.error = `账户或密码错误`;
        //             return;
        //         }
        //     }

        //     // 清空路由复用信息
        //     this.reuseTabService.clear();
        //     this.tokenService.set({
        //         token: '123456789',
        //         name: this.userName.value,
        //         email: `cipchk@qq.com`,
        //         id: 10000,
        //         time: +new Date
        //     });
        //     this.router.navigate(['/']);
        // }, 1000);
        */
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
                this.onlineUser.Identify = this.mobile.value;
                this.onlineUser.Password = Md5.hashStr(this.captcha.value).toString().toUpperCase();
                environment.SERVER_URL = APIResource.LoginUrl;
                environment.COMMONCODE = APIResource.LoginCommonCode;
                this.cacheService.set('IsSettings', 'LOGING');
            }
            // this.tokenService.clear();
            console.log(this.apiService);
            this.apiService.post(APIResource.OnlineUser, this.onlineUser).toPromise()
                .then(response => {
                    this.onlineUser = { ...response.Data };
                    if (!this.onlineUser.Online) {
                        this.error = this.onlineUser.Message;
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
                                    const Menu = this.arrayToTree(menuList.Data, '');
                                    this.menuService.add(Menu);
                                    this.cacheService.set('Menus', this.arrayToTree(menuList.Data, ''));
                                } else {
                                    //需要调整部分
                                    this.httpClient.get<any>(APIResource.localUrl).toPromise().then(apprem => {
                                        this.cacheService.set('Menus', apprem.menu);
                                        this.menuService.add(apprem.menu);
                                    })
                                }
                                return this.apiService.get(APIResource.AppPermission + '/Func.SinoForceWeb端').toPromise();
                            })
                            .then((appPermission) => {
                                if (appPermission['Status'].toString() === '200') {
                                    this.router.navigate(['/']);
                                }
                            })
                            .catch(errMsg => {
                                this.error = errMsg;
                            });
                    }
                }

                ).catch(errMsg => {
                    this.error = errMsg;
                });
        }, 1000);
    }

    // region: social

    open(type: string, openType: SocialOpenType = 'href') {
        let url = ``;
        let callback = ``;
        if (environment.production)
            callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
        else
            callback = 'http://localhost:4200/callback/' + type;
        switch (type) {
            case 'auth0':
                url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'github':
                url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'weibo':
                url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
        }
        if (openType === 'window') {
            this.socialService.login(url, '/', {
                type: 'window'
            }).subscribe(res => {
                if (res) {
                    this.settingsService.setUser(res);
                    this.router.navigateByUrl('/');
                }
            });
        } else {
            this.socialService.login(url, '/', {
                type: 'href'
            });
        }
    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }

    arrayToTree(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].ParentId == parentid || !data[i].ParentId) {
                const obj = { text: data[i].Name, id: data[i].Id, group: JSON.parse(data[i].ConfigData).group, link: JSON.parse(data[i].ConfigData).link, icon: JSON.parse(data[i].ConfigData).icon, hide: JSON.parse(data[i].ConfigData).hide };
                temp = this.arrayToTree(data[i].Children, data[i].Id);
                if (temp.length > 0) {
                    obj['children'] = temp;
                } else {
                    obj["isLeaf"] = true;
                }
                result.push(obj);
            }
        }
        return result;
    }
}
