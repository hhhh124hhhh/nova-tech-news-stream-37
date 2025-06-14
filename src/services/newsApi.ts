
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

const NEWS_API_KEY = 'demo'; // 用户需要替换为真实的API密钥

// 将NewsAPI文章转换为我们的格式
const transformArticle = (article: NewsApiArticle, category: string): NewsItem => {
  const readTime = Math.ceil((article.content?.length || 500) / 200) + '分钟';
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: article.title,
    summary: article.description || article.content?.substring(0, 200) + '...' || '',
    content: article.content || article.description || '暂无完整内容',
    author: article.author || article.source.name || '未知',
    publishDate: new Date(article.publishedAt).toLocaleDateString('zh-CN'),
    category,
    imageUrl: article.urlToImage,
    readTime,
    source: article.source.name
  };
};

export const fetchInternationalAINews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=artificial+intelligence+OR+AI+OR+ChatGPT+OR+OpenAI&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch international news');
    }
    
    const data = await response.json();
    return data.articles?.map((article: NewsApiArticle) => 
      transformArticle(article, '国际AI')
    ) || [];
  } catch (error) {
    console.error('Error fetching international AI news:', error);
    return [];
  }
};

export const fetchDomesticAINews = async (): Promise<NewsItem[]> => {
  try {
    // 使用中文关键词搜索国内AI新闻
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=人工智能+OR+AI+OR+百度+OR+腾讯+OR+阿里巴巴&language=zh&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch domestic news');
    }
    
    const data = await response.json();
    return data.articles?.map((article: NewsApiArticle) => 
      transformArticle(article, '国内AI')
    ) || [];
  } catch (error) {
    console.error('Error fetching domestic AI news:', error);
    return [];
  }
};

export const fetchCategoryNews = async (category: string): Promise<NewsItem[]> => {
  const categoryKeywords: Record<string, string> = {
    'AI智能体': 'AI+agent+OR+chatbot+OR+assistant',
    'AI视频': 'AI+video+OR+Runway+OR+Pika',
    'AI绘画': 'AI+art+OR+Midjourney+OR+DALL-E+OR+Stable+Diffusion',
    '大语言模型': 'large+language+model+OR+LLM+OR+GPT+OR+Claude'
  };

  const keywords = categoryKeywords[category];
  if (!keywords) return [];

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${keywords}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} news`);
    }
    
    const data = await response.json();
    return data.articles?.map((article: NewsApiArticle) => 
      transformArticle(article, category)
    ) || [];
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
};
