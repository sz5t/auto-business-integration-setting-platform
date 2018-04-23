import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-role-operation',
  templateUrl: './role-operation.component.html',
})
export class RoleOperationComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private modal: NzModalRef
    ) { }

    roleOperForm: FormGroup;
    _data : any;
    _parentId: string;
    values: any[] ;

    @Input()
    set data(value: any) {
        this._data = value;
    }
    ngOnInit() {
        this.roleOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            AppPermission : [null],
            Remark     : [null],
            ShareScope     : [ 'Project']
        });
        if(this._data) {
            this.roleOperForm.controls['Name'].setValue(this._data.Name);
            this.roleOperForm.controls['AppPermission'].setValue(this._data.AppPermission);
            this.roleOperForm.controls['Remark'].setValue(this._data.Remark);
            this.roleOperForm.controls['ShareScope'].setValue(this._data.ShareScope);
        }
    }

    emitDataOutside() {
        if(!this.roleOperForm.valid)
            return;
        if(!this._data) this._data = {};
        this._data['Name'] =   this.roleOperForm.controls['Name'].value;
        this._data['AppPermission'] =  this.roleOperForm.controls['AppPermission'].value;
        this._data['Remark'] =  this.roleOperForm.controls['Remark'].value;
        this._data['ShareScope'] = this.roleOperForm.controls['ShareScope'].value;
        this.modal.destroy(this._data);
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
}

