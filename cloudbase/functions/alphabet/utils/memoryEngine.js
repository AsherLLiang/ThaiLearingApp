/**
 * alphabet/utils/memoryEngine.js
 *
 * 说明：
 *  - 早期 alphabet 模块内复制了一份记忆引擎实现，和 memory-engine 下的 utils/memoryEngine 基本重复。
 *  - 为避免逻辑分叉，这里改为直接复用统一记忆引擎的实现。
 */

module.exports = require('../memory-engine/utils/memoryEngine');

