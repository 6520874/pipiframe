
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/example/NetExample.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '55d23dNa9JDRafcCFqeXFVH', 'NetExample');
// Script/example/NetExample.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSock_1 = require("../network/WebSock");
var NetManager_1 = require("../network/NetManager");
var NetNode_1 = require("../network/NetNode");
var NetInterface_1 = require("../network/NetInterface");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NetTips = /** @class */ (function () {
    function NetTips() {
    }
    NetTips.prototype.getLabel = function () {
        var label = null;
        var node = cc.director.getScene().getChildByName("@net_tip_label");
        if (node) {
            label = node.getComponent(cc.Label);
        }
        else {
            node = new cc.Node("@net_tip_label");
            label = node.addComponent(cc.Label);
            node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        }
        return label;
    };
    NetTips.prototype.connectTips = function (isShow) {
        if (isShow) {
            this.getLabel().string = "Connecting";
            this.getLabel().node.active = true;
        }
        else {
            this.getLabel().node.active = false;
        }
    };
    NetTips.prototype.reconnectTips = function (isShow) {
        if (isShow) {
            this.getLabel().string = "Reconnecting";
            this.getLabel().node.active = true;
        }
        else {
            this.getLabel().node.active = false;
        }
    };
    NetTips.prototype.requestTips = function (isShow) {
        if (isShow) {
            this.getLabel().string = "Requesting";
            this.getLabel().node.active = true;
        }
        else {
            this.getLabel().node.active = false;
        }
    };
    return NetTips;
}());
var NetExample = /** @class */ (function (_super) {
    __extends(NetExample, _super);
    function NetExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textLabel = null;
        _this.urlLabel = null;
        _this.msgLabel = null;
        _this.lineCount = 0;
        return _this;
        // update (dt) {}
    }
    NetExample.prototype.onLoad = function () {
        var _this = this;
        var Node = new NetNode_1.NetNode();
        Node.init(new WebSock_1.WebSock(), new NetInterface_1.DefStringProtocol(), new NetTips());
        Node.setResponeHandler(0, function (cmd, data) {
            if (_this.lineCount > 5) {
                var idx = _this.msgLabel.string.search("\n");
                _this.msgLabel.string = _this.msgLabel.string.substr(idx + 1);
            }
            _this.msgLabel.string += data + "\n";
            ++_this.lineCount;
        });
        NetManager_1.NetManager.getInstance().setNetNode(Node);
    };
    NetExample.prototype.onConnectClick = function () {
        NetManager_1.NetManager.getInstance().connect({ url: this.urlLabel.string });
    };
    NetExample.prototype.onSendClick = function () {
        NetManager_1.NetManager.getInstance().send(this.textLabel.string);
    };
    NetExample.prototype.onDisconnectClick = function () {
        NetManager_1.NetManager.getInstance().close();
    };
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "textLabel", void 0);
    __decorate([
        property(cc.Label)
    ], NetExample.prototype, "urlLabel", void 0);
    __decorate([
        property(cc.RichText)
    ], NetExample.prototype, "msgLabel", void 0);
    NetExample = __decorate([
        ccclass
    ], NetExample);
    return NetExample;
}(cc.Component));
exports.default = NetExample;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXhhbXBsZS9OZXRFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE2QztBQUM3QyxvREFBbUQ7QUFDbkQsOENBQTZDO0FBQzdDLHdEQUFtRjtBQUk3RSxJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRTVDO0lBQUE7SUF3Q0EsQ0FBQztJQXZDVywwQkFBUSxHQUFoQjtRQUNJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ25FLElBQUksSUFBSSxFQUFFO1lBQ04sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELDZCQUFXLEdBQVgsVUFBWSxNQUFlO1FBQ3ZCLElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO2FBQU07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LENBQUMsUUFBUSxDQUFDO2dEQUNPO0lBTlosVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQW9DOUI7SUFBRCxpQkFBQztDQXBDRCxBQW9DQyxDQXBDdUMsRUFBRSxDQUFDLFNBQVMsR0FvQ25EO2tCQXBDb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdlYlNvY2sgfSBmcm9tIFwiLi4vbmV0d29yay9XZWJTb2NrXCI7XG5pbXBvcnQgeyBOZXRNYW5hZ2VyIH0gZnJvbSBcIi4uL25ldHdvcmsvTmV0TWFuYWdlclwiO1xuaW1wb3J0IHsgTmV0Tm9kZSB9IGZyb20gXCIuLi9uZXR3b3JrL05ldE5vZGVcIjtcbmltcG9ydCB7IERlZlN0cmluZ1Byb3RvY29sLCBOZXREYXRhLCBJTmV0d29ya1RpcHMgfSBmcm9tIFwiLi4vbmV0d29yay9OZXRJbnRlcmZhY2VcIjtcblxuXG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbmNsYXNzIE5ldFRpcHMgaW1wbGVtZW50cyBJTmV0d29ya1RpcHMge1xuICAgIHByaXZhdGUgZ2V0TGFiZWwoKTogY2MuTGFiZWwge1xuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBsZXQgbm9kZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJAbmV0X3RpcF9sYWJlbFwiKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZSA9IG5ldyBjYy5Ob2RlKFwiQG5ldF90aXBfbGFiZWxcIik7XG4gICAgICAgICAgICBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2Mud2luU2l6ZS53aWR0aCAvIDIsIGNjLndpblNpemUuaGVpZ2h0IC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgIH1cblxuICAgIGNvbm5lY3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoaXNTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkuc3RyaW5nID0gXCJDb25uZWN0aW5nXCI7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRMYWJlbCgpLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWNvbm5lY3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoaXNTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkuc3RyaW5nID0gXCJSZWNvbm5lY3RpbmdcIjtcbiAgICAgICAgICAgIHRoaXMuZ2V0TGFiZWwoKS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlcXVlc3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoaXNTaG93KSB7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkuc3RyaW5nID0gXCJSZXF1ZXN0aW5nXCI7XG4gICAgICAgICAgICB0aGlzLmdldExhYmVsKCkubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRMYWJlbCgpLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZXRFeGFtcGxlIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAgICBAcHJvcGVydHkoY2MuTGFiZWwpXG4gICAgdGV4dExhYmVsOiBjYy5MYWJlbCA9IG51bGw7XG4gICAgQHByb3BlcnR5KGNjLkxhYmVsKVxuICAgIHVybExhYmVsOiBjYy5MYWJlbCA9IG51bGw7XG4gICAgQHByb3BlcnR5KGNjLlJpY2hUZXh0KVxuICAgIG1zZ0xhYmVsOiBjYy5SaWNoVGV4dCA9IG51bGw7XG4gICAgcHJpdmF0ZSBsaW5lQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgICBvbkxvYWQoKSB7XG4gICAgICAgIGxldCBOb2RlID0gbmV3IE5ldE5vZGUoKTtcbiAgICAgICAgTm9kZS5pbml0KG5ldyBXZWJTb2NrKCksIG5ldyBEZWZTdHJpbmdQcm90b2NvbCgpLCBuZXcgTmV0VGlwcygpKTtcbiAgICAgICAgTm9kZS5zZXRSZXNwb25lSGFuZGxlcigwLCAoY21kOiBudW1iZXIsIGRhdGE6IE5ldERhdGEpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmVDb3VudCA+IDUpIHtcbiAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5tc2dMYWJlbC5zdHJpbmcuc2VhcmNoKFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubXNnTGFiZWwuc3RyaW5nID0gdGhpcy5tc2dMYWJlbC5zdHJpbmcuc3Vic3RyKGlkeCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tc2dMYWJlbC5zdHJpbmcgKz0gYCR7ZGF0YX1cXG5gO1xuICAgICAgICAgICAgKyt0aGlzLmxpbmVDb3VudDtcbiAgICAgICAgfSk7XG4gICAgICAgIE5ldE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZXROZXROb2RlKE5vZGUpO1xuICAgIH1cblxuICAgIG9uQ29ubmVjdENsaWNrKCkge1xuICAgICAgICBOZXRNYW5hZ2VyLmdldEluc3RhbmNlKCkuY29ubmVjdCh7IHVybDogdGhpcy51cmxMYWJlbC5zdHJpbmcgfSk7XG4gICAgfVxuXG4gICAgb25TZW5kQ2xpY2soKSB7XG4gICAgICAgIE5ldE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5zZW5kKHRoaXMudGV4dExhYmVsLnN0cmluZyk7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0Q2xpY2soKSB7XG4gICAgICAgIE5ldE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9XG59XG4iXX0=