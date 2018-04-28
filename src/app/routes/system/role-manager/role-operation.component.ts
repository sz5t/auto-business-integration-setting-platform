import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzFormatEmitEvent, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';
import {AppPermission, FuncResPermission, OpPermission, PermissionValue} from '../../../model/APIModel/AppPermission';

@Component({
  selector: 'app-role-operation',
  templateUrl: './role-operation.component.html',
})
export class RoleOperationComponent implements OnInit {

    constructor(
        private cacheService: CacheService,
        private fb: FormBuilder,
        private modal: NzModalRef
    ) { }

    roleOperForm: FormGroup;
    _data : any;
    _parentId: string;
    values: any[] ;
    moduleObj: any[];
    nodes: NzTreeNode[] ;

    @Input()
    set data(value: any) {
        this._data = value;
    }
    ngOnInit() {
        this.nodes=[];
        this.roleOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            AppPermission : [null],
            Remark     : [null],
            ShareScope     : [ 'Project'],
            Operations: [null],
        });
        if(this._data) {
            this.roleOperForm.controls['Name'].setValue(this._data.Name);
            const appper = this._data.AppPermission;
            this.SettingPermission(appper.FuncResPermission.SubFuncResPermissions[0].SubFuncResPermissions);//(JSON.parse(appper))['FuncResPermission'].SubFuncResPermissions[0].SubFuncResPermissions
            this.roleOperForm.controls['Remark'].setValue(this._data.Remark);
            this.roleOperForm.controls['ShareScope'].setValue(this._data.ShareScope);


        }
        let modulestr = JSON.stringify(this.cacheService.getNone('Menus'));
        const id = /id/g;
        const text = /text/g;
        modulestr = modulestr.replace(id, 'key');
        modulestr = modulestr.replace(text, 'title');
        this.moduleObj = JSON.parse(modulestr);

        this.moduleObj.forEach(item => {
            let treeNode = new NzTreeNode(item);
            //todo:后期考虑对禁用的模块进行展示处理
            // treeNode.isDisableCheckbox = true;
            this.nodes.push( treeNode);
        });
    }

    emitDataOutside() {
        if(!this.roleOperForm.valid)
            return;
        if(!this._data) this._data = {};
        this._data['Name'] =   this.roleOperForm.controls['Name'].value;
        this._data['AppPermission'] =  this.testApp();
        this._data['Remark'] =  this.roleOperForm.controls['Remark'].value;
        this._data['ShareScope'] = this.roleOperForm.controls['ShareScope'].value;
        this.modal.destroy(this._data);
    }

    testApp() {
        const appPermission: AppPermission = new AppPermission();
        const funcResPermissionroot: FuncResPermission = new FuncResPermission();
        const funcResPermissionwqd: FuncResPermission = new FuncResPermission('SinoForceWeb前端', 'SinoForceWeb前端');

        this.AddPermission(funcResPermissionwqd,this.nodes);

        funcResPermissionroot.SubFuncResPermissions.push(funcResPermissionwqd)
        appPermission.FuncResPermission = funcResPermissionroot;
        // console.log(JSON.stringify(appPermission));
        return appPermission;
    }

    AddPermission(funcResPermissionwqd: FuncResPermission, moduleTree: any) {
        moduleTree.forEach(item => {
            const funcResPermissionsub = new FuncResPermission(item.key, item.title);
            funcResPermissionsub.OpPermissions.push(new OpPermission('Open', item.isChecked || item.isHalfChecked ? PermissionValue.Permitted : PermissionValue.Invisible));
            // this.AddOperation(funcResPermissionsub);
            funcResPermissionwqd.SubFuncResPermissions.push(funcResPermissionsub);
            if (!item.isLeaf) {
                this.AddPermission(funcResPermissionsub, item.children);
            }
        });
    }

    SettingPermission(funcResPermissionwqd: any) {//FuncResPermission
        funcResPermissionwqd.forEach(item => {
            if(item.OpPermissions){
                item.OpPermissions.forEach(ite => {
                    if(ite.Name === 'Open' && ite.Permission === 'Permitted' && (item.SubFuncResPermissions.length == 0)){
                        this.checkedKeys.push(item.Id);
                    }
                })
            }
            if (item.SubFuncResPermissions.length>0) {
                this.SettingPermission(item.SubFuncResPermissions);
            }
        });
    }

    AddOperation(funcResPermissionsub: FuncResPermission) {
        const operations: string[] =['新增' , '修改' , '删除'];
        operations.forEach(item => {
            funcResPermissionsub.OpPermissions.push(new OpPermission(item, PermissionValue.Permitted));
        });
    }

    handleCancel(e) {
        this.modal.destroy();
    }

    _submitForm() {
        for (const i in this.roleOperForm.controls) {
            this.roleOperForm.controls[ i ].markAsDirty();
        }
    }

    getFormControl(name) {
        return this.roleOperForm.controls[ name ];
    }

    // ----------------------------------------------------
    checkedKeys = [];
    // selectedKeys = [ '10001', '100011' ];
    expandDefault = true;


    checkOptionsOne = [
        // { label: '新增',  value: 'Add',     checked: true },
        // { label: '修改',  value: 'Update' , checked: true },
        // { label: '删除',  value: 'Delete' , checked: true },
        // { label: '上传',  value: 'Upload' , checked: true },
        // { label: '点击',  value: 'Click' , checked: true },
    ];
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        // console.log(444, event.node.origin.icon);
        // event.node.isChecked = true;
        switch(event.node.key) {
            case '1001':
                this.checkOptionsOne = [
                    { label: '新增',  value: 'Add', checked: true },
                    { label: '上传',  value: 'Upload' , checked: true },
                    { label: '点击',  value: 'Click' , checked: true },
                ];
                break;
            case '1002':
                this.checkOptionsOne = [
                    { label: '修改',  value: 'Update' , checked: true },
                    { label: '删除',  value: 'Delete' , checked: true },
                ];
                break;
            case '1003':
                this.checkOptionsOne = [
                    { label: '审批',  value: 'Apply' , checked: true },
                    { label: '撤回',  value: 'cancel' , checked: true },
                ];
                break;
            default:
                this.checkOptionsOne = [];
        }
    }
}

