import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs/observable/zip';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';
import { APIResource } from '@core/utility/api-resource';
import { CacheService } from '@delon/cache';
import { environment } from '@env/environment';
import { TokenService, DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private injector: Injector,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private cacheService: CacheService) {

    }

    load(): Promise<any> {

        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {


            zip(
                this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`),
                this.httpClient.get(APIResource.localUrl)
                //this.httpClient.get('assets/app-data.json')
            ).pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([langData, appData]) => {
                    resolve(null);
                    return [langData, appData];
                })
            ).subscribe(([langData, appData]) => {

                    // setting language data
                    this.translate.setTranslation(this.i18n.defaultLang, langData);
                    this.translate.setDefaultLang(this.i18n.defaultLang);
                    //语言信息
                    this.settingService.setLayout('lang','zh-CN');
                    // application data
                    const res: any = appData;
                    if(!this.cacheService.getNone('IsSettings')) {
                        this.cacheService.clearNotify();
                        this.tokenService.clear();
                        this.cacheService.set('Menus', res.menu);
                    }
                    const user: any = this.cacheService.getNone('User');
                    const menu: any = this.cacheService.getNone('Menus');


                    // 应用信息：包括站点名、描述、年份
                    this.settingService.setApp(res.app);
                    // 用户信息：包括姓名、头像、邮箱地址
                    this.settingService.setUser(user);
                    // ACL：设置权限为全量
                    this.aclService.setFull(true);
                    // 初始化菜单
                    if(this.cacheService.getNone('IsSettings') === 'LOGING') {
                        environment.SERVER_URL = APIResource.LoginUrl;
                    }
                    else if(this.cacheService.getNone('IsSettings') === 'SETTING'){
                        environment.SERVER_URL = APIResource.SettingUrl;
                    }
                    this.menuService.add(menu);
                    // 设置页面标题的后缀
                    this.titleService.suffix = res.app.name;
                },
                () => { },
                () => {
                    resolve(null);
                });
        });
    }
}
