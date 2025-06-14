
export interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  urlToImage: string;
  source: {
    name: string;
  };
  url: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
  source: string;
}

// Guardian API 文章接口
interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    bodyText?: string;
    byline?: string;
  };
  sectionName: string;
}

// 重新定义分类映射，基于内容而非固定分类
const getCategoryFromContent = (title: string, content: string): string => {
  const text = `${title} ${content}`.toLowerCase();
  
  // AI智能体相关关键词
  if (text.includes('agent') || text.includes('assistant') || text.includes('chatbot') || 
      text.includes('智能体') || text.includes('助手') || text.includes('机器人')) {
    return 'AI智能体';
  }
  
  // 计算机视觉相关
  if (text.includes('vision') || text.includes('image') || text.includes('visual') || 
      text.includes('视觉') || text.includes('图像') || text.includes('视频')) {
    return '计算机视觉';
  }
  
  // 自然语言处理相关
  if (text.includes('language') || text.includes('nlp') || text.includes('text') || 
      text.includes('语言') || text.includes('文本') || text.includes('对话')) {
    return '自然语言处理';
  }
  
  // 机器学习相关
  if (text.includes('machine learning') || text.includes('ml') || text.includes('model') || 
      text.includes('机器学习') || text.includes('模型') || text.includes('训练')) {
    return '机器学习';
  }
  
  // 深度学习相关
  if (text.includes('deep learning') || text.includes('neural') || text.includes('深度学习') || 
      text.includes('神经') || text.includes('网络')) {
    return '深度学习';
  }
  
  // 默认为人工智能
  return '人工智能';
};

// 将Guardian文章转换为我们的格式
const transformGuardianArticle = (article: GuardianArticle): NewsItem => {
  const content = article.fields?.bodyText || article.fields?.trailText || '';
  const readTime = Math.ceil((content.length || 500) / 200) + '分钟';
  const category = getCategoryFromContent(article.webTitle, content);
  
  return {
    id: article.id,
    title: article.webTitle,
    summary: article.fields?.trailText || article.webTitle.substring(0, 150) + '...',
    content: content || '点击阅读完整内容',
    author: article.fields?.byline || 'The Guardian',
    publishDate: new Date(article.webPublicationDate).toLocaleDateString('zh-CN'),
    category,
    imageUrl: article.fields?.thumbnail,
    readTime,
    source: 'The Guardian'
  };
};

// 获取Guardian API新闻
const fetchGuardianNews = async (query: string, categoryHint?: string): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&show-fields=thumbnail,trailText,bodyText,byline&page-size=30&api-key=test`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Guardian news');
    }
    
    const data = await response.json();
    return data.response?.results?.map((article: GuardianArticle) => 
      transformGuardianArticle(article)
    ) || [];
  } catch (error) {
    console.error('Error fetching AI news:', error);
    return [];
  }
};

export const fetchAINews = async (): Promise<NewsItem[]> => {
  return fetchGuardianNews('artificial intelligence OR AI OR ChatGPT OR OpenAI OR machine learning OR deep learning OR neural network OR computer vision OR natural language processing');
};

export const fetchInternationalAINews = async (): Promise<NewsItem[]> => {
  return fetchGuardianNews('artificial intelligence OR AI OR ChatGPT OR OpenAI OR machine learning');
};

export const fetchDomesticAINews = async (): Promise<NewsItem[]> => {
  // 使用中文关键词搜索国内AI新闻
  return fetchGuardianNews('China artificial intelligence OR Baidu OR Tencent OR Alibaba AI OR Chinese AI');
};

export const fetchCategoryNews = async (category: string): Promise<NewsItem[]> => {
  const categoryKeywords: Record<string, string> = {
    'AI智能体': 'AI agent OR chatbot OR virtual assistant OR AI assistant',
    'AI视频': 'AI video OR Runway AI OR Pika Labs OR video generation',
    'AI绘画': 'AI art OR Midjourney OR DALL-E OR Stable Diffusion OR image generation',
    '大语言模型': 'large language model OR LLM OR GPT OR Claude OR language model'
  };

  const keywords = categoryKeywords[category];
  if (!keywords) return [];

  return fetchGuardianNews(keywords);
};
