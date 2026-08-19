export const LANGUAGES = ["ja", "en"] as const;

export type Lang = (typeof LANGUAGES)[number];

export const dictionaries = {
  ja: {
    navigation: {
      travel: "Travel",
      gallery: "Gallery",
      about: "デザイナー",
      contact: "お問い合わせ",
    },
    languageSwitcher: "言語を切り替える",
    gallery: {
      title: "Gallery",
      searchLabel: "作品を検索",
      searchPlaceholder: "タイトルで検索",
      categoriesLabel: "カテゴリ",
      clearFilters: "絞り込みを解除",
      resultCount: (count: number) => `${count}件の作品`,
      empty: "条件に一致する作品がありません。",
    },
    contact: {
      title: "お問い合わせ",
      fields: {
        firstName: "名",
        lastName: "姓",
        email: "メールアドレス",
        phone: "電話番号（任意）",
        message: "お問い合わせ内容",
      },
      placeholders: {
        firstName: "花",
        lastName: "村上",
        email: "name@example.com",
        phone: "+81 90 1234 5678",
        message: "お問い合わせ内容をご入力ください",
      },
      submit: "送信する",
      sending: "送信中…",
      sent: "送信しました。お問い合わせありがとうございます。",
      failed: "送信できませんでした。時間をおいてもう一度お試しください。",
      verificationUnavailable: "現在、送信確認機能を利用できません。",
      errors: {
        required: "入力してください。",
        too_long: "入力できる文字数を超えています。",
        invalid: "入力内容を確認してください。",
      },
    },
  },
  en: {
    navigation: {
      travel: "Travel",
      gallery: "Gallery",
      about: "Designer",
      contact: "Contact",
    },
    languageSwitcher: "Switch language",
    gallery: {
      title: "Gallery",
      searchLabel: "Search works",
      searchPlaceholder: "Search by title",
      categoriesLabel: "Categories",
      clearFilters: "Clear filters",
      resultCount: (count: number) => `${count} ${count === 1 ? "work" : "works"}`,
      empty: "No works match these filters.",
    },
    contact: {
      title: "Contact Us",
      fields: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email address",
        phone: "Phone (optional)",
        message: "Message",
      },
      placeholders: {
        firstName: "Hana",
        lastName: "Murakami",
        email: "name@example.com",
        phone: "+61 400 000 000",
        message: "How can we help?",
      },
      submit: "Submit",
      sending: "Sending…",
      sent: "Sent. Thank you for your message.",
      failed: "Your message could not be sent. Please try again later.",
      verificationUnavailable: "Contact verification is temporarily unavailable.",
      errors: {
        required: "This field is required.",
        too_long: "This value is too long.",
        invalid: "Check this value and try again.",
      },
    },
  },
} as const;

export function isLang(value: string): value is Lang {
  return LANGUAGES.some((lang) => lang === value);
}

export function getDictionary(lang: Lang) {
  return dictionaries[lang];
}

export function switchPathLanguage(pathname: string, targetLang: Lang): string {
  return /^\/(?:ja|en)(?=\/|$)/u.test(pathname)
    ? pathname.replace(/^\/(?:ja|en)(?=\/|$)/u, `/${targetLang}`)
    : `/${targetLang}`;
}
