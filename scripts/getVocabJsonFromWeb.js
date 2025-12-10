//该脚本仅适用于浏览器控制台
//该脚本用于爬取网站上的json文件

(function() {
    // 1. 动态加载 JSZip 库
    console.log("%c⏳ 正在加载 JSZip 库...", "color: blue; font-weight: bold;");
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.head.appendChild(script);

    // 2. 设置定时器，3秒后执行主逻辑
    setTimeout(function() {
        if (typeof JSZip === 'undefined') {
            console.error("❌ JSZip 加载失败，请检查网络或重新运行代码。");
            return;
        }
        console.log("%c✅ 库加载成功！3秒已到，开始执行爬取任务...", "color: green; font-weight: bold; font-size: 14px;");
        startScrapingTask();
    }, 3000);

    // 3. 主任务逻辑
    async function startScrapingTask() {
        // ================= 配置区域 =================
        const BASE_URL = "https://cdn.langeek.cn/thaik/corpus/thai/rv/BaseThai_4";
        const CATALOG_URL = `${BASE_URL}/p/O5G1e3lD7B0I2o6C9f8A4L1`;
        // ===========================================

        try {
            // A. 获取总表
            console.log("1️⃣ 正在获取课程目录...");
            const catalogResp = await fetch(CATALOG_URL);
            if (!catalogResp.ok) throw new Error(`总表获取失败: ${catalogResp.status}`);
            const catalogData = await catalogResp.json();

            // B. 提取章节号
            const rawLessons = catalogData.words.map(w => w.lessonNumber).filter(l => l);
            const uniqueLessons = [...new Set(rawLessons)];
            uniqueLessons.sort((a, b) => parseFloat(a) - parseFloat(b));

            console.log(`✅ 目录获取成功！共发现 ${uniqueLessons.length} 个课程章节。`);

            // C. 准备 ZIP
            const zip = new JSZip();
            const folder = zip.folder("Thai_Vocab_JSONL");

            // D. 循环下载并转换格式
            let successCount = 0;
            
            for (let i = 0; i < uniqueLessons.length; i++) {
                const lessonId = uniqueLessons[i];
                const jUrl = `${BASE_URL}/j/${lessonId}`;
                
                console.log(`⬇️ [${i + 1}/${uniqueLessons.length}] 正在处理第 ${lessonId} 课...`);

                try {
                    const jResp = await fetch(jUrl);
                    if (jResp.ok) {
                        const rawContent = await jResp.json(); // 先解析为对象/数组
                        
                        let jsonlContent = "";

                        // --- 核心转换逻辑：转为 JSONL (NDJSON) ---
                        if (Array.isArray(rawContent)) {
                            // 如果是数组，把每一项转为字符串，用换行符连接
                            // 效果：
                            // {"id":1, ...}
                            // {"id":2, ...}
                            jsonlContent = rawContent.map(item => JSON.stringify(item)).join('\n');
                        } else if (typeof rawContent === 'object') {
                            // 如果是单个对象，直接转字符串（或者检查是否有内部 list）
                            // 有些结构可能是 { words: [...] }，这里做个兼容
                            if (rawContent.words && Array.isArray(rawContent.words)) {
                                jsonlContent = rawContent.words.map(item => JSON.stringify(item)).join('\n');
                            } else {
                                jsonlContent = JSON.stringify(rawContent);
                            }
                        } else {
                            // 纯文本或其他
                            jsonlContent = String(rawContent);
                        }
                        // ----------------------------------------

                        // 保存文件，虽然内容是 JSONL，但后缀保持 .json (方便编辑器识别)
                        folder.file(`${lessonId}.json`, jsonlContent);
                        successCount++;
                    } else {
                        console.warn(`⚠️ 课程 ${lessonId} 下载失败 (Status: ${jResp.status})`);
                    }
                } catch (err) {
                    console.error(`❌ 课程 ${lessonId} 处理出错:`, err);
                }

                // 稍微延时，防止请求过快
                await new Promise(r => setTimeout(r, 200));
            }

            // E. 打包下载
            console.log("📦 正在打包为 ZIP...");
            const content = await zip.generateAsync({type: "blob"});
            
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "Thai_4_Vocab.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`%c🎉 全部完成！已下载 ${successCount} 个 JSONL 格式的文件。`, "color: green; font-size: 16px; font-weight: bold;");

        } catch (e) {
            console.error("❌ 发生严重错误:", e);
        }
    }
})();