
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/ResPool.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4d239KZe5hI4Zb4kyjxarWh', 'ResPool');
// Script/res/ResPool.ts

// import ResLoader, { resLoader, CompletedCallback, ProcessCallback, LoadResArgs } from "./ResLoader";
// /**
//  * ResPool，可提高资源缓存的效率，
//  * 当超过警戒水位时，每次加载新的资源都会自动检查可释放的资源进行释放
//  * 也可以手动调用releaseUnuseRes，自动释放可释放的资源
//  * 
//  * 2020-1-19 by 宝爷
//  */
// export class ResPool {
//     private _useKey: string;
//     private _urls: string[] = [];
//     private _waterMark: number = 32;
//     constructor() {
//         this._useKey = `@ResPool${resLoader.nextUseKey()}`;
//     }
//     /**
//      * 开始加载资源
//      * @param url           资源url
//      * @param type          资源类型，默认为null
//      * @param onProgess     加载进度回调
//      * @param onCompleted   加载完成回调
//      * @param use           资源使用key，根据makeUseKey方法生成
//      */
//     public loadRes(url: string, use?: string);
//     public loadRes(url: string, onCompleted: CompletedCallback, use?: string);
//     public loadRes(url: string, onProgess: ProcessCallback, onCompleted: CompletedCallback, use?: string);
//     public loadRes(url: string, type: typeof cc.Asset, use?: string);
//     public loadRes(url: string, type: typeof cc.Asset, onCompleted: CompletedCallback, use?: string);
//     public loadRes(url: string, type: typeof cc.Asset, onProgess: ProcessCallback, onCompleted: CompletedCallback, use?: string);
//     public loadRes() {
//         this.autoCheck();
//         let resArgs: LoadResArgs = ResLoader.makeLoadResArgs.apply(this, arguments);
//         let SaveCompleted = resArgs.onCompleted;
//         resArgs.onCompleted = (error: Error, resource: any) => {
//             let url = resLoader.getResKeyByAsset(resource);
//             if (!error && url) {
//                 this.addNewResUrl(url);
//             }
//             if (SaveCompleted) {
//                 SaveCompleted(error, resource);
//             }
//         };
//     }
//     /**
//      * 设置监控水位
//      * @param waterMakr 水位
//      */
//     public setWaterMark(waterMakr: number) {
//         this._waterMark = waterMakr;
//     }
//     /**
//      * 是否缓存了某url（这里的url为resloader的_resMap的key，可能不等于加载的url）
//      * @param url 
//      */
//     public hasResUrl(url: string) : boolean {
//         for (let i = 0; i < this._urls.length; ++i) {
//             if (url == this._urls[i]) {
//                 return true;
//             }
//         }
//         return false;
//     }
//     /**
//      * 加载完成后添加一个use
//      * @param url 
//      */
//     private addNewResUrl(url: string) {
//         if (!this.hasResUrl(url) && resLoader.addUse(url, this._useKey)) {
//             this._urls[this._urls.length] = url;
//         }
//     }
//     /**
//      * 自动检测是否需要释放资源，需要则自动释放资源
//      */
//     public autoCheck() {
//         if (this._urls.length > this._waterMark) {
//             this.autoReleaseUnuseRes();
//         }
//     }
//     /**
//      * 自动释放资源
//      */
//     public autoReleaseUnuseRes() {
//         for (let i = this._urls.length; i >= 0; --i) {
//             if (resLoader.canRelease(this._urls[i], this._useKey)) {
//                 resLoader.releaseRes(this._urls[i], this._useKey);
//                 this._urls.splice(i, 1);
//             }
//         }
//     }
//     /**
//      * 清空该ResPool
//      */
//     public destroy() {
//         for (let i = this._urls.length; i >= 0; --i) {
//             resLoader.releaseRes(this._urls[i], this._useKey);
//         }
//         this._urls.length = 0;
//     }
//     /**
//      * 调试打印缓存的urls
//      */
//     public dump() {
//         console.log(this._urls);
//     }
// }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL1Jlc1Bvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUdBQXVHO0FBRXZHLE1BQU07QUFDTix5QkFBeUI7QUFDekIsdUNBQXVDO0FBQ3ZDLHVDQUF1QztBQUN2QyxNQUFNO0FBQ04scUJBQXFCO0FBQ3JCLE1BQU07QUFFTix5QkFBeUI7QUFDekIsK0JBQStCO0FBQy9CLG9DQUFvQztBQUNwQyx1Q0FBdUM7QUFFdkMsc0JBQXNCO0FBQ3RCLDhEQUE4RDtBQUM5RCxRQUFRO0FBRVIsVUFBVTtBQUNWLGdCQUFnQjtBQUNoQixvQ0FBb0M7QUFDcEMsMkNBQTJDO0FBQzNDLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFDckMsdURBQXVEO0FBQ3ZELFVBQVU7QUFDVixpREFBaUQ7QUFDakQsaUZBQWlGO0FBQ2pGLDZHQUE2RztBQUM3Ryx3RUFBd0U7QUFDeEUsd0dBQXdHO0FBQ3hHLG9JQUFvSTtBQUNwSSx5QkFBeUI7QUFDekIsNEJBQTRCO0FBQzVCLHVGQUF1RjtBQUN2RixtREFBbUQ7QUFDbkQsbUVBQW1FO0FBQ25FLDhEQUE4RDtBQUM5RCxtQ0FBbUM7QUFDbkMsMENBQTBDO0FBQzFDLGdCQUFnQjtBQUNoQixtQ0FBbUM7QUFDbkMsa0RBQWtEO0FBQ2xELGdCQUFnQjtBQUNoQixhQUFhO0FBQ2IsUUFBUTtBQUVSLFVBQVU7QUFDVixnQkFBZ0I7QUFDaEIsNkJBQTZCO0FBQzdCLFVBQVU7QUFDViwrQ0FBK0M7QUFDL0MsdUNBQXVDO0FBQ3ZDLFFBQVE7QUFFUixVQUFVO0FBQ1YsNkRBQTZEO0FBQzdELHFCQUFxQjtBQUNyQixVQUFVO0FBQ1YsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCwwQ0FBMEM7QUFDMUMsK0JBQStCO0FBQy9CLGdCQUFnQjtBQUNoQixZQUFZO0FBQ1osd0JBQXdCO0FBQ3hCLFFBQVE7QUFFUixVQUFVO0FBQ1Ysc0JBQXNCO0FBQ3RCLHFCQUFxQjtBQUNyQixVQUFVO0FBQ1YsMENBQTBDO0FBQzFDLDZFQUE2RTtBQUM3RSxtREFBbUQ7QUFDbkQsWUFBWTtBQUNaLFFBQVE7QUFFUixVQUFVO0FBQ1YsZ0NBQWdDO0FBQ2hDLFVBQVU7QUFDViwyQkFBMkI7QUFDM0IscURBQXFEO0FBQ3JELDBDQUEwQztBQUMxQyxZQUFZO0FBQ1osUUFBUTtBQUVSLFVBQVU7QUFDVixnQkFBZ0I7QUFDaEIsVUFBVTtBQUNWLHFDQUFxQztBQUNyQyx5REFBeUQ7QUFDekQsdUVBQXVFO0FBQ3ZFLHFFQUFxRTtBQUNyRSwyQ0FBMkM7QUFDM0MsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixRQUFRO0FBRVIsVUFBVTtBQUNWLG9CQUFvQjtBQUNwQixVQUFVO0FBQ1YseUJBQXlCO0FBQ3pCLHlEQUF5RDtBQUN6RCxpRUFBaUU7QUFDakUsWUFBWTtBQUNaLGlDQUFpQztBQUNqQyxRQUFRO0FBRVIsVUFBVTtBQUNWLHFCQUFxQjtBQUNyQixVQUFVO0FBQ1Ysc0JBQXNCO0FBQ3RCLG1DQUFtQztBQUNuQyxRQUFRO0FBQ1IsSUFBSSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBSZXNMb2FkZXIsIHsgcmVzTG9hZGVyLCBDb21wbGV0ZWRDYWxsYmFjaywgUHJvY2Vzc0NhbGxiYWNrLCBMb2FkUmVzQXJncyB9IGZyb20gXCIuL1Jlc0xvYWRlclwiO1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFJlc1Bvb2zvvIzlj6/mj5Dpq5jotYTmupDnvJPlrZjnmoTmlYjnjofvvIxcclxuLy8gICog5b2T6LaF6L+H6K2m5oiS5rC05L2N5pe277yM5q+P5qyh5Yqg6L295paw55qE6LWE5rqQ6YO95Lya6Ieq5Yqo5qOA5p+l5Y+v6YeK5pS+55qE6LWE5rqQ6L+b6KGM6YeK5pS+XHJcbi8vICAqIOS5n+WPr+S7peaJi+WKqOiwg+eUqHJlbGVhc2VVbnVzZVJlc++8jOiHquWKqOmHiuaUvuWPr+mHiuaUvueahOi1hOa6kFxyXG4vLyAgKiBcclxuLy8gICogMjAyMC0xLTE5IGJ5IOWuneeIt1xyXG4vLyAgKi9cclxuXHJcbi8vIGV4cG9ydCBjbGFzcyBSZXNQb29sIHtcclxuLy8gICAgIHByaXZhdGUgX3VzZUtleTogc3RyaW5nO1xyXG4vLyAgICAgcHJpdmF0ZSBfdXJsczogc3RyaW5nW10gPSBbXTtcclxuLy8gICAgIHByaXZhdGUgX3dhdGVyTWFyazogbnVtYmVyID0gMzI7XHJcblxyXG4vLyAgICAgY29uc3RydWN0b3IoKSB7XHJcbi8vICAgICAgICAgdGhpcy5fdXNlS2V5ID0gYEBSZXNQb29sJHtyZXNMb2FkZXIubmV4dFVzZUtleSgpfWA7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDlvIDlp4vliqDovb3otYTmupBcclxuLy8gICAgICAqIEBwYXJhbSB1cmwgICAgICAgICAgIOi1hOa6kHVybFxyXG4vLyAgICAgICogQHBhcmFtIHR5cGUgICAgICAgICAg6LWE5rqQ57G75Z6L77yM6buY6K6k5Li6bnVsbFxyXG4vLyAgICAgICogQHBhcmFtIG9uUHJvZ2VzcyAgICAg5Yqg6L296L+b5bqm5Zue6LCDXHJcbi8vICAgICAgKiBAcGFyYW0gb25Db21wbGV0ZWQgICDliqDovb3lrozmiJDlm57osINcclxuLy8gICAgICAqIEBwYXJhbSB1c2UgICAgICAgICAgIOi1hOa6kOS9v+eUqGtlee+8jOagueaNrm1ha2VVc2VLZXnmlrnms5XnlJ/miJBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIHVzZT86IHN0cmluZyk7XHJcbi8vICAgICBwdWJsaWMgbG9hZFJlcyh1cmw6IHN0cmluZywgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrLCB1c2U/OiBzdHJpbmcpO1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIG9uUHJvZ2VzczogUHJvY2Vzc0NhbGxiYWNrLCBvbkNvbXBsZXRlZDogQ29tcGxldGVkQ2FsbGJhY2ssIHVzZT86IHN0cmluZyk7XHJcbi8vICAgICBwdWJsaWMgbG9hZFJlcyh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCB1c2U/OiBzdHJpbmcpO1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Db21wbGV0ZWQ6IENvbXBsZXRlZENhbGxiYWNrLCB1c2U/OiBzdHJpbmcpO1xyXG4vLyAgICAgcHVibGljIGxvYWRSZXModXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgb25Qcm9nZXNzOiBQcm9jZXNzQ2FsbGJhY2ssIG9uQ29tcGxldGVkOiBDb21wbGV0ZWRDYWxsYmFjaywgdXNlPzogc3RyaW5nKTtcclxuLy8gICAgIHB1YmxpYyBsb2FkUmVzKCkge1xyXG4vLyAgICAgICAgIHRoaXMuYXV0b0NoZWNrKCk7XHJcbi8vICAgICAgICAgbGV0IHJlc0FyZ3M6IExvYWRSZXNBcmdzID0gUmVzTG9hZGVyLm1ha2VMb2FkUmVzQXJncy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4vLyAgICAgICAgIGxldCBTYXZlQ29tcGxldGVkID0gcmVzQXJncy5vbkNvbXBsZXRlZDtcclxuLy8gICAgICAgICByZXNBcmdzLm9uQ29tcGxldGVkID0gKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueSkgPT4ge1xyXG4vLyAgICAgICAgICAgICBsZXQgdXJsID0gcmVzTG9hZGVyLmdldFJlc0tleUJ5QXNzZXQocmVzb3VyY2UpO1xyXG4vLyAgICAgICAgICAgICBpZiAoIWVycm9yICYmIHVybCkge1xyXG4vLyAgICAgICAgICAgICAgICAgdGhpcy5hZGROZXdSZXNVcmwodXJsKTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICBpZiAoU2F2ZUNvbXBsZXRlZCkge1xyXG4vLyAgICAgICAgICAgICAgICAgU2F2ZUNvbXBsZXRlZChlcnJvciwgcmVzb3VyY2UpO1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOiuvue9ruebkeaOp+awtOS9jVxyXG4vLyAgICAgICogQHBhcmFtIHdhdGVyTWFrciDmsLTkvY1cclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHNldFdhdGVyTWFyayh3YXRlck1ha3I6IG51bWJlcikge1xyXG4vLyAgICAgICAgIHRoaXMuX3dhdGVyTWFyayA9IHdhdGVyTWFrcjtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOaYr+WQpue8k+WtmOS6huafkHVybO+8iOi/memHjOeahHVybOS4unJlc2xvYWRlcueahF9yZXNNYXDnmoRrZXnvvIzlj6/og73kuI3nrYnkuo7liqDovb3nmoR1cmzvvIlcclxuLy8gICAgICAqIEBwYXJhbSB1cmwgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBoYXNSZXNVcmwodXJsOiBzdHJpbmcpIDogYm9vbGVhbiB7XHJcbi8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl91cmxzLmxlbmd0aDsgKytpKSB7XHJcbi8vICAgICAgICAgICAgIGlmICh1cmwgPT0gdGhpcy5fdXJsc1tpXSkge1xyXG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5Yqg6L295a6M5oiQ5ZCO5re75Yqg5LiA5LiqdXNlXHJcbi8vICAgICAgKiBAcGFyYW0gdXJsIFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwcml2YXRlIGFkZE5ld1Jlc1VybCh1cmw6IHN0cmluZykge1xyXG4vLyAgICAgICAgIGlmICghdGhpcy5oYXNSZXNVcmwodXJsKSAmJiByZXNMb2FkZXIuYWRkVXNlKHVybCwgdGhpcy5fdXNlS2V5KSkge1xyXG4vLyAgICAgICAgICAgICB0aGlzLl91cmxzW3RoaXMuX3VybHMubGVuZ3RoXSA9IHVybDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDoh6rliqjmo4DmtYvmmK/lkKbpnIDopoHph4rmlL7otYTmupDvvIzpnIDopoHliJnoh6rliqjph4rmlL7otYTmupBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIGF1dG9DaGVjaygpIHtcclxuLy8gICAgICAgICBpZiAodGhpcy5fdXJscy5sZW5ndGggPiB0aGlzLl93YXRlck1hcmspIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5hdXRvUmVsZWFzZVVudXNlUmVzKCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6Ieq5Yqo6YeK5pS+6LWE5rqQXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBhdXRvUmVsZWFzZVVudXNlUmVzKCkge1xyXG4vLyAgICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl91cmxzLmxlbmd0aDsgaSA+PSAwOyAtLWkpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHJlc0xvYWRlci5jYW5SZWxlYXNlKHRoaXMuX3VybHNbaV0sIHRoaXMuX3VzZUtleSkpIHtcclxuLy8gICAgICAgICAgICAgICAgIHJlc0xvYWRlci5yZWxlYXNlUmVzKHRoaXMuX3VybHNbaV0sIHRoaXMuX3VzZUtleSk7XHJcbi8vICAgICAgICAgICAgICAgICB0aGlzLl91cmxzLnNwbGljZShpLCAxKTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOa4heepuuivpVJlc1Bvb2xcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIGRlc3Ryb3koKSB7XHJcbi8vICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3VybHMubGVuZ3RoOyBpID49IDA7IC0taSkge1xyXG4vLyAgICAgICAgICAgICByZXNMb2FkZXIucmVsZWFzZVJlcyh0aGlzLl91cmxzW2ldLCB0aGlzLl91c2VLZXkpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICB0aGlzLl91cmxzLmxlbmd0aCA9IDA7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDosIPor5XmiZPljbDnvJPlrZjnmoR1cmxzXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBkdW1wKCkge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3VybHMpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiJdfQ==