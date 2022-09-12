
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/WebSock.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '70df2VbIU9B66Fr+op8FKJp', 'WebSock');
// Script/network/WebSock.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
*   WebSocket封装
*   1. 连接/断开相关接口
*   2. 网络异常回调
*   3. 数据发送与接收
*
*   2018-5-14 by 宝爷
*/
var WebSock = /** @class */ (function () {
    function WebSock() {
        this._ws = null; // websocket对象
        this.onConnected = null;
        this.onMessage = null;
        this.onError = null;
        this.onClosed = null;
    }
    WebSock.prototype.connect = function (options) {
        var _this = this;
        if (this._ws) {
            if (this._ws.readyState === WebSocket.CONNECTING) {
                console.log("websocket connecting, wait for a moment...");
                return false;
            }
        }
        var url = null;
        if (options.url) {
            url = options.url;
        }
        else {
            var ip = options.ip;
            var port = options.port;
            var protocol = options.protocol;
            url = protocol + "://" + ip + ":" + port;
        }
        this._ws = new WebSocket(url);
        this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
        this._ws.onmessage = function (event) {
            _this.onMessage(event.data);
        };
        this._ws.onopen = this.onConnected;
        this._ws.onerror = this.onError;
        this._ws.onclose = this.onClosed;
        return true;
    };
    WebSock.prototype.send = function (buffer) {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer);
            return true;
        }
        return false;
    };
    WebSock.prototype.close = function (code, reason) {
        this._ws.close(code, reason);
    };
    return WebSock;
}());
exports.WebSock = WebSock;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9XZWJTb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7RUFPRTtBQUVGO0lBQUE7UUFDWSxRQUFHLEdBQWMsSUFBSSxDQUFDLENBQWMsY0FBYztRQUUxRCxnQkFBVyxHQUFvQixJQUFJLENBQUM7UUFDcEMsY0FBUyxHQUFrQixJQUFJLENBQUM7UUFDaEMsWUFBTyxHQUFvQixJQUFJLENBQUM7UUFDaEMsYUFBUSxHQUFvQixJQUFJLENBQUM7SUEyQ3JDLENBQUM7SUF6Q0cseUJBQU8sR0FBUCxVQUFRLE9BQVk7UUFBcEIsaUJBMkJDO1FBMUJHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLFVBQVUsRUFBRTtnQkFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO2dCQUN6RCxPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2YsSUFBRyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ1osR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDckI7YUFBTTtZQUNILElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDcEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN4QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2hDLEdBQUcsR0FBTSxRQUFRLFdBQU0sRUFBRSxTQUFJLElBQU0sQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQzlFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQUMsS0FBSztZQUN2QixLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUM7UUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsc0JBQUksR0FBSixVQUFLLE1BQWU7UUFDaEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUN6QztZQUNJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsdUJBQUssR0FBTCxVQUFNLElBQWEsRUFBRSxNQUFlO1FBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0wsY0FBQztBQUFELENBakRBLEFBaURDLElBQUE7QUFqRFksMEJBQU8iLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJU29ja2V0LCBOZXREYXRhIH0gZnJvbSBcIi4vTmV0SW50ZXJmYWNlXCI7XG5cbi8qXG4qICAgV2ViU29ja2V05bCB6KOFXG4qICAgMS4g6L+e5o6lL+aWreW8gOebuOWFs+aOpeWPo1xuKiAgIDIuIOe9kee7nOW8guW4uOWbnuiwg1xuKiAgIDMuIOaVsOaNruWPkemAgeS4juaOpeaUtlxuKiAgIFxuKiAgIDIwMTgtNS0xNCBieSDlrp3niLdcbiovXG5cbmV4cG9ydCBjbGFzcyBXZWJTb2NrIGltcGxlbWVudHMgSVNvY2tldCB7XG4gICAgcHJpdmF0ZSBfd3M6IFdlYlNvY2tldCA9IG51bGw7ICAgICAgICAgICAgICAvLyB3ZWJzb2NrZXTlr7nosaFcblxuICAgIG9uQ29ubmVjdGVkOiAoZXZlbnQpID0+IHZvaWQgPSBudWxsO1xuICAgIG9uTWVzc2FnZTogKG1zZykgPT4gdm9pZCA9IG51bGw7XG4gICAgb25FcnJvcjogKGV2ZW50KSA9PiB2b2lkID0gbnVsbDtcbiAgICBvbkNsb3NlZDogKGV2ZW50KSA9PiB2b2lkID0gbnVsbDtcblxuICAgIGNvbm5lY3Qob3B0aW9uczogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLl93cykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3dzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5DT05ORUNUSU5HKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgY29ubmVjdGluZywgd2FpdCBmb3IgYSBtb21lbnQuLi5cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdXJsID0gbnVsbDtcbiAgICAgICAgaWYob3B0aW9ucy51cmwpIHtcbiAgICAgICAgICAgIHVybCA9IG9wdGlvbnMudXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGlwID0gb3B0aW9ucy5pcDtcbiAgICAgICAgICAgIGxldCBwb3J0ID0gb3B0aW9ucy5wb3J0O1xuICAgICAgICAgICAgbGV0IHByb3RvY29sID0gb3B0aW9ucy5wcm90b2NvbDtcbiAgICAgICAgICAgIHVybCA9IGAke3Byb3RvY29sfTovLyR7aXB9OiR7cG9ydH1gOyAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3dzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgICB0aGlzLl93cy5iaW5hcnlUeXBlID0gb3B0aW9ucy5iaW5hcnlUeXBlID8gb3B0aW9ucy5iaW5hcnlUeXBlIDogXCJhcnJheWJ1ZmZlclwiO1xuICAgICAgICB0aGlzLl93cy5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKGV2ZW50LmRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl93cy5vbm9wZW4gPSB0aGlzLm9uQ29ubmVjdGVkO1xuICAgICAgICB0aGlzLl93cy5vbmVycm9yID0gdGhpcy5vbkVycm9yO1xuICAgICAgICB0aGlzLl93cy5vbmNsb3NlID0gdGhpcy5vbkNsb3NlZDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc2VuZChidWZmZXI6IE5ldERhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dzLnJlYWR5U3RhdGUgPT0gV2ViU29ja2V0Lk9QRU4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3dzLnNlbmQoYnVmZmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjbG9zZShjb2RlPzogbnVtYmVyLCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fd3MuY2xvc2UoY29kZSwgcmVhc29uKTtcbiAgICB9XG59Il19