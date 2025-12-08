// src/utils/alphabet/audioHelper.ts

import type { Letter } from '@/src/entities/types/letter.types';
import type { AudioRequirementType } from '@/src/entities/enums/QuestionType.enum';

/**
 * 音频Base URL
 */
const LETTER_AUDIO_BASE = 
  'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/';

/**
 * 音频优先级策略
 * 
 * @param letter - 字母对象
 * @param type - 音频需求类型
 * @returns 音频URL
 */
export function getLetterAudioUrl(
  letter: Letter,
  type: AudioRequirementType = 'letter'
): string {
  switch (type) {
    case 'letter':
      // 优先级: fullSoundUrl > letterPronunciationUrl > audioPath
      return (
        letter.fullSoundUrl ||
        letter.letterPronunciationUrl ||
        resolveAudioPath(letter.audioPath)
      );
      
    case 'syllable':
      // 音节发音
      return (
        letter.syllableSoundUrl ||
        letter.fullSoundUrl ||
        resolveAudioPath(letter.audioPath)
      );
      
    case 'minimal-pair':
      // 最小对立组(使用letter类型,由调用方处理对比)
      return (
        letter.fullSoundUrl ||
        letter.letterPronunciationUrl ||
        resolveAudioPath(letter.audioPath)
      );
      
    case 'tone-set':
      // 声调变体(需TTS生成,返回基础音频)
      return (
        letter.syllableSoundUrl ||
        letter.fullSoundUrl ||
        resolveAudioPath(letter.audioPath)
      );
      
    default:
      return (
        letter.fullSoundUrl ||
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
  
  // 拼接Base URL
  return `${LETTER_AUDIO_BASE}${path}`;
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