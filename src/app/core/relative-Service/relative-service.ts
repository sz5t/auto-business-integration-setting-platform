import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { RelationComponent } from '../../routes/data-v/relation/relation.component';

// region: common relative service
@Injectable()
export class RelativeService {
  private subject = new Subject<any>();

  sendMessage(messageType: any, messageData: any) {
    this.subject.next({ type: messageType, data: messageData });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
// endregion

@Injectable()
// region: global relative service
export class RelativeResolver {

  // 接收消息的组件
  private _viewId;
  // 临时关系对象
  private _tempParameter = {};
  // 事件列表
  //private _selfEvent = {};
  // 关系配置集合
  private _relations = [];
  // 组件引用
  private _reference;
  // 已注册接收消息的集合
  private _subscribeArr = [];
  // 消息对象
  //private subject = new Subject<any>();

  private _relativeService;

  set relations(value) {
    this._relations = value;
  }

  set reference(value) {
    this._reference = value;
  }

  set viewId(value) {
    this._viewId = value;
  }

  set relativeService (value) {
    this._relativeService = value;
  }
  
  /**
   * 关系配置解析
   * 1、
   */
  resolverRelation() {
    console.log('relation config',this._reference.config.viewId);
    this._relations && this._relations.forEach(relation => {
      relation.relationSendContent && relation.relationSendContent.forEach(sendContent => {
        this.setMessage(sendContent);
        if (sendContent.aop) {
          this._reference[sendContent.aop](this._reference, sendContent.name, (e) => {
            this._reference.selfEvent[sendContent.name].forEach(sendEvent => {
              if (sendEvent.isRegister) {
                let parent = {};
                sendEvent.data.params.forEach(param => {
                  parent[param['cid']] = e[0].node[param['pid']];
                });
                const receiver = {
                  name: sendContent.relationData.name,
                  receiver: sendEvent.receiver,
                  parent: parent
                };
                this._relativeService.sendMessage({ type: 'relation' }, receiver);
              }
            });
          });
        }
      });
      if (relation.relationReceiveContent) {
        const subMessage = this._relativeService.getMessage().subscribe(value => {
          console.log('get message', value, this._reference.config.viewId);
          switch (value.type.type) {
            case 'relation':
              if (value.data.receiver === this._reference.config.viewId) {
                this.receiveMessage(value.data);
              }
              break;
            case 'initParameters':
              if (value.data.receiver, this._reference.config.viewId) {
                this.receiveMessage(value.data);
              }
              break;
          }
        });
        if (subMessage) {
          this._subscribeArr.push(subMessage);
        }
      }
    });

  }

  setMessage(data) {
    if (data) {
      if (this._reference.selfEvent[data.name]) {
        this._reference.selfEvent[data.name].push(
          {
            isRegister: true,
            receiver: data.receiver,
            data: data.relationData
          }
        )
      }
    }
  }

  receiveMessage(data) {
    if (data) {
      switch (data.name) {
        case 'refreshAsChild':
          this.refreshAsChild(data.parent);
          break;
        case 'initParameters':
          this.initParameters(data.parent);
          break;
        case 'initComponentValue':
          this.initComponentValue(data.parent);
          break;
      }
    }
  }

  private refreshAsChild(parent) {
    for (let d in parent) {
      this._tempParameter[d] = parent[d];
    }
    // call load treeNode
  }

  private initParameters(data) {
    for (let d in data) {
      this._tempParameter[d] = data[d];
    }
    //call load treeNode
  }

  private initComponentValue(data) {
    for (let d in data) {
      this._tempParameter[d] = data[d];
    }

    //call load
  }

  unsubscribe() {
    if (this._subscribeArr.length > 0) {
      this._subscribeArr.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }

}
// endregion

