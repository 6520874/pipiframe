
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/NetManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd8cd5el6GBGTYTW+N8b8EuJ', 'NetManager');
// Script/network/NetManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
*   网络节点管理类
*
*   2019-10-8 by 宝爷
*/
var NetManager = /** @class */ (function () {
    function NetManager() {
        this._channels = {};
    }
    NetManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new NetManager();
        }
        return this._instance;
    };
    // 添加Node，返回ChannelID
    NetManager.prototype.setNetNode = function (newNode, channelId) {
        if (channelId === void 0) { channelId = 0; }
        this._channels[channelId] = newNode;
    };
    // 移除Node
    NetManager.prototype.removeNetNode = function (channelId) {
        delete this._channels[channelId];
    };
    // 调用Node连接
    NetManager.prototype.connect = function (options, channelId) {
        if (channelId === void 0) { channelId = 0; }
        if (this._channels[channelId]) {
            return this._channels[channelId].connect(options);
        }
        return false;
    };
    // 调用Node发送
    NetManager.prototype.send = function (buf, force, channelId) {
        if (force === void 0) { force = false; }
        if (channelId === void 0) { channelId = 0; }
        var node = this._channels[channelId];
        if (node) {
            return node.send(buf, force);
        }
        return false;
    };
    // 发起请求，并在在结果返回时调用指定好的回调函数
    NetManager.prototype.request = function (buf, rspCmd, rspObject, showTips, force, channelId) {
        if (showTips === void 0) { showTips = true; }
        if (force === void 0) { force = false; }
        if (channelId === void 0) { channelId = 0; }
        var node = this._channels[channelId];
        if (node) {
            node.request(buf, rspCmd, rspObject, showTips, force);
        }
    };
    // 同request，但在request之前会先判断队列中是否已有rspCmd，如有重复的则直接返回
    NetManager.prototype.requestUnique = function (buf, rspCmd, rspObject, showTips, force, channelId) {
        if (showTips === void 0) { showTips = true; }
        if (force === void 0) { force = false; }
        if (channelId === void 0) { channelId = 0; }
        var node = this._channels[channelId];
        if (node) {
            return node.requestUnique(buf, rspCmd, rspObject, showTips, force);
        }
        return false;
    };
    // 调用Node关闭
    NetManager.prototype.close = function (code, reason, channelId) {
        if (channelId === void 0) { channelId = 0; }
        if (this._channels[channelId]) {
            return this._channels[channelId].closeSocket(code, reason);
        }
    };
    NetManager._instance = null;
    return NetManager;
}());
exports.NetManager = NetManager;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9OZXRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7RUFJRTtBQUVGO0lBQUE7UUFFYyxjQUFTLEdBQStCLEVBQUUsQ0FBQztJQTJEekQsQ0FBQztJQXpEaUIsc0JBQVcsR0FBekI7UUFDSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUNyQztRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQscUJBQXFCO0lBQ2QsK0JBQVUsR0FBakIsVUFBa0IsT0FBZ0IsRUFBRSxTQUFxQjtRQUFyQiwwQkFBQSxFQUFBLGFBQXFCO1FBQ3JELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxTQUFTO0lBQ0Ysa0NBQWEsR0FBcEIsVUFBcUIsU0FBaUI7UUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxXQUFXO0lBQ0osNEJBQU8sR0FBZCxVQUFlLE9BQTBCLEVBQUUsU0FBcUI7UUFBckIsMEJBQUEsRUFBQSxhQUFxQjtRQUM1RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxXQUFXO0lBQ0oseUJBQUksR0FBWCxVQUFZLEdBQVksRUFBRSxLQUFzQixFQUFFLFNBQXFCO1FBQTdDLHNCQUFBLEVBQUEsYUFBc0I7UUFBRSwwQkFBQSxFQUFBLGFBQXFCO1FBQ25FLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsSUFBRyxJQUFJLEVBQUU7WUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELDBCQUEwQjtJQUNuQiw0QkFBTyxHQUFkLFVBQWUsR0FBWSxFQUFFLE1BQWMsRUFBRSxTQUF5QixFQUFFLFFBQXdCLEVBQUUsS0FBc0IsRUFBRSxTQUFxQjtRQUF2RSx5QkFBQSxFQUFBLGVBQXdCO1FBQUUsc0JBQUEsRUFBQSxhQUFzQjtRQUFFLDBCQUFBLEVBQUEsYUFBcUI7UUFDM0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFHLElBQUksRUFBRTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQztJQUVELG1EQUFtRDtJQUM1QyxrQ0FBYSxHQUFwQixVQUFxQixHQUFZLEVBQUUsTUFBYyxFQUFFLFNBQXlCLEVBQUUsUUFBd0IsRUFBRSxLQUFzQixFQUFFLFNBQXFCO1FBQXZFLHlCQUFBLEVBQUEsZUFBd0I7UUFBRSxzQkFBQSxFQUFBLGFBQXNCO1FBQUUsMEJBQUEsRUFBQSxhQUFxQjtRQUNqSixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLElBQUcsSUFBSSxFQUFFO1lBQ0wsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RTtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxXQUFXO0lBQ0osMEJBQUssR0FBWixVQUFhLElBQWEsRUFBRSxNQUFlLEVBQUUsU0FBcUI7UUFBckIsMEJBQUEsRUFBQSxhQUFxQjtRQUM5RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDOUQ7SUFDTCxDQUFDO0lBM0RjLG9CQUFTLEdBQWUsSUFBSSxDQUFDO0lBNERoRCxpQkFBQztDQTdERCxBQTZEQyxJQUFBO0FBN0RZLGdDQUFVIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV0Tm9kZSwgTmV0Q29ubmVjdE9wdGlvbnMgfSBmcm9tIFwiLi9OZXROb2RlXCI7XG5pbXBvcnQgeyBOZXREYXRhLCBDYWxsYmFja09iamVjdCB9IGZyb20gXCIuL05ldEludGVyZmFjZVwiO1xuXG4vKlxuKiAgIOe9kee7nOiKgueCueeuoeeQhuexu1xuKlxuKiAgIDIwMTktMTAtOCBieSDlrp3niLdcbiovXG5cbmV4cG9ydCBjbGFzcyBOZXRNYW5hZ2VyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IE5ldE1hbmFnZXIgPSBudWxsO1xuICAgIHByb3RlY3RlZCBfY2hhbm5lbHM6IHsgW2tleTogbnVtYmVyXTogTmV0Tm9kZSB9ID0ge307XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IE5ldE1hbmFnZXIge1xuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgTmV0TWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyDmt7vliqBOb2Rl77yM6L+U5ZueQ2hhbm5lbElEXG4gICAgcHVibGljIHNldE5ldE5vZGUobmV3Tm9kZTogTmV0Tm9kZSwgY2hhbm5lbElkOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxJZF0gPSBuZXdOb2RlO1xuICAgIH1cblxuICAgIC8vIOenu+mZpE5vZGVcbiAgICBwdWJsaWMgcmVtb3ZlTmV0Tm9kZShjaGFubmVsSWQ6IG51bWJlcikge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbElkXTtcbiAgICB9XG5cbiAgICAvLyDosIPnlKhOb2Rl6L+e5o6lXG4gICAgcHVibGljIGNvbm5lY3Qob3B0aW9uczogTmV0Q29ubmVjdE9wdGlvbnMsIGNoYW5uZWxJZDogbnVtYmVyID0gMCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbElkXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxJZF0uY29ubmVjdChvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g6LCD55SoTm9kZeWPkemAgVxuICAgIHB1YmxpYyBzZW5kKGJ1ZjogTmV0RGF0YSwgZm9yY2U6IGJvb2xlYW4gPSBmYWxzZSwgY2hhbm5lbElkOiBudW1iZXIgPSAwKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbElkXTtcbiAgICAgICAgaWYobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc2VuZChidWYsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g5Y+R6LW36K+35rGC77yM5bm25Zyo5Zyo57uT5p6c6L+U5Zue5pe26LCD55So5oyH5a6a5aW955qE5Zue6LCD5Ye95pWwXG4gICAgcHVibGljIHJlcXVlc3QoYnVmOiBOZXREYXRhLCByc3BDbWQ6IG51bWJlciwgcnNwT2JqZWN0OiBDYWxsYmFja09iamVjdCwgc2hvd1RpcHM6IGJvb2xlYW4gPSB0cnVlLCBmb3JjZTogYm9vbGVhbiA9IGZhbHNlLCBjaGFubmVsSWQ6IG51bWJlciA9IDApIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsSWRdO1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBub2RlLnJlcXVlc3QoYnVmLCByc3BDbWQsIHJzcE9iamVjdCwgc2hvd1RpcHMsIGZvcmNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWQjHJlcXVlc3TvvIzkvYblnKhyZXF1ZXN05LmL5YmN5Lya5YWI5Yik5pat6Zif5YiX5Lit5piv5ZCm5bey5pyJcnNwQ21k77yM5aaC5pyJ6YeN5aSN55qE5YiZ55u05o6l6L+U5ZueXG4gICAgcHVibGljIHJlcXVlc3RVbmlxdWUoYnVmOiBOZXREYXRhLCByc3BDbWQ6IG51bWJlciwgcnNwT2JqZWN0OiBDYWxsYmFja09iamVjdCwgc2hvd1RpcHM6IGJvb2xlYW4gPSB0cnVlLCBmb3JjZTogYm9vbGVhbiA9IGZhbHNlLCBjaGFubmVsSWQ6IG51bWJlciA9IDApOiBib29sZWFuIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsSWRdO1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5yZXF1ZXN0VW5pcXVlKGJ1ZiwgcnNwQ21kLCByc3BPYmplY3QsIHNob3dUaXBzLCBmb3JjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIOiwg+eUqE5vZGXlhbPpl61cbiAgICBwdWJsaWMgY2xvc2UoY29kZT86IG51bWJlciwgcmVhc29uPzogc3RyaW5nLCBjaGFubmVsSWQ6IG51bWJlciA9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxJZF0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsSWRdLmNsb3NlU29ja2V0KGNvZGUsIHJlYXNvbik7XG4gICAgICAgIH1cbiAgICB9XG59Il19