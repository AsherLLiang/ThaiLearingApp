// src/entities/enums/QualityScore.enum.ts

export enum QualityButton {
  KNOW = '记得',
  FUZZY = '模糊',
  FORGET = '陌生',
}

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