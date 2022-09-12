"use strict";
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