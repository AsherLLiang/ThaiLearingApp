// src/entities/enums/QualityScore.enum.ts

export enum QualityScore {
  UNKNOWN = 0,    // 完全陌生
  FORGET = 1,     // 忘了
  DIFFICULT = 2,  // 很难
  FUZZY = 3,      // 模糊
  HESITATE = 4,   // 犹豫
  KNOW = 5        // 记得
}

export enum QualityButton {
  KNOW = '记得',
  FUZZY = '模糊',
  FORGET = '陌生',
}

// 映射：按钮 + 尝试次数 => 分数
export const calculateQualityScore = (button: QualityButton, attempts: number): QualityScore => {
  switch (button) {
    case QualityButton.KNOW:
      return attempts === 1 ? QualityScore.KNOW : QualityScore.HESITATE;
    case QualityButton.FUZZY:
      return attempts === 1 ? QualityScore.FUZZY : QualityScore.DIFFICULT;
    case QualityButton.FORGET:
      return QualityScore.FORGET;
    default:
      return QualityScore.UNKNOWN;
  }
};

export const QUALITY_SCORE_MAP: Record<QualityButton, number> = {
  [QualityButton.KNOW]: 5,
  [QualityButton.FUZZY]: 3,
  [QualityButton.FORGET]: 1,
};

export const ATTEMPTS_INCREMENT_MAP: Record<QualityButton, number> = {
  [QualityButton.KNOW]: 3,
  [QualityButton.FUZZY]: 1,
  [QualityButton.FORGET]: 2,
};