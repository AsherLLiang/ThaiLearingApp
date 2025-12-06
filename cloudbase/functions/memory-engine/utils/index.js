/**
 * Shared Utilities Package Entry Point
 * 
 * 统一导出所有共享模块
 * 使用方式: const { response, constants, sm2 } = require('@thai-app/shared');
 */

'use strict';

module.exports = {
    // 响应格式化模块
    response: require('./response'),

    // 常量定义模块
    constants: require('./constants'),

    // SM-2 算法模块
    sm2: require('./sm2'),

    // 参数验证模块
    validators: require('./validators'),

    // 统一记忆引擎模块
    memoryEngine: require('./memoryEngine'),

    // 数据库连接模块
    database: require('./database')
};
