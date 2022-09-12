
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/network/NetInterface.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd9f8b+CV69FyKwnUdCjOtad', 'NetInterface');
// Script/network/NetInterface.ts

"use strict";
/*
*   网络相关接口定义
*
*   2019-10-8 by 宝爷
*/
Object.defineProperty(exports, "__esModule", { value: true });
// 默认字符串协议对象
var DefStringProtocol = /** @class */ (function () {
    function DefStringProtocol() {
    }
    DefStringProtocol.prototype.getHeadlen = function () {
        return 0;
    };
    DefStringProtocol.prototype.getHearbeat = function () {
        return "";
    };
    DefStringProtocol.prototype.getPackageLen = function (msg) {
        return msg.toString().length;
    };
    DefStringProtocol.prototype.checkPackage = function (msg) {
        return true;
    };
    DefStringProtocol.prototype.getPackageId = function (msg) {
        return 0;
    };
    return DefStringProtocol;
}());
exports.DefStringProtocol = DefStringProtocol;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvbmV0d29yay9OZXRJbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0VBSUU7O0FBMkJGLFlBQVk7QUFDWjtJQUFBO0lBaUJBLENBQUM7SUFoQkcsc0NBQVUsR0FBVjtRQUNJLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELHVDQUFXLEdBQVg7UUFDSSxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDRCx5Q0FBYSxHQUFiLFVBQWMsR0FBWTtRQUV0QixPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUNELHdDQUFZLEdBQVosVUFBYSxHQUFZO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCx3Q0FBWSxHQUFaLFVBQWEsR0FBWTtRQUNyQixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDTCx3QkFBQztBQUFELENBakJBLEFBaUJDLElBQUE7QUFqQlksOENBQWlCIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKlxuKiAgIOe9kee7nOebuOWFs+aOpeWPo+WumuS5iVxuKiAgIFxuKiAgIDIwMTktMTAtOCBieSDlrp3niLdcbiovXG5cbmV4cG9ydCB0eXBlIE5ldERhdGEgPSAoc3RyaW5nIHwgQXJyYXlCdWZmZXJMaWtlIHwgQmxvYiB8IEFycmF5QnVmZmVyVmlldyk7XG5leHBvcnQgdHlwZSBOZXRDYWxsRnVuYyA9IChjbWQ6IG51bWJlciwgZGF0YTogYW55KSA9PiB2b2lkO1xuXG4vLyDlm57osIPlr7nosaFcbmV4cG9ydCBpbnRlcmZhY2UgQ2FsbGJhY2tPYmplY3Qge1xuICAgIHRhcmdldDogYW55LCAgICAgICAgICAgICAgICAvLyDlm57osIPlr7nosaHvvIzkuI3kuLpudWxs5pe26LCD55SodGFyZ2V0LmNhbGxiYWNrKHh4eClcbiAgICBjYWxsYmFjazogTmV0Q2FsbEZ1bmMsICAgICAgLy8g5Zue6LCD5Ye95pWwXG59XG5cbi8vIOivt+axguWvueixoVxuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0T2JqZWN0IHtcbiAgICBidWZmZXI6IE5ldERhdGEsICAgICAgICAgICAgLy8g6K+35rGC55qEQnVmZmVyXG4gICAgcnNwQ21kOiBudW1iZXIsICAgICAgICAgICAgIC8vIOetieW+heWTjeW6lOaMh+S7pFxuICAgIHJzcE9iamVjdDogQ2FsbGJhY2tPYmplY3QsICAvLyDnrYnlvoXlk43lupTnmoTlm57osIPlr7nosaFcbn1cblxuLy8g5Y2P6K6u6L6F5Yqp5o6l5Y+jXG5leHBvcnQgaW50ZXJmYWNlIElQcm90b2NvbEhlbHBlciB7XG4gICAgZ2V0SGVhZGxlbigpOiBudW1iZXI7ICAgICAgICAgICAgICAgICAgIC8vIOi/lOWbnuWMheWktOmVv+W6plxuICAgIGdldEhlYXJiZWF0KCk6IE5ldERhdGE7ICAgICAgICAgICAgICAgICAvLyDov5Tlm57kuIDkuKrlv4Pot7PljIVcbiAgICBnZXRQYWNrYWdlTGVuKG1zZzogTmV0RGF0YSk6IG51bWJlcjsgICAgLy8g6L+U5Zue5pW05Liq5YyF55qE6ZW/5bqmXG4gICAgY2hlY2tQYWNrYWdlKG1zZzogTmV0RGF0YSk6IGJvb2xlYW47ICAgIC8vIOajgOafpeWMheaVsOaNruaYr+WQpuWQiOazlVxuICAgIGdldFBhY2thZ2VJZChtc2c6IE5ldERhdGEpOiBudW1iZXI7ICAgICAvLyDov5Tlm57ljIXnmoRpZOaIluWNj+iuruexu+Wei1xufVxuXG4vLyDpu5jorqTlrZfnrKbkuLLljY/orq7lr7nosaFcbmV4cG9ydCBjbGFzcyBEZWZTdHJpbmdQcm90b2NvbCBpbXBsZW1lbnRzIElQcm90b2NvbEhlbHBlciB7XG4gICAgZ2V0SGVhZGxlbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZ2V0SGVhcmJlYXQoKTogTmV0RGF0YSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBnZXRQYWNrYWdlTGVuKG1zZzogTmV0RGF0YSk6IG51bWJlclxuICAgIHtcbiAgICAgICAgcmV0dXJuIG1zZy50b1N0cmluZygpLmxlbmd0aDtcbiAgICB9XG4gICAgY2hlY2tQYWNrYWdlKG1zZzogTmV0RGF0YSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZ2V0UGFja2FnZUlkKG1zZzogTmV0RGF0YSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cblxuLy8gU29ja2V05o6l5Y+jXG5leHBvcnQgaW50ZXJmYWNlIElTb2NrZXQge1xuICAgIG9uQ29ubmVjdGVkOiAoZXZlbnQpID0+IHZvaWQ7ICAgICAgICAgICAvLyDov57mjqXlm57osINcbiAgICBvbk1lc3NhZ2U6IChtc2c6IE5ldERhdGEpID0+IHZvaWQ7ICAgICAgLy8g5raI5oGv5Zue6LCDXG4gICAgb25FcnJvcjogKGV2ZW50KSA9PiB2b2lkOyAgICAgICAgICAgICAgIC8vIOmUmeivr+Wbnuiwg1xuICAgIG9uQ2xvc2VkOiAoZXZlbnQpID0+IHZvaWQ7ICAgICAgICAgICAgICAvLyDlhbPpl63lm57osINcbiAgICBcbiAgICBjb25uZWN0KG9wdGlvbnM6IGFueSk7ICAgICAgICAgICAgICAgICAgLy8g6L+e5o6l5o6l5Y+jXG4gICAgc2VuZChidWZmZXI6IE5ldERhdGEpOyAgICAgICAgICAgICAgICAgIC8vIOaVsOaNruWPkemAgeaOpeWPo1xuICAgIGNsb3NlKGNvZGU/OiBudW1iZXIsIHJlYXNvbj86IHN0cmluZyk7ICAvLyDlhbPpl63mjqXlj6Ncbn1cblxuLy8g572R57uc5o+Q56S65o6l5Y+jXG5leHBvcnQgaW50ZXJmYWNlIElOZXR3b3JrVGlwcyB7XG4gICAgY29ubmVjdFRpcHMoaXNTaG93OiBib29sZWFuKTogdm9pZDtcbiAgICByZWNvbm5lY3RUaXBzKGlzU2hvdzogYm9vbGVhbik6IHZvaWQ7XG4gICAgcmVxdWVzdFRpcHMoaXNTaG93OiBib29sZWFuKTogdm9pZDtcbn1cbiJdfQ==