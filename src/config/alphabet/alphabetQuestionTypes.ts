// src/components/alphabet/alphabetQuestionTypes.ts

export type AlphabetQuestionType =
  | 'soundToLetter'   // 听音 → 选字母
  | 'letterToSound'   // 看字母 → 选发音
  | 'reading';        // 看音节/词 → 选读音（拼读）

export interface AlphabetQuestionOption {
  id: string;
  label: string;        // 展示给用户的文字（字母 or 发音）
  helper?: string;      // 可选辅助说明（如 IPA / 中文提示）
}

export interface AlphabetReviewQuestion {
  id: string;
  type: AlphabetQuestionType;
  prompt: string;
  audioUrl?: string;    // 听音题用
  mainText?: string;    // 主体展示（字母/音节/词）
  options: AlphabetQuestionOption[];
  correctOptionId: string;
  explanation?: string; // 回答后显示的拼读规则说明
}
