// src/utils/alphabet/audioHelper.ts

import type { Letter } from '@/src/entities/types/letter.types';
import type { AudioRequirementType } from '@/src/entities/enums/QuestionType.enum';

/**
 * 音频Base URL
 */
const LETTER_AUDIO_BASE = 
  'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/';

/**
 * 将可能是「完整 URL」或「相对路径 / key」的音频字段规范化为完整 URL。
 */
function normalizeAudioSource(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return resolveAudioPath(path);
}

/**
 * 音频优先级策略
 * 
 * @param letter - 字母对象
 * @param type - 音频需求类型
 * @returns 音频URL（始终为完整 HTTP URL 或空字符串）
 */
export function getLetterAudioUrl(
  letter: Letter,
  type: AudioRequirementType = 'letter'
): string {
  switch (type) {
    case 'letter':
      // 默认使用完整读音:
      // fullSoundUrl > letterPronunciationUrl > audioPath
      return (
        normalizeAudioSource(letter.fullSoundUrl) ||
        normalizeAudioSource(letter.letterPronunciationUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    case 'syllable':
      // 音节发音
      return (
        normalizeAudioSource(letter.syllableSoundUrl) ||
        normalizeAudioSource(letter.fullSoundUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    case 'minimal-pair':
      // 最小对立组(使用letter类型,由调用方处理对比)
      return (
        normalizeAudioSource(letter.fullSoundUrl) ||
        normalizeAudioSource(letter.letterPronunciationUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    case 'tone-set':
      // 声调变体(需TTS生成,返回基础音频)
      return (
        normalizeAudioSource(letter.syllableSoundUrl) ||
        normalizeAudioSource(letter.fullSoundUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    default:
      return (
        normalizeAudioSource(letter.fullSoundUrl) ||
        resolveAudioPath(letter.audioPath)
      );
  }
}

/**
 * 解析音频路径
 * 
 * @param path - 音频路径
 * @returns 完整URL
 */
function resolveAudioPath(path?: string | null): string {
  if (!path) return '';
  
  // 如果已经是完整URL,直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 对类似 "word-kai" / "sound-k" 这类 key 自动补全 .mp3 后缀
  let finalPath = path;
  if (!/\.mp3($|\?)/.test(finalPath)) {
    finalPath = `${finalPath}.mp3`;
  }

  // 拼接Base URL
  return `${LETTER_AUDIO_BASE}${finalPath}`;
}

/**
 * 获取最小对立组的音频URL列表
 * 
 * @param letters - 字母列表(包含目标字母+对比字母)
 * @returns 音频URL数组
 */
export function getMinimalPairAudioUrls(letters: Letter[]): string[] {
  return letters.map(letter => getLetterAudioUrl(letter, 'minimal-pair'));
}

/**
 * 生成声调变体音频URLs
 * 
 * ⚠️ 当前实现:返回基础音频
 * 🔮 未来实现:调用TTS API生成5个声调变体
 * 
 * @param letter - 字母对象
 * @param vowel - 元音(可选)
 * @returns 5个声调音频URL数组
 */
export function getToneVariantAudioUrls(
  letter: Letter,
  vowel?: string
): string[] {
  const baseAudioUrl = getLetterAudioUrl(letter, 'tone-set');
  
  // 当前策略:返回相同的基础音频(临时方案)
  // 前端可以在UI上标注"需TTS生成"
  return [
    baseAudioUrl, // 中平调
    baseAudioUrl, // 低降调
    baseAudioUrl, // 降调
    baseAudioUrl, // 高调
    baseAudioUrl, // 升调
  ];
  
  // 🔮 未来实现(需后端TTS服务):
  // return await ttsService.generateToneVariants(letter, vowel);
}

/**
 * 获取某个字母相关的所有音频 URL（去重后）。
 *
 * 设计目的：
 * - 用于课程初始化时，一次性预缓存该字母所有可能会用到的音频；
 * - 包含：
 *   - letterPronunciationUrl（字母标准读音）
 *   - fullSoundUrl（完整读音）
 *   - syllableSoundUrl（音节发音）
 *   - endSyllableSoundUrl（尾音节发音）
 *   - audioPath（旧版路径）
 */
export function getAllLetterAudioUrls(letter: Letter): string[] {
  const rawSources: Array<string | null | undefined> = [
    // 以实际存在的音频为主：fullSoundUrl 与各类 *SoundUrl
    letter.fullSoundUrl,
    letter.syllableSoundUrl,
    letter.endSyllableSoundUrl,
    letter.audioPath,
  ];

  const urls = rawSources
    .map((src) => normalizeAudioSource(src ?? undefined))
    .filter((u): u is string => !!u);

  // 去重
  return Array.from(new Set(urls));
}

/**
 * 检查音频是否可用
 * 
 * @param url - 音频URL
 * @returns 是否可用
 */
export async function checkAudioAvailable(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('[AudioHelper] 音频不可用:', url, error);
    return false;
  }
}
