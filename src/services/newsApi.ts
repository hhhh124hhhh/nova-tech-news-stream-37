
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

// 将Guardian文章转换为我们的格式
const transformGuardianArticle = (article: GuardianArticle, category: string): NewsItem => {
  const content = article.fields?.bodyText || article.fields?.trailText || '';
  const readTime = Math.ceil((content.length || 500) / 200) + '分钟';
  
  return {
    id: article.id,
    title: article.webTitle,
    summary: article.fields?.trailText || article.webTitle,
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
const fetchGuardianNews = async (query: string, category: string): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&show-fields=thumbnail,trailText,bodyText,byline&page-size=20&api-key=test`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Guardian news');
    }
    
    const data = await response.json();
    return data.response?.results?.map((article: GuardianArticle) => 
      transformGuardianArticle(article, category)
    ) || [];
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
};

export const fetchInternationalAINews = async (): Promise<NewsItem[]> => {
  return fetchGuardianNews('artificial intelligence OR AI OR ChatGPT OR OpenAI OR machine learning', '国际AI');
};

export const fetchDomesticAINews = async (): Promise<NewsItem[]> => {
  // 使用中文关键词搜索国内AI新闻
  return fetchGuardianNews('China artificial intelligence OR Baidu OR Tencent OR Alibaba AI OR Chinese AI', '国内AI');
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

  return fetchGuardianNews(keywords, category);
};
