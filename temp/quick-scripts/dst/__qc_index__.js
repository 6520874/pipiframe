
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Script/common/EventManager');
require('./assets/Script/common/TaskQueue');
require('./assets/Script/example/EmptyScene');
require('./assets/Script/example/NetExample');
require('./assets/Script/example/ResExample');
require('./assets/Script/example/ResKeeperExample');
require('./assets/Script/example/UIExample');
require('./assets/Script/example/uiviews/UIBag');
require('./assets/Script/example/uiviews/UIHall');
require('./assets/Script/example/uiviews/UILogin');
require('./assets/Script/example/uiviews/UINotice');
require('./assets/Script/network/NetInterface');
require('./assets/Script/network/NetManager');
require('./assets/Script/network/NetNode');
require('./assets/Script/network/WebSock');
require('./assets/Script/res/NodePool');
require('./assets/Script/res/ResKeeper');
require('./assets/Script/res/ResLeakChecker');
require('./assets/Script/res/ResLoader');
require('./assets/Script/res/ResManager');
require('./assets/Script/res/ResPool');
require('./assets/Script/res/ResUtil');
require('./assets/Script/ui/UIManager');
require('./assets/Script/ui/UIView');

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