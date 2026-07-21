// src/utils/autoTranslate.ts
export const autoTranslate = async (text: string, targetLang: string = 'en'): Promise<string> => {
  if (!text || text.trim() === '') return text;

  // Cache để tránh dịch lại cùng 1 câu nhiều lần
  const cacheKey = `trans_${targetLang}_${text}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    const translated = data[0][0][0];

    // Lưu vào localStorage để lần sau không gọi lại
    localStorage.setItem(cacheKey, translated);
    return translated;
  } catch (err) {
    console.warn('Google Translate lỗi, giữ nguyên tiếng Việt:', text);
    return text;
  }
};