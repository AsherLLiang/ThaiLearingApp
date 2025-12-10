(function() {
    // 1. 加载 JSZip
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.head.appendChild(script);

    setTimeout(() => {
        if (typeof JSZip === 'undefined') return alert("库加载失败");
        console.log("%c🚀 开始抓取全量音频数据...", "color: blue; font-weight: bold;");
        startScraping();
    }, 3000);

    async function startScraping() {
        const BASE_URL = "https://cdn.langeek.cn/thaik/corpus/thai/rv/BaseThai_4";
        const CATALOG_URL = `${BASE_URL}/p/O5G1e3lD7B0I2o6C9f8A4L1`;

        // A. 获取目录
        const catalogResp = await fetch(CATALOG_URL);
        const catalogData = await catalogResp.json();
        const uniqueLessons = [...new Set(catalogData.words.map(w => w.lessonNumber).filter(l => l))];
        uniqueLessons.sort((a, b) => parseFloat(a) - parseFloat(b));

        const zip = new JSZip();
        const folder = zip.folder("Audio_JSONL_Full");
        let count = 0;

        // B. 遍历课程
        for (const lessonId of uniqueLessons) {
            const bUrl = `${BASE_URL}/b/${lessonId}`;
            console.log(`⬇️ 下载第 ${lessonId} 课音频...`);

            try {
                const res = await fetch(bUrl);
                if (res.ok) {
                    const rawData = await res.json();
                    let lines = [];

                    // --- 🔥 核心修改：遍历所有分类 ---
                    // categories: words(单词), sentences(例句), dialogue(对话), cognates(同源词)
                    const categories = ['words', 'sentences', 'dialogue', 'cognates'];

                    categories.forEach(cat => {
                        const mapData = rawData[cat] || {};
                        Object.entries(mapData).forEach(([key, base64Str]) => {
                            if (typeof base64Str === 'string' && base64Str.startsWith('data:audio')) {
                                lines.push(JSON.stringify({
                                    category: cat,   // 标记分类：words, sentences...
                                    originalKey: key, // 原始Key：7_sentence_实用场景1...
                                    content: base64Str // 音频数据
                                }));
                            }
                        });
                    });
                    // -------------------------------

                    if (lines.length > 0) {
                        folder.file(`${lessonId}.json`, lines.join('\n'));
                        count++;
                    }
                }
            } catch (e) {
                console.error(e);
            }
            await new Promise(r => setTimeout(r, 200));
        }

        // C. 下载
        const content = await zip.generateAsync({type: "blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Thai_4_Audio.zip";
        link.click();
        console.log("✅ 下载完成");
    }
})();