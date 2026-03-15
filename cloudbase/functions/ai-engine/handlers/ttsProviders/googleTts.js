/**
 * Google Cloud TTS Provider（API Key + REST 方式）
 *
 * 使用 v1beta1 REST API + SSML <mark> 标签获取逐字时间戳。
 * 无需 SDK，通过 Node.js 内置 https 模块直接调用。
 *
 * 环境变量：
 *   GOOGLE_TTS_API_KEY — Google Cloud API Key（在 CloudBase 控制台配置）
 */

const https = require('https');

const DEFAULT_VOICE = 'th-TH-Neural2-C';
const TTS_ENDPOINT = 'texttospeech.googleapis.com';
const TTS_PATH = '/v1beta1/text:synthesize';

function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * 在每个字符前插入 <mark name="index"/>，
 * 用于让 Google TTS 返回逐字时间戳。
 */
function buildSsmlWithMarks(text) {
    const chars = [...text];
    let ssml = '<speak>';
    for (let i = 0; i < chars.length; i++) {
        ssml += `<mark name="${i}"/>${escapeXml(chars[i])}`;
    }
    ssml += '</speak>';
    return { ssml, chars };
}

function postJson(hostname, path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = https.request({
            hostname,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        }, (res) => {
            let chunks = '';
            res.on('data', (d) => { chunks += d; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(chunks);
                    if (res.statusCode >= 400) {
                        const msg = parsed.error?.message || `HTTP ${res.statusCode}`;
                        reject(new Error(msg));
                    } else {
                        resolve(parsed);
                    }
                } catch {
                    reject(new Error(`JSON 解析失败: ${chunks.substring(0, 200)}`));
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Provider 接口：
 * @param {string} text       — 待合成纯文本
 * @param {object} [options]
 * @param {string} [options.voiceName] — Google 语音名称（如 th-TH-Neural2-C）
 * @returns {Promise<{ audio: string, subtitles: Array }>}
 */
async function synthesize(text, options = {}) {
    const { voiceName = DEFAULT_VOICE } = options;

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
        throw new Error('缺少 GOOGLE_TTS_API_KEY 环境变量');
    }

    const { ssml, chars } = buildSsmlWithMarks(text);

    const response = await postJson(TTS_ENDPOINT, `${TTS_PATH}?key=${apiKey}`, {
        input: { ssml },
        voice: {
            languageCode: 'th-TH',
            name: voiceName,
        },
        audioConfig: { audioEncoding: 'MP3' },
        enableTimePointing: ['SSML_MARK'],
    });

    const audio = response.audioContent;
    const timepoints = response.timepoints || [];

    const subtitles = timepoints.map((tp, i) => {
        const charIdx = parseInt(tp.markName, 10);
        return {
            Text: chars[charIdx] || '',
            BeginTime: Math.round(tp.timeSeconds * 1000),
            EndTime: i < timepoints.length - 1
                ? Math.round(timepoints[i + 1].timeSeconds * 1000)
                : Math.round(tp.timeSeconds * 1000) + 200,
            BeginIndex: charIdx,
            EndIndex: charIdx + 1,
            Phoneme: null,
        };
    });

    return { audio, subtitles };
}

module.exports = { synthesize };
