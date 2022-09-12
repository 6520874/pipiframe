
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/common/EventManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e1b5ewyNbRHAaWWNlvuupwY', 'EventManager');
// Script/common/EventManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManager = /** @class */ (function () {
    function EventManager() {
        this._eventListeners = {};
    }
    EventManager.getInstance = function () {
        if (!this.instance) {
            this.instance = new EventManager();
        }
        return this.instance;
    };
    EventManager.destroy = function () {
        if (this.instance) {
            this.instance = null;
        }
    };
    EventManager.prototype.getEventListenersIndex = function (eventName, callBack, target) {
        var index = -1;
        for (var i = 0; i < this._eventListeners[eventName].length; i++) {
            var iterator = this._eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    };
    EventManager.prototype.addEventListener = function (eventName, callBack, target) {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }
        if (null == callBack) {
            cc.log('addEventListener callBack is nil');
            return false;
        }
        var callTarget = { callBack: callBack, target: target };
        if (null == this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [callTarget];
        }
        else {
            var index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 == index) {
                this._eventListeners[eventName].push(callTarget);
            }
        }
        return true;
    };
    EventManager.prototype.setEventListener = function (eventName, callBack, target) {
        if (!eventName) {
            cc.warn("eventName is empty" + eventName);
            return;
        }
        if (null == callBack) {
            cc.log('setEventListener callBack is nil');
            return false;
        }
        var callTarget = { callBack: callBack, target: target };
        this._eventListeners[eventName] = [callTarget];
        return true;
    };
    EventManager.prototype.removeEventListener = function (eventName, callBack, target) {
        if (null != this._eventListeners[eventName]) {
            var index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 != index) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }
    };
    EventManager.prototype.raiseEvent = function (eventName, eventData) {
        console.log("==================== raiseEvent " + eventName + " begin | " + JSON.stringify(eventData));
        if (null != this._eventListeners[eventName]) {
            // 将所有回调提取出来，再调用，避免调用回调的时候操作了事件的删除
            var callbackList = [];
            for (var _i = 0, _a = this._eventListeners[eventName]; _i < _a.length; _i++) {
                var iterator = _a[_i];
                callbackList.push({ callBack: iterator.callBack, target: iterator.target });
            }
            for (var _b = 0, callbackList_1 = callbackList; _b < callbackList_1.length; _b++) {
                var iterator = callbackList_1[_b];
                iterator.callBack.call(iterator.target, eventName, eventData);
            }
        }
        console.log("==================== raiseEvent " + eventName + " end");
    };
    EventManager.instance = null;
    return EventManager;
}());
exports.EventManager = EventManager;
exports.EventMgr = EventManager.getInstance();

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvY29tbW9uL0V2ZW50TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQVlBO0lBZUk7UUFHUSxvQkFBZSxHQUF3QyxFQUFFLENBQUM7SUFGbEUsQ0FBQztJQWRhLHdCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFYSxvQkFBTyxHQUFyQjtRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztJQU9PLDZDQUFzQixHQUE5QixVQUErQixTQUFpQixFQUFFLFFBQThCLEVBQUUsTUFBWTtRQUMxRixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFFO2dCQUN6RSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU07YUFDVDtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELHVDQUFnQixHQUFoQixVQUFpQixTQUFpQixFQUFFLFFBQThCLEVBQUUsTUFBWTtRQUM1RSxJQUFJLENBQUMs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WSxFQUFaLElBQVksRUFBRTtnQkFBaEMsSUFBTSxRQUFRLHFCQUFBO2dCQUNmLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ2pFO1NBQ0o7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFtQyxTQUFTLFNBQU0sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUE1RmMscUJBQVEsR0FBaUIsSUFBSSxDQUFDO0lBNkZqRCxtQkFBQztDQTlGRCxBQThGQyxJQUFBO0FBOUZZLG9DQUFZO0FBZ0dkLFFBQUEsUUFBUSxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qICAg5LqL5Lu2566h55CG5Zmo77yM5LqL5Lu255qE55uR5ZCs44CB6Kem5Y+R44CB56e76ZmkXG4qICAgXG4qICAgMjAxOC05LTIwIGJ5IOWuneeIt1xuKi9cbmV4cG9ydCB0eXBlIEV2ZW50TWFuYWdlckNhbGxGdW5jID0gKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudERhdGE6IGFueSkgPT4gdm9pZDtcblxuaW50ZXJmYWNlIENhbGxCYWNrVGFyZ2V0IHtcbiAgICBjYWxsQmFjazogRXZlbnRNYW5hZ2VyQ2FsbEZ1bmMsXG4gICAgdGFyZ2V0OiBhbnksXG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBFdmVudE1hbmFnZXIgPSBudWxsO1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRXZlbnRNYW5hZ2VyIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlID0gbmV3IEV2ZW50TWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9ldmVudExpc3RlbmVyczogeyBba2V5OiBzdHJpbmddOiBDYWxsQmFja1RhcmdldFtdIH0gPSB7fTtcblxuICAgIHByaXZhdGUgZ2V0RXZlbnRMaXN0ZW5lcnNJbmRleChldmVudE5hbWU6IHN0cmluZywgY2FsbEJhY2s6IEV2ZW50TWFuYWdlckNhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaXRlcmF0b3IgPSB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGxCYWNrID09IGNhbGxCYWNrICYmICghdGFyZ2V0IHx8IGl0ZXJhdG9yLnRhcmdldCA9PSB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICBhZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsQmFjazogRXZlbnRNYW5hZ2VyQ2FsbEZ1bmMsIHRhcmdldD86IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICAgICAgY2Mud2FybihcImV2ZW50TmFtZSBpcyBlbXB0eVwiICsgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudWxsID09IGNhbGxCYWNrKSB7XG4gICAgICAgICAgICBjYy5sb2coJ2FkZEV2ZW50TGlzdGVuZXIgY2FsbEJhY2sgaXMgbmlsJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNhbGxUYXJnZXQ6IENhbGxCYWNrVGFyZ2V0ID0geyBjYWxsQmFjazogY2FsbEJhY2ssIHRhcmdldDogdGFyZ2V0IH07XG4gICAgICAgIGlmIChudWxsID09IHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbY2FsbFRhcmdldF07XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0RXZlbnRMaXN0ZW5lcnNJbmRleChldmVudE5hbWUsIGNhbGxCYWNrLCB0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKC0xID09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGNhbGxUYXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc2V0RXZlbnRMaXN0ZW5lcihldmVudE5hbWU6IHN0cmluZywgY2FsbEJhY2s6IEV2ZW50TWFuYWdlckNhbGxGdW5jLCB0YXJnZXQ/OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFldmVudE5hbWUpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCJldmVudE5hbWUgaXMgZW1wdHlcIiArIGV2ZW50TmFtZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVsbCA9PSBjYWxsQmFjaykge1xuICAgICAgICAgICAgY2MubG9nKCdzZXRFdmVudExpc3RlbmVyIGNhbGxCYWNrIGlzIG5pbCcpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYWxsVGFyZ2V0OiBDYWxsQmFja1RhcmdldCA9IHsgY2FsbEJhY2s6IGNhbGxCYWNrLCB0YXJnZXQ6IHRhcmdldCB9O1xuICAgICAgICB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdID0gW2NhbGxUYXJnZXRdO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsQmFjazogRXZlbnRNYW5hZ2VyQ2FsbEZ1bmMsIHRhcmdldD86IGFueSkge1xuICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmdldEV2ZW50TGlzdGVuZXJzSW5kZXgoZXZlbnROYW1lLCBjYWxsQmFjaywgdGFyZ2V0KTtcbiAgICAgICAgICAgIGlmICgtMSAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhaXNlRXZlbnQoZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50RGF0YT86IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgPT09PT09PT09PT09PT09PT09PT0gcmFpc2VFdmVudCAke2V2ZW50TmFtZX0gYmVnaW4gfCAke0pTT04uc3RyaW5naWZ5KGV2ZW50RGF0YSl9YCk7XG4gICAgICAgIGlmIChudWxsICE9IHRoaXMuX2V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIC8vIOWwhuaJgOacieWbnuiwg+aPkOWPluWHuuadpe+8jOWGjeiwg+eUqO+8jOmBv+WFjeiwg+eUqOWbnuiwg+eahOaXtuWAmeaTjeS9nOS6huS6i+S7tueahOWIoOmZpFxuICAgICAgICAgICAgbGV0IGNhbGxiYWNrTGlzdDogQ2FsbEJhY2tUYXJnZXRbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiB0aGlzLl9ldmVudExpc3RlbmVyc1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tMaXN0LnB1c2goeyBjYWxsQmFjazogaXRlcmF0b3IuY2FsbEJhY2ssIHRhcmdldDogaXRlcmF0b3IudGFyZ2V0IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiBjYWxsYmFja0xpc3QpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsQmFjay5jYWxsKGl0ZXJhdG9yLnRhcmdldCwgZXZlbnROYW1lLCBldmVudERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGA9PT09PT09PT09PT09PT09PT09PSByYWlzZUV2ZW50ICR7ZXZlbnROYW1lfSBlbmRgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBsZXQgRXZlbnRNZ3IgPSBFdmVudE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTsiXX0=