
export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
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

// 将GNews文章转换为我们的格式
const transformGNewsArticle = (article: GNewsArticle, category: string): NewsItem => {
  const content = article.content || article.description || '';
  const readTime = Math.ceil((content.length || 500) / 200) + '分钟';
  
  return {
    id: `gnews-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: article.title,
    summary: article.description || article.title,
    content: content || '点击阅读完整内容',
    author: article.source.name,
    publishDate: new Date(article.publishedAt).toLocaleDateString('zh-CN'),
    category,
    imageUrl: article.image,
    readTime,
    source: article.source.name
  };
};

// GNews API 请求函数
const fetchGNews = async (query: string, category: string): Promise<NewsItem[]> => {
  try {
    // 注意：用户需要在 https://gnews.io/ 申请免费API密钥
    const API_KEY = 'your-gnews-api-key-here'; // 用户需要替换
    
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=20&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch GNews');
    }
    
    const data = await response.json();
    return data.articles?.map((article: GNewsArticle) => 
      transformGNewsArticle(article, category)
    ) || [];
  } catch (error) {
    console.error(`Error fetching ${category} news from GNews:`, error);
    return [];
  }
};

export const fetchInternationalAINewsFromGNews = async (): Promise<NewsItem[]> => {
  return fetchGNews('artificial intelligence OR AI OR ChatGPT OR OpenAI', '国际AI');
};

export const fetchDomesticAINewsFromGNews = async (): Promise<NewsItem[]> => {
  return fetchGNews('China AI OR Baidu OR Tencent OR Alibaba artificial intelligence', '国内AI');
};

export const fetchCategoryNewsFromGNews = async (category: string): Promise<NewsItem[]> => {
  const categoryKeywords: Record<string, string> = {
    'AI智能体': 'AI agent OR chatbot OR virtual assistant',
    'AI视频': 'AI video OR Runway OR Pika Labs',
    'AI绘画': 'AI art OR Midjourney OR DALL-E OR Stable Diffusion',
    '大语言模型': 'large language model OR LLM OR GPT OR Claude'
  };

  const keywords = categoryKeywords[category];
  if (!keywords) return [];

  return fetchGNews(keywords, category);
};
