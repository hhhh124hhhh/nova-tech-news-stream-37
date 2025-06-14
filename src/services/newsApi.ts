
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

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;

// AI大模型相关关键词映射到分类
const categoryKeywords = {
  '大语言模型': ['gpt', 'chatgpt', 'claude', 'gemini', 'llm', 'language model', 'transformer', 'bert', 'openai', 'anthropic', 'palm', 'llama'],
  'AI智能体': ['agent', 'assistant', 'chatbot', 'ai agent', 'virtual assistant', 'conversational ai', 'autogpt', 'langchain'],
  '多模态AI': ['multimodal', 'vision', 'dall-e', 'midjourney', 'stable diffusion', 'clip', 'text-to-image', 'image generation', 'computer vision'],
  'AI训练技术': ['training', 'fine-tuning', 'reinforcement learning', 'rlhf', 'dataset', 'model training', 'neural network', 'deep learning'],
  'AI应用产品': ['copilot', 'ai tool', 'productivity', 'automation', 'ai application', 'ai software', 'ai service'],
  'AI行业动态': ['funding', 'investment', 'startup', 'company', 'acquisition', 'partnership', 'regulation', 'policy', 'market'],
  'AI绘画': ['dall-e', 'midjourney', 'stable diffusion', 'ai art', 'image generation', 'art generation', 'creative ai', 'digital art', 'ai painting'],
  'AI视频': ['sora', 'runway', 'video generation', 'ai video', 'video synthesis', 'deepfake', 'video ai', 'motion graphics'],
  'AI编程': ['copilot', 'code generation', 'programming assistant', 'ai coding', 'github copilot', 'cursor', 'replit', 'ai developer tools', 'code ai']
};

// 智能分类函数
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  // 检查每个分类的关键词
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  // 默认分类
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
    return 'AI行业动态';
  }
  
  return 'AI行业动态';
};

// 从NewsAPI获取AI相关新闻
const fetchNewsAPIData = async (): Promise<NewsItem[]> => {
  if (!API_KEY) {
    console.log('NewsAPI密钥未设置');
    return [];
  }

  try {
    // AI大模型相关搜索关键词
    const aiKeywords = [
      'ChatGPT OR OpenAI OR GPT-4',
      'Claude OR Anthropic',
      'Gemini OR Bard OR Google AI',
      'AI agent OR AI assistant',
      'DALL-E OR Midjourney OR "AI art"',
      'Sora OR "AI video"',
      'GitHub Copilot OR "AI programming"',
      'LLM OR "large language model"',
      'multimodal AI',
      'machine learning OR deep learning'
    ];

    const allNews: NewsItem[] = [];

    for (const keyword of aiKeywords.slice(0, 3)) { // 限制请求数量
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        console.error(`NewsAPI请求失败: ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      if (data.articles) {
        const newsItems: NewsItem[] = data.articles
          .filter((article: any) => 
            article.title && 
            article.description && 
            !article.title.includes('[Removed]') &&
            !article.description.includes('[Removed]')
          )
          .map((article: any) => ({
            id: article.url || `news-${Date.now()}-${Math.random()}`,
            title: article.title,
            summary: article.description,
            content: article.content || article.description,
            author: article.author || article.source?.name || '未知作者',
            publishDate: new Date(article.publishedAt).toLocaleDateString('zh-CN'),
            category: categorizeNews(article.title, article.description),
            imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
            readTime: '3分钟',
            source: article.source?.name || 'NewsAPI'
          }));

        allNews.push(...newsItems);
      }
    }

    return allNews;
  } catch (error) {
    console.error('获取NewsAPI数据时出错:', error);
    return [];
  }
};

// 从Guardian API获取AI相关新闻
const fetchGuardianNews = async (apiKey?: string): Promise<NewsItem[]> => {
  if (!GUARDIAN_API_KEY && !apiKey) {
    console.log('Guardian API密钥未设置');
    return [];
  }

  try {
    const response = await fetch(
      `https://content.guardianapis.com/search?q=artificial%20intelligence%20OR%20machine%20learning%20OR%20ChatGPT%20OR%20OpenAI&show-fields=headline,body,thumbnail&page-size=20&api-key=${GUARDIAN_API_KEY || apiKey}`
    );

    if (!response.ok) {
      console.error(`Guardian API请求失败: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data.response?.results) {
      return data.response.results.map((article: any) => ({
        id: article.id,
        title: article.fields?.headline || article.webTitle,
        summary: article.fields?.body ? article.fields.body.substring(0, 200) + '...' : article.webTitle,
        content: article.fields?.body || article.webTitle,
        author: '卫报',
        publishDate: new Date(article.webPublicationDate).toLocaleDateString('zh-CN'),
        category: categorizeNews(article.webTitle, article.fields?.body || ''),
        imageUrl: article.fields?.thumbnail || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
        readTime: '4分钟',
        source: 'The Guardian'
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Guardian新闻时出错:', error);
    return [];
  }
};

// 主要的新闻获取函数
export const fetchAINews = async (): Promise<NewsItem[]> => {
  try {
    console.log('开始获取AI大模型新闻数据...');
    
    const [newsAPIData, guardianData] = await Promise.all([
      fetchNewsAPIData(),
      fetchGuardianNews()
    ]);

    const allNews = [...newsAPIData, ...guardianData];
    
    // 去重和排序
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.title === news.title)
    );

    console.log(`获取到 ${uniqueNews.length} 条AI大模型新闻`);
    return uniqueNews;

  } catch (error) {
    console.error('获取AI大模型新闻时出错:', error);
    return [];
  }
};
