"use strict";
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