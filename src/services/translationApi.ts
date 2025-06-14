
export interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

// 内存中的翻译缓存
const translationCache: TranslationCache = {};

// 生成更吸引人的摘要
const generateAttractiveDescription = (originalSummary: string, title: string, targetLang: string): string => {
  // AI相关的吸引性词汇和短语
  const attractivePhrases = {
    zh: [
      "🚀 突破性进展！",
      "💡 创新亮点：",
      "🔥 热门话题：",
      "⚡ 最新突破：",
      "🌟 重磅消息：",
      "🎯 核心看点：",
      "📈 行业变革：",
      "🧠 智能革命："
    ],
    en: [
      "🚀 Breakthrough Alert!",
      "💡 Innovation Spotlight:",
      "🔥 Trending Now:",
      "⚡ Latest Breakthrough:",
      "🌟 Major Update:",
      "🎯 Key Highlights:",
      "📈 Industry Game-Changer:",
      "🧠 AI Revolution:"
    ],
    ja: [
      "🚀 画期的な進歩！",
      "💡 革新のハイライト：",
      "🔥 話題沸騰：",
      "⚡ 最新の突破：",
      "🌟 重大ニュース：",
      "🎯 注目ポイント：",
      "📈 業界変革：",
      "🧠 AI革命："
    ],
    ko: [
      "🚀 혁신적 돌파구!",
      "💡 혁신 하이라이트:",
      "🔥 화제의 중심:",
      "⚡ 최신 돌파구:",
      "🌟 중대 발표:",
      "🎯 핵심 포인트:",
      "📈 업계 변혁:",
      "🧠 AI 혁명:"
    ]
  };

  const phrases = attractivePhrases[targetLang as keyof typeof attractivePhrases] || attractivePhrases.zh;
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  
  // 增强摘要的吸引力
  let enhancedSummary = originalSummary;
  
  // 如果摘要较短，添加吸引性前缀
  if (enhancedSummary.length < 100) {
    enhancedSummary = `${randomPhrase} ${enhancedSummary}`;
  }
  
  // 添加相关的吸引性结尾
  const endings = {
    zh: ["了解更多最新动态！", "探索AI的无限可能！", "引领科技新潮流！"],
    en: ["Stay ahead of the curve!", "Explore limitless AI possibilities!", "Leading the tech revolution!"],
    ja: ["最新動向をチェック！", "AIの無限の可能性を探求！", "テック革命をリード！"],
    ko: ["최신 동향을 확인하세요!", "AI의 무한한 가능성을 탐험!", "기술 혁명을 선도!"]
  };
  
  const endingPhrases = endings[targetLang as keyof typeof endings] || endings.zh;
  const randomEnding = endingPhrases[Math.floor(Math.random() * endingPhrases.length)];
  
  if (enhancedSummary.length < 150) {
    enhancedSummary += ` ${randomEnding}`;
  }
  
  return enhancedSummary;
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

  // AI大模型相关的专业翻译
  let translatedText = text;
  
  if (targetLang === 'en') {
    const translations: { [key: string]: string } = {
      '大语言模型': 'Large Language Models',
      'AI智能体': 'AI Agents',
      '多模态AI': 'Multimodal AI',
      'AI训练技术': 'AI Training Technology',
      'AI应用产品': 'AI Applications & Products',
      'AI行业动态': 'AI Industry News',
      'AI绘画': 'AI Art Generation',
      'AI视频': 'AI Video',
      'AI编程': 'AI Programming',
      '全部': 'All',
      '最新资讯': 'Latest News',
      '当前时间': 'Current Time',
      '实时更新': 'Live Updates',
      '正在使用演示数据': 'Using Demo Data',
      '阅读更多': 'Read More',
      '分钟': 'min',
      '人工智能': 'Artificial Intelligence',
      '机器学习': 'Machine Learning',
      '深度学习': 'Deep Learning',
      '自然语言处理': 'Natural Language Processing',
      '神经网络': 'Neural Networks',
      '算法优化': 'Algorithm Optimization',
      '计算机视觉': 'Computer Vision',
      '图像生成': 'Image Generation',
      '视频生成': 'Video Generation',
      '代码生成': 'Code Generation',
      '自动编程': 'Automated Programming'
    };
    
    for (const [chinese, english] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(chinese, 'g'), english);
    }
  } else if (targetLang === 'ja') {
    const translations: { [key: string]: string } = {
      '大语言模型': '大規模言語モデル',
      'AI智能体': 'AIエージェント',
      '多模态AI': 'マルチモーダルAI',
      'AI训练技术': 'AI訓練技術',
      'AI应用产品': 'AIアプリケーション・製品',
      'AI行业动态': 'AI業界ニュース',
      'AI绘画': 'AI画像生成',
      'AI视频': 'AI動画',
      'AI编程': 'AIプログラミング',
      '全部': 'すべて',
      '最新资讯': '最新ニュース',
      '当前时间': '現在時刻',
      '实时更新': 'リアルタイム更新',
      '正在使用演示数据': 'デモデータを使用中',
      '阅读更多': '続きを読む',
      '分钟': '分',
      '人工智能': '人工知能',
      '机器学习': '機械学習',
      '深度学习': 'ディープラーニング',
      '计算机视觉': 'コンピュータビジョン',
      '图像生成': '画像生成',
      '视频生成': '動画生成',
      '代码生成': 'コード生成',
      '自动编程': '自動プログラミング'
    };
    
    for (const [chinese, japanese] of Object.entries(translations)) {
      translatedText = translatedText.replace(new RegExp(chinese, 'g'), japanese);
    }
  } else if (targetLang === 'ko') {
    const translations: { [key: string]: string } = {
      '大语言模型': '대규모 언어 모델',
      'AI智能体': 'AI 에이전트',
      '多模态AI': '멀티모달 AI',
      'AI训练技术': 'AI 훈련 기술',
      'AI应用产品': 'AI 애플리케이션 및 제품',
      'AI行业动态': 'AI 업계 뉴스',
      'AI绘画': 'AI 그림 생성',
      'AI视频': 'AI 비디오',
      'AI编程': 'AI 프로그래밍',
      '全部': '전체',
      '最新资讯': '최신 뉴스',
      '当前时间': '현재 시간',
      '实时更新': '실시간 업데이트',
      '正在使用演示数据': '데모 데이터 사용 중',
      '阅读更多': '더 읽기',
      '分钟': '분',
      '人工智能': '인공지능',
      '机器学习': '머신러닝',
      '深度学习': '딥러닝',
      '计算机视觉': '컴퓨터 비전',
      '图像生成': '이미지 생성',
      '视频生成': '비디오 생성',
      '代码생成': '코드 생성',
      '自动编程': '자동 프로그래밍'
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
    // 即使是中文，也要生成更吸引人的摘要
    const enhancedSummary = generateAttractiveDescription(newsItem.summary, newsItem.title, 'zh');
    return {
      ...newsItem,
      summary: enhancedSummary
    };
  }

  const [translatedTitle, translatedSummary, translatedCategory] = await Promise.all([
    translateText(newsItem.title, targetLang),
    translateText(newsItem.summary, targetLang),
    translateText(newsItem.category, targetLang)
  ]);

  // 生成更吸引人的翻译摘要
  const enhancedSummary = generateAttractiveDescription(translatedSummary, translatedTitle, targetLang);

  return {
    ...newsItem,
    title: translatedTitle,
    summary: enhancedSummary,
    category: translatedCategory
  };
};
