// src/entities/enum/QualityScore.enum.ts

export enum QualityButton {
  KNOW = '认识',
  FUZZY = '模糊',
  FORGET = '忘记',
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