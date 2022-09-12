
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ui/UIView.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '743a8DSuqhBr4IQgN4a26Ii', 'UIView');
// Script/ui/UIView.ts

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
var ResKeeper_1 = require("../res/ResKeeper");
/**
 * UIView界面基础类
 *
 * 1. 快速关闭与屏蔽点击的选项配置
 * 2. 界面缓存设置（开启后界面关闭不会被释放，以便下次快速打开）
 * 3. 界面显示类型配置
 *
 * 4. 加载资源接口（随界面释放自动释放），this.loadRes(xxx)
 * 5. 由UIManager释放
 *
 * 5. 界面初始化回调（只调用一次）
 * 6. 界面打开回调（每次打开回调）
 * 7. 界面打开动画播放结束回调（动画播放完回调）
 * 8. 界面关闭回调
 * 9. 界面置顶回调
 *
 * 2018-8-28 by 宝爷
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/** 界面展示类型 */
var UIShowTypes;
(function (UIShowTypes) {
    UIShowTypes[UIShowTypes["UIFullScreen"] = 0] = "UIFullScreen";
    UIShowTypes[UIShowTypes["UIAddition"] = 1] = "UIAddition";
    UIShowTypes[UIShowTypes["UISingle"] = 2] = "UISingle";
})(UIShowTypes = exports.UIShowTypes || (exports.UIShowTypes = {}));
;
var UIView = /** @class */ (function (_super) {
    __extends(UIView, _super);
    function UIView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 快速关闭 */
        _this.quickClose = false;
        /** 屏蔽点击选项 在UIConf设置屏蔽点击*/
        // @property
        // preventTouch: boolean = true;
        /** 缓存选项 */
        _this.cache = false;
        /** 界面显示类型 */
        _this.showType = UIShowTypes.UISingle;
        /** 界面id */
        _this.UIid = 0;
        return _this;
    }
    /********************** UI的回调 ***********************/
    /**
     * 当界面被创建时回调，生命周期内只调用
     * @param args 可变参数
     */
    UIView.prototype.init = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    /**
     * 当界面被打开时回调，每次调用Open时回调
     * @param fromUI 从哪个UI打开的
     * @param args 可变参数
     */
    UIView.prototype.onOpen = function (fromUI) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    /**
     * 每次界面Open动画播放完毕时回调
     */
    UIView.prototype.onOpenAniOver = function () {
    };
    /**
     * 当界面被关闭时回调，每次调用Close时回调
     * 返回值会传递给下一个界面
     */
    UIView.prototype.onClose = function () {
    };
    /**
     * 当界面被置顶时回调，Open时并不会回调该函数
     * @param preID 前一个ui
     * @param args 可变参数，
     */
    UIView.prototype.onTop = function (preID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    /**  静态变量，用于区分相同界面的不同实例 */
    UIView.uiIndex = 0;
    __decorate([
        property
    ], UIView.prototype, "quickClose", void 0);
    __decorate([
        property
    ], UIView.prototype, "cache", void 0);
    __decorate([
        property({ type: cc.Enum(UIShowTypes) })
    ], UIView.prototype, "showType", void 0);
    UIView = __decorate([
        ccclass
    ], UIView);
    return UIView;
}(ResKeeper_1.ResKeeper));
exports.UIView = UIView;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvdWkvVUlWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE2QztBQUU3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFFRyxJQUFBLGtCQUFxQyxFQUFuQyxvQkFBTyxFQUFFLHNCQUEwQixDQUFDO0FBRTVDLGFBQWE7QUFDYixJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDbkIsNkRBQVksQ0FBQTtJQUNaLHlEQUFVLENBQUE7SUFDVixxREFBUSxDQUFBO0FBQ1osQ0FBQyxFQUpXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBSXRCO0FBQUEsQ0FBQztBQUdGO0lBQTRCLDBCQUFTO0lBRHJDO1FBQUEscUVBNkRDO1FBMURHLFdBQVc7UUFFWCxnQkFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QiwwQkFBMEI7UUFDMUIsWUFBWTtRQUNaLGdDQUFnQztRQUNoQyxXQUFXO1FBRVgsV0FBSyxHQUFZLEtBQUssQ0FBQztRQUN2QixhQUFhO1FBRWIsY0FBUSxHQUFnQixXQUFXLENBQUMsUUFBUSxDQUFDO1FBRTdDLFdBQVc7UUFDSixVQUFJLEdBQVcsQ0FBQyxDQUFDOztJQTRDNUIsQ0FBQztJQXhDRyxzREFBc0Q7SUFDdEQ7OztPQUdHO0lBQ0kscUJBQUksR0FBWDtRQUFZLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O0lBRW5CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksdUJBQU0sR0FBYixVQUFjLE1BQWM7UUFBRSxjQUFPO2FBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztZQUFQLDZCQUFPOztJQUVyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4QkFBYSxHQUFwQjtJQUNBLENBQUM7SUFFRDs7O09BR0c7SUFDSSx3QkFBTyxHQUFkO0lBRUEsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxzQkFBSyxHQUFaLFVBQWEsS0FBYTtRQUFFLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAsNkJBQU87O0lBRW5DLENBQUM7SUExQ0QsMEJBQTBCO0lBQ1gsY0FBTyxHQUFXLENBQUMsQ0FBQztJQWRuQztRQURDLFFBQVE7OENBQ21CO0lBTTVCO1FBREMsUUFBUTt5Q0FDYztJQUd2QjtRQURDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7NENBQ0k7SUFicEMsTUFBTTtRQURsQixPQUFPO09BQ0ssTUFBTSxDQTREbEI7SUFBRCxhQUFDO0NBNURELEFBNERDLENBNUQyQixxQkFBUyxHQTREcEM7QUE1RFksd0JBQU0iLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNLZWVwZXIgfSBmcm9tIFwiLi4vcmVzL1Jlc0tlZXBlclwiO1xyXG5cclxuLyoqXHJcbiAqIFVJVmlld+eVjOmdouWfuuehgOexu1xyXG4gKiBcclxuICogMS4g5b+r6YCf5YWz6Zet5LiO5bGP6JS954K55Ye755qE6YCJ6aG56YWN572uXHJcbiAqIDIuIOeVjOmdoue8k+WtmOiuvue9ru+8iOW8gOWQr+WQjueVjOmdouWFs+mXreS4jeS8muiiq+mHiuaUvu+8jOS7peS+v+S4i+asoeW/q+mAn+aJk+W8gO+8iVxyXG4gKiAzLiDnlYzpnaLmmL7npLrnsbvlnovphY3nva5cclxuICogXHJcbiAqIDQuIOWKoOi9vei1hOa6kOaOpeWPo++8iOmaj+eVjOmdoumHiuaUvuiHquWKqOmHiuaUvu+8ie+8jHRoaXMubG9hZFJlcyh4eHgpXHJcbiAqIDUuIOeUsVVJTWFuYWdlcumHiuaUvlxyXG4gKiBcclxuICogNS4g55WM6Z2i5Yid5aeL5YyW5Zue6LCD77yI5Y+q6LCD55So5LiA5qyh77yJXHJcbiAqIDYuIOeVjOmdouaJk+W8gOWbnuiwg++8iOavj+asoeaJk+W8gOWbnuiwg++8iVxyXG4gKiA3LiDnlYzpnaLmiZPlvIDliqjnlLvmkq3mlL7nu5PmnZ/lm57osIPvvIjliqjnlLvmkq3mlL7lrozlm57osIPvvIlcclxuICogOC4g55WM6Z2i5YWz6Zet5Zue6LCDXHJcbiAqIDkuIOeVjOmdoue9rumhtuWbnuiwg1xyXG4gKiBcclxuICogMjAxOC04LTI4IGJ5IOWuneeIt1xyXG4gKi9cclxuXHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG4vKiog55WM6Z2i5bGV56S657G75Z6LICovXHJcbmV4cG9ydCBlbnVtIFVJU2hvd1R5cGVzIHtcclxuICAgIFVJRnVsbFNjcmVlbiwgICAgICAgLy8g5YWo5bGP5pi+56S677yM5YWo5bGP55WM6Z2i5L2/55So6K+l6YCJ6aG55Y+v6I635b6X5pu06auY5oCn6IO9XHJcbiAgICBVSUFkZGl0aW9uLCAgICAgICAgIC8vIOWPoOWKoOaYvuekuu+8jOaAp+iDvei+g+W3rlxyXG4gICAgVUlTaW5nbGUsICAgICAgICAgICAvLyDljZXnlYzpnaLmmL7npLrvvIzlj6rmmL7npLrlvZPliY3nlYzpnaLlkozog4zmma/nlYzpnaLvvIzmgKfog73ovoPlpb1cclxufTtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBjbGFzcyBVSVZpZXcgZXh0ZW5kcyBSZXNLZWVwZXIge1xyXG5cclxuICAgIC8qKiDlv6vpgJ/lhbPpl60gKi9cclxuICAgIEBwcm9wZXJ0eVxyXG4gICAgcXVpY2tDbG9zZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqIOWxj+iUveeCueWHu+mAiemhuSDlnKhVSUNvbmborr7nva7lsY/olL3ngrnlh7sqL1xyXG4gICAgLy8gQHByb3BlcnR5XHJcbiAgICAvLyBwcmV2ZW50VG91Y2g6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLyoqIOe8k+WtmOmAiemhuSAqL1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICBjYWNoZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqIOeVjOmdouaYvuekuuexu+WeiyAqL1xyXG4gICAgQHByb3BlcnR5KHsgdHlwZTogY2MuRW51bShVSVNob3dUeXBlcykgfSlcclxuICAgIHNob3dUeXBlOiBVSVNob3dUeXBlcyA9IFVJU2hvd1R5cGVzLlVJU2luZ2xlO1xyXG5cclxuICAgIC8qKiDnlYzpnaJpZCAqL1xyXG4gICAgcHVibGljIFVJaWQ6IG51bWJlciA9IDA7XHJcbiAgICAvKiogIOmdmeaAgeWPmOmHj++8jOeUqOS6juWMuuWIhuebuOWQjOeVjOmdoueahOS4jeWQjOWunuS+iyAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdWlJbmRleDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKiBVSeeahOWbnuiwgyAqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKlxyXG4gICAgICog5b2T55WM6Z2i6KKr5Yib5bu65pe25Zue6LCD77yM55Sf5ZG95ZGo5pyf5YaF5Y+q6LCD55SoXHJcbiAgICAgKiBAcGFyYW0gYXJncyDlj6/lj5jlj4LmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXQoLi4uYXJncyk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+eVjOmdouiiq+aJk+W8gOaXtuWbnuiwg++8jOavj+asoeiwg+eUqE9wZW7ml7blm57osINcclxuICAgICAqIEBwYXJhbSBmcm9tVUkg5LuO5ZOq5LiqVUnmiZPlvIDnmoRcclxuICAgICAqIEBwYXJhbSBhcmdzIOWPr+WPmOWPguaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25PcGVuKGZyb21VSTogbnVtYmVyLCAuLi5hcmdzKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P5qyh55WM6Z2iT3BlbuWKqOeUu+aSreaUvuWujOavleaXtuWbnuiwg1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25PcGVuQW5pT3ZlcigpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+eVjOmdouiiq+WFs+mXreaXtuWbnuiwg++8jOavj+asoeiwg+eUqENsb3Nl5pe25Zue6LCDXHJcbiAgICAgKiDov5Tlm57lgLzkvJrkvKDpgJLnu5nkuIvkuIDkuKrnlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uQ2xvc2UoKTogYW55IHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPnlYzpnaLooqvnva7pobbml7blm57osIPvvIxPcGVu5pe25bm25LiN5Lya5Zue6LCD6K+l5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gcHJlSUQg5YmN5LiA5LiqdWlcclxuICAgICAqIEBwYXJhbSBhcmdzIOWPr+WPmOWPguaVsO+8jFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25Ub3AocHJlSUQ6IG51bWJlciwgLi4uYXJncyk6IHZvaWQge1xyXG5cclxuICAgIH1cclxufVxyXG4iXX0=