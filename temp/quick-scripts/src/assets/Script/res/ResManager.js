"use strict";
cc._RF.push(module, '057d16YWG1BLYw+M2uo2hYT', 'ResManager');
// Script/res/ResManager.ts

"use strict";
/**
 * cc.Asset的管理器
 * 1. 对cc.Asset进行注入，扩展其addRef和decRef方法，使其支持引用计数
 * 2. 对cc.Asset进行资源依赖管理
 * 3. 接管场景切换时，资源的引用管理，避免无引用计数的场景依赖被意外释放
 *
 * 2021-1-21 by 宝爷
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ResKeeper_1 = require("./ResKeeper");
var ResUtil_1 = require("./ResUtil");
var loader = cc.loader;
var ResManager = /** @class */ (function () {
    function ResManager() {
        var _this = this;
        this.defaultKeeper = new ResKeeper_1.ResKeeper();
        this.persistDepends = new Set();
        this.sceneDepends = null;
        this.lastScene = null;
        cc.game.once(cc.game.EVENT_ENGINE_INITED, ResManager.assetInit);
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, function (scene) {
            _this.onSceneChange(scene);
        });
    }
    /**
     * 获取当前场景的持久节点应用的资源
     */
    ResManager.prototype.getPersistDepends = function () {
        var game = cc.game;
        var persistNodeList = Object.keys(game._persistRootNodes).map(function (x) {
            return game._persistRootNodes[x];
        });
        return ResUtil_1.ResUtil.getNodesDepends(persistNodeList);
    };
    /**
     * 处理场景切换，分两种情况，一种为根据scene的uuid找到场景的资源，另外一种为根据scene.dependAssets进行缓存
     * @param scene
     */
    ResManager.prototype.onSceneChange = function (scene) {
        var _this = this;
        console.log('On Scene Change');
        if (CC_EDITOR || this.lastScene == scene) {
            return;
        }
        // 获取新场景的依赖
        var depends = null;
        if (scene['dependAssets'] instanceof Array) {
            depends = scene['dependAssets'];
        }
        else {
            var item = loader.getItem(scene.uuid);
            if (item) {
                depends = item.dependKeys;
            }
            else {
                console.error("cache scene faile " + scene);
                return;
            }
        }
        // 缓存新场景的依赖
        for (var i = 0; i < depends.length; ++i) {
            // 下一个场景的资源可能是之前的常驻资源，这里
            if (!this.persistDepends.has(depends[i])) {
                this.cacheAsset(depends[i]);
            }
        }
        // 获取持久节点依赖
        var persistRes = this.getPersistDepends();
        // 释放旧场景依赖
        if (this.sceneDepends) {
            for (var i = 0; i < this.sceneDepends.length; ++i) {
                if (persistRes.has(this.sceneDepends[i])) {
                    // 如果是常驻节点的资源，就先不释放，放到persistDepends，等待合适的时机释放
                    this.persistDepends.add(this.sceneDepends[i]);
                }
                else if (!this.persistDepends.has(this.sceneDepends[i])) {
                    // 当资源是上个场景的依赖，又是上上个场景的依赖和常驻资源时，释放的话会导致重复释放
                    this.releaseAsset(this.sceneDepends[i]);
                }
            }
        }
        // 释放不再是常驻节点依赖的资源，防止泄露，遍历中删除是安全的
        this.persistDepends.forEach(function (item) {
            if (!persistRes.has(item)) {
                _this.releaseAsset(item);
                _this.persistDepends.delete(item);
            }
        });
        // 切场景时，自动释放默认资源
        this.getKeeper().releaseAssets();
        this.lastScene = scene;
    };
    // 为cc.Asset注入引用计数的功能
    ResManager.assetInit = function () {
        console.log('asset init');
        if (!Object.getOwnPropertyDescriptor(cc.Asset.prototype, 'addRef')) {
            Object.defineProperties(cc.Asset.prototype, {
                refDepends: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: false,
                },
                refCount: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: 0,
                },
                addRef: {
                    configurable: true,
                    writable: true,
                    value: function () {
                        ++this.refCount;
                        return this;
                    }
                },
                decRef: {
                    configurable: true,
                    writable: true,
                    value: function (autoRelease) {
                        if (autoRelease === void 0) { autoRelease = true; }
                        --this.refCount;
                        if (this.refCount <= 0 && autoRelease) {
                            ResManager.Instance.releaseAsset(this);
                        }
                        return this;
                    }
                }
            });
        }
    };
    Object.defineProperty(ResManager, "Instance", {
        get: function () {
            if (!this.instance) {
                this.instance = new ResManager();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    ResManager.prototype.getKeeper = function () {
        return this.defaultKeeper;
    };
    ResManager.prototype.getReferenceKey = function (assetOrUrlOrUuid) {
        if (assetOrUrlOrUuid instanceof cc.Asset && !assetOrUrlOrUuid['_uuid']) {
            // 远程资源没有_uuid
            if (assetOrUrlOrUuid.url) {
                return assetOrUrlOrUuid.url;
            }
        }
        return loader._getReferenceKey(assetOrUrlOrUuid);
    };
    /**
     * 缓存一个资源
     * @param item 资源的item对象
     */
    ResManager.prototype.cacheItem = function (item) {
        if (item) {
            var asset = item.content;
            if (asset instanceof cc.Asset) {
                asset.addRef();
                if (!asset.refDepends && item.dependKeys) {
                    var depends = item.dependKeys;
                    for (var i = 0; i < depends.length; i++) {
                        this.cacheItem(loader.getItem(depends[i]));
                    }
                    asset.refDepends = true;
                }
            }
            else {
                // 原生资源、html元素有可能走到这里，原生资源都是有对应的cc.Asset对应引用的，所以这里可以不处理
                console.log("cacheItem " + item + " is not cc.Asset " + asset);
            }
        }
        else {
            console.warn("cacheItem error, item is " + item);
        }
    };
    ResManager.prototype.cacheAsset = function (assetOrUrlOrUuid) {
        var key = this.getReferenceKey(assetOrUrlOrUuid);
        if (key) {
            var item = loader.getItem(key);
            if (item) {
                this.cacheItem(item);
            }
            else {
                console.warn("cacheAsset error, loader.getItem " + key + " is " + item);
            }
        }
        else {
            console.warn("cacheAsset error, this.getReferenceKey " + assetOrUrlOrUuid + " return " + key);
        }
    };
    /**
     * 释放一个资源
     * @param item 资源的item对象
     */
    ResManager.prototype.releaseItem = function (item, dec) {
        if (dec === void 0) { dec = false; }
        if (item && item.content) {
            var asset = item.content;
            var res = item.uuid || item.id;
            if (asset instanceof cc.Asset) {
                if (dec) {
                    asset.decRef(false);
                }
                if (asset.refCount <= 0) {
                    var depends = item.dependKeys;
                    if (depends) {
                        for (var i = 0; i < depends.length; i++) {
                            this.releaseItem(loader.getItem(depends[i]), true);
                        }
                    }
                    loader.release(res);
                    cc.log("loader.release cc.Asset " + res);
                }
            }
            else {
                loader.release(res);
                cc.log("loader.release " + res + " rawAsset " + asset);
            }
        }
        else {
            console.warn("releaseItem error, item is " + item);
        }
    };
    /**
     * 释放一个资源（会减少其引用计数）
     * @param assetOrUrlOrUuid
     */
    ResManager.prototype.releaseAsset = function (assetOrUrlOrUuid) {
        var key = this.getReferenceKey(assetOrUrlOrUuid);
        if (key) {
            var item = loader.getItem(key);
            if (item) {
                this.releaseItem(item);
            }
            else {
                console.warn("releaseAsset error, loader.getItem " + key + " is " + item);
            }
        }
        else {
            console.warn("releaseAsset error, this.getReferenceKey " + assetOrUrlOrUuid + " return " + key);
        }
    };
    return ResManager;
}());
exports.default = ResManager;

cc._RF.pop();