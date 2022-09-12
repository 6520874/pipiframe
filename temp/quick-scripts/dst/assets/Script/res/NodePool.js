
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/res/NodePool.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '79670Jcz25EHbpPz2sbGO5H', 'NodePool');
// Script/res/NodePool.ts

// import { resLoader } from "./ResLoader";
// /**
//  * Prefab的实例对象管理，目标为减少instantiate的次数，复用Node
//  * 
//  * 2020-1-19 by 宝爷
//  */
// export type NodePoolCallback = (error: Error, nodePool: NodePool) => void;
// export class NodePool {
//     private _isReady: boolean = false;
//     private _createCount: number = 0;
//     private _warterMark: number = 10;
//     private _useKey: string = "@NodePool";
//     private _res: cc.Prefab = null;
//     private _nodes: Array<cc.Node> = new Array<cc.Node>();
//     public isReady() { return this._isReady; }
//     /**
//      * 初始化NodePool，可以传入使用resloader加载的prefab，或者传入url异步加载
//      * 如果使用url来初始化，需要检查isReady，否则获取node会返回null
//      * @param prefab 
//      * @param url
//      */
//     public init(prefab: cc.Prefab)
//     public init(url: string, finishCallback: NodePoolCallback)
//     public init() {
//         let urlOrPrefab = arguments[0];
//         var finishCallback = null;
//         if (arguments.length == 2 && typeof arguments[1] == "function") {
//             finishCallback = arguments[1];
//         }
//         if (urlOrPrefab instanceof cc.Prefab) {
//             this._res = urlOrPrefab;
//             let url = resLoader.getResKeyByAsset(this._res);
//             if (url) {
//                 if (resLoader.addUse(url, this._useKey)) {
//                     this._isReady = true;
//                     if (finishCallback) {
//                         finishCallback(null, this);
//                     }
//                     return;
//                 }
//             }
//         } else if (typeof arguments[0] == "string") {
//             resLoader.loadRes(arguments[0], cc.Prefab, (error: Error, prefab: cc.Prefab) => {
//                 if (!error) {
//                     this._res = prefab;
//                     this._isReady = true;
//                 }
//                 if (finishCallback) {
//                     finishCallback(error, this);
//                 }
//             }, this._useKey);
//             return;
//         }
//         console.error(`NodePool init error ${arguments[0]}`);
//     }
//     /**
//      * 获取或创建一个Prefab实例Node
//      */
//     public getNode(): cc.Node {
//         if (!this.isReady) {
//             return null;
//         }
//         if (this._nodes.length > 0) {
//             return this._nodes.pop();
//         } else {
//             this._createCount++;
//             return cc.instantiate(this._res);
//         }
//     }
//     /**
//      * 回收Node实例
//      * @param node 要回收的Prefab实例
//      */
//     public freeNode(node: cc.Node) {
//         if (!(node && cc.isValid(node))) {
//             cc.error('[ERROR] PrefabPool: freePrefab: isValid node');
//             this._createCount--;
//             return;
//         }
//         if (this._warterMark < this._nodes.length) {
//             this._createCount--;
//             node.destroy();
//         } else {
//             node.removeFromParent(true);
//             node.cleanup();
//             this._nodes.push(node);
//         }
//     }
//     /**
//      * 设置回收水位
//      * @param waterMakr 水位
//      */
//     public setWaterMark(waterMakr: number) {
//         this._warterMark = waterMakr;
//     }
//     /**
//      * 池子里的prefab是否都没有使用
//      */
//     public isUnuse() {
//         if (this._nodes.length > this._createCount) {
//             cc.error('PrefabPool: _nodes.length > _createCount');
//         }
//         return this._nodes.length == this._createCount;
//     }
//     /**
//      * 清空prefab
//      */
//     public destory() {
//         // 清空节点、回收资源
//         for (let node of this._nodes) {
//             node.destroy();
//         }
//         this._createCount -= this._nodes.length;
//         this._nodes.length = 0;
//         resLoader.releaseAsset(this._res, this._useKey);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcmVzL05vZGVQb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUEyQztBQUUzQyxNQUFNO0FBQ04sOENBQThDO0FBQzlDLE1BQU07QUFDTixxQkFBcUI7QUFDckIsTUFBTTtBQUVOLDZFQUE2RTtBQUU3RSwwQkFBMEI7QUFDMUIseUNBQXlDO0FBQ3pDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsNkNBQTZDO0FBQzdDLHNDQUFzQztBQUN0Qyw2REFBNkQ7QUFFN0QsaURBQWlEO0FBRWpELFVBQVU7QUFDViwwREFBMEQ7QUFDMUQsaURBQWlEO0FBQ2pELHdCQUF3QjtBQUN4QixvQkFBb0I7QUFDcEIsVUFBVTtBQUNWLHFDQUFxQztBQUNyQyxpRUFBaUU7QUFDakUsc0JBQXNCO0FBQ3RCLDBDQUEwQztBQUMxQyxxQ0FBcUM7QUFDckMsNEVBQTRFO0FBQzVFLDZDQUE2QztBQUM3QyxZQUFZO0FBRVosa0RBQWtEO0FBQ2xELHVDQUF1QztBQUN2QywrREFBK0Q7QUFDL0QseUJBQXlCO0FBQ3pCLDZEQUE2RDtBQUM3RCw0Q0FBNEM7QUFDNUMsNENBQTRDO0FBQzVDLHNEQUFzRDtBQUN0RCx3QkFBd0I7QUFDeEIsOEJBQThCO0FBQzlCLG9CQUFvQjtBQUNwQixnQkFBZ0I7QUFDaEIsd0RBQXdEO0FBQ3hELGdHQUFnRztBQUNoRyxnQ0FBZ0M7QUFDaEMsMENBQTBDO0FBQzFDLDRDQUE0QztBQUM1QyxvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLG1EQUFtRDtBQUNuRCxvQkFBb0I7QUFDcEIsZ0NBQWdDO0FBQ2hDLHNCQUFzQjtBQUN0QixZQUFZO0FBQ1osZ0VBQWdFO0FBQ2hFLFFBQVE7QUFFUixVQUFVO0FBQ1YsNkJBQTZCO0FBQzdCLFVBQVU7QUFDVixrQ0FBa0M7QUFDbEMsK0JBQStCO0FBQy9CLDJCQUEyQjtBQUMzQixZQUFZO0FBRVosd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxtQkFBbUI7QUFDbkIsbUNBQW1DO0FBQ25DLGdEQUFnRDtBQUNoRCxZQUFZO0FBQ1osUUFBUTtBQUVSLFVBQVU7QUFDVixrQkFBa0I7QUFDbEIsa0NBQWtDO0FBQ2xDLFVBQVU7QUFDVix1Q0FBdUM7QUFDdkMsNkNBQTZDO0FBQzdDLHdFQUF3RTtBQUN4RSxtQ0FBbUM7QUFDbkMsc0JBQXNCO0FBQ3RCLFlBQVk7QUFDWix1REFBdUQ7QUFDdkQsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixtQkFBbUI7QUFDbkIsMkNBQTJDO0FBQzNDLDhCQUE4QjtBQUM5QixzQ0FBc0M7QUFDdEMsWUFBWTtBQUNaLFFBQVE7QUFFUixVQUFVO0FBQ1YsZ0JBQWdCO0FBQ2hCLDZCQUE2QjtBQUM3QixVQUFVO0FBQ1YsK0NBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxRQUFRO0FBRVIsVUFBVTtBQUNWLDJCQUEyQjtBQUMzQixVQUFVO0FBQ1YseUJBQXlCO0FBQ3pCLHdEQUF3RDtBQUN4RCxvRUFBb0U7QUFDcEUsWUFBWTtBQUNaLDBEQUEwRDtBQUMxRCxRQUFRO0FBRVIsVUFBVTtBQUNWLGtCQUFrQjtBQUNsQixVQUFVO0FBQ1YseUJBQXlCO0FBQ3pCLHVCQUF1QjtBQUN2QiwwQ0FBMEM7QUFDMUMsOEJBQThCO0FBQzlCLFlBQVk7QUFDWixtREFBbUQ7QUFDbkQsa0NBQWtDO0FBQ2xDLDJEQUEyRDtBQUMzRCxRQUFRO0FBQ1IsSUFBSSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IHJlc0xvYWRlciB9IGZyb20gXCIuL1Jlc0xvYWRlclwiO1xyXG5cclxuLy8gLyoqXHJcbi8vICAqIFByZWZhYueahOWunuS+i+WvueixoeeuoeeQhu+8jOebruagh+S4uuWHj+WwkWluc3RhbnRpYXRl55qE5qyh5pWw77yM5aSN55SoTm9kZVxyXG4vLyAgKiBcclxuLy8gICogMjAyMC0xLTE5IGJ5IOWuneeIt1xyXG4vLyAgKi9cclxuXHJcbi8vIGV4cG9ydCB0eXBlIE5vZGVQb29sQ2FsbGJhY2sgPSAoZXJyb3I6IEVycm9yLCBub2RlUG9vbDogTm9kZVBvb2wpID0+IHZvaWQ7XHJcbiBcclxuLy8gZXhwb3J0IGNsYXNzIE5vZGVQb29sIHtcclxuLy8gICAgIHByaXZhdGUgX2lzUmVhZHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuLy8gICAgIHByaXZhdGUgX2NyZWF0ZUNvdW50OiBudW1iZXIgPSAwO1xyXG4vLyAgICAgcHJpdmF0ZSBfd2FydGVyTWFyazogbnVtYmVyID0gMTA7XHJcbi8vICAgICBwcml2YXRlIF91c2VLZXk6IHN0cmluZyA9IFwiQE5vZGVQb29sXCI7XHJcbi8vICAgICBwcml2YXRlIF9yZXM6IGNjLlByZWZhYiA9IG51bGw7XHJcbi8vICAgICBwcml2YXRlIF9ub2RlczogQXJyYXk8Y2MuTm9kZT4gPSBuZXcgQXJyYXk8Y2MuTm9kZT4oKTtcclxuXHJcbi8vICAgICBwdWJsaWMgaXNSZWFkeSgpIHsgcmV0dXJuIHRoaXMuX2lzUmVhZHk7IH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOWIneWni+WMlk5vZGVQb29s77yM5Y+v5Lul5Lyg5YWl5L2/55SocmVzbG9hZGVy5Yqg6L2955qEcHJlZmFi77yM5oiW6ICF5Lyg5YWldXJs5byC5q2l5Yqg6L29XHJcbi8vICAgICAgKiDlpoLmnpzkvb/nlKh1cmzmnaXliJ3lp4vljJbvvIzpnIDopoHmo4Dmn6Vpc1JlYWR577yM5ZCm5YiZ6I635Y+Wbm9kZeS8mui/lOWbnm51bGxcclxuLy8gICAgICAqIEBwYXJhbSBwcmVmYWIgXHJcbi8vICAgICAgKiBAcGFyYW0gdXJsXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBpbml0KHByZWZhYjogY2MuUHJlZmFiKVxyXG4vLyAgICAgcHVibGljIGluaXQodXJsOiBzdHJpbmcsIGZpbmlzaENhbGxiYWNrOiBOb2RlUG9vbENhbGxiYWNrKVxyXG4vLyAgICAgcHVibGljIGluaXQoKSB7XHJcbi8vICAgICAgICAgbGV0IHVybE9yUHJlZmFiID0gYXJndW1lbnRzWzBdO1xyXG4vLyAgICAgICAgIHZhciBmaW5pc2hDYWxsYmFjayA9IG51bGw7XHJcbi8vICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMiAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09IFwiZnVuY3Rpb25cIikge1xyXG4vLyAgICAgICAgICAgICBmaW5pc2hDYWxsYmFjayA9IGFyZ3VtZW50c1sxXTtcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIGlmICh1cmxPclByZWZhYiBpbnN0YW5jZW9mIGNjLlByZWZhYikge1xyXG4vLyAgICAgICAgICAgICB0aGlzLl9yZXMgPSB1cmxPclByZWZhYjtcclxuLy8gICAgICAgICAgICAgbGV0IHVybCA9IHJlc0xvYWRlci5nZXRSZXNLZXlCeUFzc2V0KHRoaXMuX3Jlcyk7XHJcbi8vICAgICAgICAgICAgIGlmICh1cmwpIHtcclxuLy8gICAgICAgICAgICAgICAgIGlmIChyZXNMb2FkZXIuYWRkVXNlKHVybCwgdGhpcy5fdXNlS2V5KSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5pc2hDYWxsYmFjaykge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hDYWxsYmFjayhudWxsLCB0aGlzKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09IFwic3RyaW5nXCIpIHtcclxuLy8gICAgICAgICAgICAgcmVzTG9hZGVyLmxvYWRSZXMoYXJndW1lbnRzWzBdLCBjYy5QcmVmYWIsIChlcnJvcjogRXJyb3IsIHByZWZhYjogY2MuUHJlZmFiKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzID0gcHJlZmFiO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgaWYgKGZpbmlzaENhbGxiYWNrKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZmluaXNoQ2FsbGJhY2soZXJyb3IsIHRoaXMpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9LCB0aGlzLl91c2VLZXkpO1xyXG4vLyAgICAgICAgICAgICByZXR1cm47XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5vZGVQb29sIGluaXQgZXJyb3IgJHthcmd1bWVudHNbMF19YCk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDojrflj5bmiJbliJvlu7rkuIDkuKpQcmVmYWLlrp7kvotOb2RlXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBnZXROb2RlKCk6IGNjLk5vZGUge1xyXG4vLyAgICAgICAgIGlmICghdGhpcy5pc1JlYWR5KSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgaWYgKHRoaXMuX25vZGVzLmxlbmd0aCA+IDApIHtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVzLnBvcCgpO1xyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUNvdW50Kys7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBjYy5pbnN0YW50aWF0ZSh0aGlzLl9yZXMpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOWbnuaUtk5vZGXlrp7kvotcclxuLy8gICAgICAqIEBwYXJhbSBub2RlIOimgeWbnuaUtueahFByZWZhYuWunuS+i1xyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgZnJlZU5vZGUobm9kZTogY2MuTm9kZSkge1xyXG4vLyAgICAgICAgIGlmICghKG5vZGUgJiYgY2MuaXNWYWxpZChub2RlKSkpIHtcclxuLy8gICAgICAgICAgICAgY2MuZXJyb3IoJ1tFUlJPUl0gUHJlZmFiUG9vbDogZnJlZVByZWZhYjogaXNWYWxpZCBub2RlJyk7XHJcbi8vICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUNvdW50LS07XHJcbi8vICAgICAgICAgICAgIHJldHVybjtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgaWYgKHRoaXMuX3dhcnRlck1hcmsgPCB0aGlzLl9ub2Rlcy5sZW5ndGgpIHtcclxuLy8gICAgICAgICAgICAgdGhpcy5fY3JlYXRlQ291bnQtLTtcclxuLy8gICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgbm9kZS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xyXG4vLyAgICAgICAgICAgICBub2RlLmNsZWFudXAoKTtcclxuLy8gICAgICAgICAgICAgdGhpcy5fbm9kZXMucHVzaChub2RlKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDorr7nva7lm57mlLbmsLTkvY1cclxuLy8gICAgICAqIEBwYXJhbSB3YXRlck1ha3Ig5rC05L2NXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzZXRXYXRlck1hcmsod2F0ZXJNYWtyOiBudW1iZXIpIHtcclxuLy8gICAgICAgICB0aGlzLl93YXJ0ZXJNYXJrID0gd2F0ZXJNYWtyO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5rGg5a2Q6YeM55qEcHJlZmFi5piv5ZCm6YO95rKh5pyJ5L2/55SoXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBpc1VudXNlKCkge1xyXG4vLyAgICAgICAgIGlmICh0aGlzLl9ub2Rlcy5sZW5ndGggPiB0aGlzLl9jcmVhdGVDb3VudCkge1xyXG4vLyAgICAgICAgICAgICBjYy5lcnJvcignUHJlZmFiUG9vbDogX25vZGVzLmxlbmd0aCA+IF9jcmVhdGVDb3VudCcpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICByZXR1cm4gdGhpcy5fbm9kZXMubGVuZ3RoID09IHRoaXMuX2NyZWF0ZUNvdW50O1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5riF56m6cHJlZmFiXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBkZXN0b3J5KCkge1xyXG4vLyAgICAgICAgIC8vIOa4heepuuiKgueCueOAgeWbnuaUtui1hOa6kFxyXG4vLyAgICAgICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5fbm9kZXMpIHtcclxuLy8gICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIHRoaXMuX2NyZWF0ZUNvdW50IC09IHRoaXMuX25vZGVzLmxlbmd0aDtcclxuLy8gICAgICAgICB0aGlzLl9ub2Rlcy5sZW5ndGggPSAwO1xyXG4vLyAgICAgICAgIHJlc0xvYWRlci5yZWxlYXNlQXNzZXQodGhpcy5fcmVzLCB0aGlzLl91c2VLZXkpO1xyXG4vLyAgICAgfVxyXG4vLyB9Il19