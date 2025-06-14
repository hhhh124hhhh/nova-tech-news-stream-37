
export interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

// 内存中的翻译缓存
const translationCache: TranslationCache = {};

// 语言代码映射
const languageMap: { [key: string]: string } = {
  zh: 'zh',
  en: 'en',
  ja: 'ja',
  ko: 'ko'
};

// 模拟翻译API（实际项目中可以使用Google Translate API或其他翻译服务）
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  // 如果是中文，直接返回
  if (targetLang === 'zh') {
    return text;
  }

  // 检查缓存
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey][targetLang];
  }

  // 模拟翻译延迟
  await new Promise(resolve => setTimeout(resolve, 100));

  // 简单的模拟翻译（实际项目中应该调用真实的翻译API）
  let translatedText = text;
  
  if (targetLang === 'en') {
    // 简单的中英对照
    const translations: { [key: string]: string } = {
      '人工智能': 'Artificial Intelligence',
      '机器学习': 'Machine Learning',
      '深度学习': 'Deep Learning',
      '自然语言处理': 'Natural Language Processing',
      '计算机视觉': 'Computer Vision',
      '全部': 'All',
      '最新资讯': 'Latest News',
      '当前时间': 'Current Time',
      '实时更新': 'Live Updates',
      '正在使用演示数据': 'Using Demo Data',
      '阅读更多': 'Read More',
      '分钟': 'min'
    };
    
    for (const [chinese, english] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(chinese, 'g'), english);
    }
  } else if (targetLang === 'ja') {
    const translations: { [key: string]: string } = {
      '人工智能': '人工知能',
      '机器学习': '機械学習',
      '深度学习': 'ディープラーニング',
      '自然语言处理': '自然言語処理',
      '计算机视觉': 'コンピュータビジョン',
      '全部': 'すべて',
      '最新资讯': '最新ニュース',
      '当前时间': '現在時刻',
      '实时更新': 'リアルタイム更新',
      '正在使用演示数据': 'デモデータを使用中',
      '阅读更多': '続きを読む',
      '分钟': '分'
    };
    
    for (const [chinese, japanese] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(chinese, 'g'), japanese);
    }
  } else if (targetLang === 'ko') {
    const translations: { [key: string]: string } = {
      '人工智能': '인공지능',
      '机器学习': '머신러닝',
      '深度学习': '딥러닝',
      '自然语言处理': '자연어처리',
      '计算机视觉': '컴퓨터 비전',
      '全部': '전체',
      '最新资讯': '최신 뉴스',
      '当前时间': '현재 시간',
      '实时更新': '실시간 업데이트',
      '正在使用演示数据': '데모 데이터 사용 중',
      '阅读更多': '더 읽기',
      '分钟': '분'
    };
    
    for (const [chinese, korean] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(chinese, 'g'), korean);
    }
  }

  // 缓存翻译结果
  if (!translationCache[cacheKey]) {
    translationCache[cacheKey] = {};
  }
  translationCache[cacheKey][targetLang] = translatedText;

  return translatedText;
};

// 批量翻译新闻内容
export const translateNewsItem = async (newsItem: any, targetLang: string) => {
  if (targetLang === 'zh') {
    return newsItem;
  }

  const [translatedTitle, translatedSummary, translatedCategory] = await Promise.all([
    translateText(newsItem.title, targetLang),
    translateText(newsItem.summary, targetLang),
    translateText(newsItem.category, targetLang)
  ]);

  return {
    ...newsItem,
    title: translatedTitle,
    summary: translatedSummary,
    category: translatedCategory
  };
};
