

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

// 专注于AI大模型的分类映射
const getCategoryFromContent = (title: string, content: string): string => {
  const text = `${title} ${content}`.toLowerCase();
  
  // 大语言模型相关关键词 - 最高优先级
  if (text.includes('gpt') || text.includes('claude') || text.includes('llm') || 
      text.includes('large language model') || text.includes('chatgpt') || 
      text.includes('openai') || text.includes('anthropic') || text.includes('gemini') ||
      text.includes('文心一言') || text.includes('通义千问') || text.includes('大语言模型') ||
      text.includes('智谱') || text.includes('moonshot') || text.includes('kimi')) {
    return '大语言模型';
  }
  
  // AI智能体相关
  if (text.includes('agent') || text.includes('assistant') || text.includes('copilot') || 
      text.includes('智能体') || text.includes('助手') || text.includes('自动化') ||
      text.includes('workflow') || text.includes('autogpt')) {
    return 'AI智能体';
  }
  
  // 多模态AI相关
  if (text.includes('multimodal') || text.includes('vision') || text.includes('image') || 
      text.includes('video') || text.includes('audio') || text.includes('speech') ||
      text.includes('多模态') || text.includes('视觉') || text.includes('图像') || 
      text.includes('视频') || text.includes('语音') || text.includes('dall-e') ||
      text.includes('midjourney') || text.includes('suno') || text.includes('runway')) {
    return '多模态AI';
  }
  
  // AI训练与技术相关
  if (text.includes('training') || text.includes('fine-tuning') || text.includes('rlhf') || 
      text.includes('reinforcement learning') || text.includes('neural network') ||
      text.includes('transformer') || text.includes('训练') || text.includes('微调') ||
      text.includes('神经网络') || text.includes('算法') || text.includes('模型架构')) {
    return 'AI训练技术';
  }
  
  // AI应用与产品相关
  if (text.includes('application') || text.includes('product') || text.includes('service') || 
      text.includes('应用') || text.includes('产品') || text.includes('服务') ||
      text.includes('commercial') || text.includes('business') || text.includes('startup')) {
    return 'AI应用产品';
  }
  
  // AI行业动态相关
  if (text.includes('funding') || text.includes('investment') || text.includes('acquisition') || 
      text.includes('partnership') || text.includes('collaboration') || text.includes('融资') ||
      text.includes('投资') || text.includes('收购') || text.includes('合作') ||
      text.includes('valuation') || text.includes('ipo') || text.includes('competition')) {
    return 'AI行业动态';
  }
  
  // 默认为大语言模型
  return '大语言模型';
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
const fetchGuardianNews = async (query: string): Promise<NewsItem[]> => {
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

// 主要获取AI大模型相关新闻
export const fetchAINews = async (): Promise<NewsItem[]> => {
  return fetchGuardianNews('artificial intelligence OR AI OR "large language model" OR LLM OR ChatGPT OR GPT OR Claude OR Gemini OR "machine learning" OR "deep learning" OR OpenAI OR Anthropic OR Google AI OR "neural network" OR transformer OR "AI model"');
};

export const fetchInternationalAINews = async (): Promise<NewsItem[]> => {
  return fetchGuardianNews('OpenAI OR Anthropic OR "Google AI" OR Microsoft AI OR ChatGPT OR Claude OR Gemini OR "AI research" OR "artificial intelligence" international');
};

export const fetchDomesticAINews = async (): Promise<NewsItem[]> => {
  return fetchGuardianNews('China AI OR Baidu OR Tencent OR Alibaba AI OR ByteDance OR "Chinese artificial intelligence" OR "China technology"');
};

// 根据分类获取特定新闻
export const fetchCategoryNews = async (category: string): Promise<NewsItem[]> => {
  const categoryKeywords: Record<string, string> = {
    '大语言模型': 'ChatGPT OR GPT OR Claude OR Gemini OR "large language model" OR LLM OR "language model" OR OpenAI OR Anthropic',
    'AI智能体': 'AI agent OR assistant OR copilot OR "autonomous agent" OR AutoGPT OR "AI automation"',
    '多模态AI': 'multimodal AI OR "computer vision" OR "image generation" OR "video AI" OR DALL-E OR Midjourney OR Suno',
    'AI训练技术': 'AI training OR "machine learning" OR "neural network" OR transformer OR "fine-tuning" OR RLHF',
    'AI应用产品': 'AI application OR "AI product" OR "AI service" OR "AI startup" OR "commercial AI"',
    'AI行业动态': 'AI funding OR "AI investment" OR "AI acquisition" OR "AI partnership" OR "AI market"'
  };

  const keywords = categoryKeywords[category];
  if (!keywords) return [];

  return fetchGuardianNews(keywords);
};

