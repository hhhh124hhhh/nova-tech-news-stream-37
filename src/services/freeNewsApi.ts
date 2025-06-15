
import { NewsItem, unifyCategory } from "./newsApi";
import { fetchAdditionalFreeContent } from "./additionalFreeApi";

// 免费新闻API配置
const DEMO_API_CONFIG = {
  // Guardian API（免费，无需注册）
  guardian: 'https://content.guardianapis.com/search?q=business%20OR%20finance%20OR%20economy&show-fields=thumbnail,trailText&page-size=15&api-key=test',
  guardianTech: 'https://content.guardianapis.com/search?q=technology&show-fields=thumbnail,trailText&page-size=10&api-key=test',
  guardianSports: 'https://content.guardianapis.com/search?q=sport&show-fields=thumbnail,trailText&page-size=10&api-key=test',
  // HackerNews API（完全免费）
  hackerNews: 'https://hn.algolia.com/api/v1/search?query=technology%20OR%20business%20OR%20science&tags=story&hitsPerPage=15',
  // CoinGecko API for crypto/finance news
  cryptoNews: 'https://api.coingecko.com/api/v3/news',
  // Alpha Vantage (有免费层)
  alphaVantage: 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=demo'
};

// 智能分类函数 - 更全面的关键词匹配
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  const categoryKeywords = {
    '国际': ['international', 'global', 'world', 'foreign', 'overseas', 'diplomatic', 'embassy', 'summit', 'treaty', '国际', '全球', '世界', '外交', '峰会', '条约', '大使馆', '联合国'],
    '科技': ['technology', 'tech', 'innovation', 'digital', 'internet', 'software', 'hardware', 'startup', 'app', '科技', '技术', '创新', '数字', '互联网', '软件', '硬件', '应用', '创业公司', 'artificial intelligence', 'machine learning', 'blockchain'],
    '财经': ['business', 'finance', 'economy', 'market', 'stock', 'investment', 'banking', 'trading', 'economic', '财经', '经济', '金融', '市场', '股票', '投资', '银行', '贸易', '货币', 'GDP', '通胀', '利率', 'cryptocurrency', 'bitcoin', 'ethereum', 'forex', 'nasdaq', 'dow', 'ftse'],
    '体育': ['sports', 'football', 'basketball', 'soccer', 'olympic', 'athlete', 'championship', 'tournament', 'game', '体育', '足球', '篮球', '奥运', '运动员', '比赛', '锦标赛', '世界杯', 'NBA', 'FIFA', '马拉松', 'premier league', 'champions league'],
    '娱乐': ['entertainment', 'celebrity', 'movie', 'music', 'film', 'actor', 'actress', 'concert', 'album', '娱乐', '明星', '电影', '音乐', '演员', '演唱会', '专辑', '导演', '票房', 'Hollywood', '好莱坞', 'netflix', 'disney', 'streaming'],
    '健康': ['health', 'medical', 'medicine', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine', 'wellness', '健康', '医疗', '医学', '医生', '医院', '疾病', '治疗', '疫苗', '养生', '药物', '临床', '手术', 'pandemic', 'covid', 'virus'],
    '教育': ['education', 'school', 'university', 'student', 'teacher', 'learning', 'academic', 'scholarship', 'degree', '教育', '学校', '大学', '学生', '教师', '学习', '学术', '奖学金', '学位', '考试', '招生'],
    '政治': ['politics', 'government', 'election', 'president', 'minister', 'parliament', 'congress', 'policy', 'law', '政治', '政府', '选举', '总统', '部长', '议会', '国会', '政策', '法律', '立法', '投票'],
    '社会': ['society', 'social', 'community', 'culture', 'lifestyle', 'environment', 'climate', 'population', 'crime', '社会', '社区', '文化', '生活', '环境', '气候', '人口', '犯罪', '慈善', '公益', '民生']
  };

  let bestCategory = '社会';
  let maxScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        if (title.toLowerCase().includes(keyword.toLowerCase())) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
};

// 获取Guardian新闻 - 财经版本
const fetchGuardianBusinessNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Guardian财经新闻...');
    const response = await fetch(DEMO_API_CONFIG.guardian);
    
    if (!response.ok) {
      throw new Error(`Guardian API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response?.results) {
      return data.response.results.map((item: any) => ({
        id: `guardian-biz-${item.id}`,
        title: item.webTitle,
        summary: item.fields?.trailText || item.webTitle,
        content: item.fields?.trailText || item.webTitle,
        author: 'The Guardian',
        publishDate: new Date(item.webPublicationDate).toLocaleDateString('zh-CN'),
        category: '财经',
        imageUrl: item.fields?.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
        readTime: '4分钟',
        source: 'The Guardian',
        originalUrl: item.webUrl
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Guardian财经新闻时出错:', error);
    return [];
  }
};

// 获取Guardian科技新闻
const fetchGuardianTechNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Guardian科技新闻...');
    const response = await fetch(DEMO_API_CONFIG.guardianTech);
    
    if (!response.ok) {
      throw new Error(`Guardian Tech API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response?.results) {
      return data.response.results.map((item: any) => ({
        id: `guardian-tech-${item.id}`,
        title: item.webTitle,
        summary: item.fields?.trailText || item.webTitle,
        content: item.fields?.trailText || item.webTitle,
        author: 'The Guardian',
        publishDate: new Date(item.webPublicationDate).toLocaleDateString('zh-CN'),
        category: '科技',
        imageUrl: item.fields?.thumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
        readTime: '3分钟',
        source: 'The Guardian',
        originalUrl: item.webUrl
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Guardian科技新闻时出错:', error);
    return [];
  }
};

// 获取Guardian体育新闻
const fetchGuardianSportsNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Guardian体育新闻...');
    const response = await fetch(DEMO_API_CONFIG.guardianSports);
    
    if (!response.ok) {
      throw new Error(`Guardian Sports API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response?.results) {
      return data.response.results.map((item: any) => ({
        id: `guardian-sports-${item.id}`,
        title: item.webTitle,
        summary: item.fields?.trailText || item.webTitle,
        content: item.fields?.trailText || item.webTitle,
        author: 'The Guardian',
        publishDate: new Date(item.webPublicationDate).toLocaleDateString('zh-CN'),
        category: '体育',
        imageUrl: item.fields?.thumbnail || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        readTime: '3分钟',
        source: 'The Guardian',
        originalUrl: item.webUrl
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Guardian体育新闻时出错:', error);
    return [];
  }
};

// 获取HackerNews的新闻
const fetchHackerNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取HackerNews新闻...');
    const response = await fetch(DEMO_API_CONFIG.hackerNews);
    
    if (!response.ok) {
      throw new Error(`HackerNews API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.hits) {
      return data.hits
        .filter((item: any) => item.title && item.url)
        .map((item: any) => ({
          id: `hn-${item.objectID}`,
          title: item.title,
          summary: item.story_text || item.title,
          content: item.story_text || item.title,
          author: item.author || 'HackerNews',
          publishDate: new Date(item.created_at).toLocaleDateString('zh-CN'),
          category: categorizeNews(item.title, item.story_text || ''),
          imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
          readTime: '3分钟',
          source: 'HackerNews',
          originalUrl: item.url
        }));
    }

    return [];
  } catch (error) {
    console.error('获取HackerNews新闻时出错:', error);
    return [];
  }
};

// 生成更多财经相关模拟数据
const generateFinanceNews = (): NewsItem[] => {
  const financeNews = [
    {
      id: 'finance-mock-1',
      title: '全球股市强劲反弹，科技股领涨',
      summary: '🚀 投资亮点：全球主要股指创新高，科技板块表现突出。美股纳斯达克指数涨幅超过2%，欧洲股市同步上涨。投资者信心增强，市场流动性充足，专家预测牛市行情将延续！',
      content: '全球股市迎来强劲反弹，主要股指纷纷创下新高。科技板块表现尤为突出，带动整体市场上涨。投资者对经济复苏前景充满信心。',
      author: '财经快报',
      publishDate: new Date().toLocaleDateString('zh-CN'),
      category: '财经',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      readTime: '4分钟',
      source: '全球财经网',
      originalUrl: 'https://example.com/stock-rally'
    },
    {
      id: 'finance-mock-2',
      title: '央行货币政策调整，利率决议引关注',
      summary: '💰 政策解读：多国央行陆续公布利率决议，货币政策走向成为市场焦点。美联储暗示可能调整利率政策，欧央行保持谨慎态度。专家分析政策对经济和市场的深远影响！',
      content: '各国央行货币政策调整备受关注。利率决议将对全球经济产生重要影响，投资者密切关注政策动向。',
      author: '金融观察',
      publishDate: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'),
      category: '财经',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      readTime: '5分钟',
      source: '央行观察',
      originalUrl: 'https://example.com/interest-rates'
    },
    {
      id: 'finance-mock-3',
      title: '数字货币监管新规即将出台',
      summary: '🔗 监管动向：数字货币监管框架日趋完善，新规即将正式发布。监管部门强调保护投资者权益，促进行业健康发展。比特币、以太坊等主流币种走势平稳，市场期待明确规则！',
      content: '数字货币监管新规即将出台，将为行业发展提供明确指导。监管部门致力于平衡创新与风险防控。',
      author: '区块链日报',
      publishDate: new Date(Date.now() - 172800000).toLocaleDateString('zh-CN'),
      category: '财经',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      readTime: '4分钟',
      source: '数字金融网',
      originalUrl: 'https://example.com/crypto-regulation'
    }
  ];

  return financeNews;
};

// 主要的免费新闻获取函数
export const fetchFreeAINews = async (): Promise<NewsItem[]> => {
  try {
    console.log('开始从所有免费API获取新闻演示数据...');
    
    // 并行请求多个免费API
    const [
      hackerNewsData, 
      guardianBusinessData, 
      guardianTechData,
      guardianSportsData,
      additionalContent,
      mockFinanceData
    ] = await Promise.all([
      fetchHackerNews(),
      fetchGuardianBusinessNews(),
      fetchGuardianTechNews(),
      fetchGuardianSportsNews(),
      fetchAdditionalFreeContent(),
      Promise.resolve(generateFinanceNews())
    ]);

    const allNews = [
      ...hackerNewsData, 
      ...guardianBusinessData, 
      ...guardianTechData,
      ...guardianSportsData,
      ...additionalContent,
      ...mockFinanceData
    ];
    
    // 去重和排序
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.title === news.title)
    );

    // 按发布时间排序
    const sortedNews = uniqueNews
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 50);

    console.log(`成功获取到 ${sortedNews.length} 条免费新闻`);
    console.log('免费新闻来源分布:', {
      HackerNews: hackerNewsData.length,
      'Guardian Business': guardianBusinessData.length,
      'Guardian Tech': guardianTechData.length,
      'Guardian Sports': guardianSportsData.length,
      Reddit: additionalContent.filter(item => item.source === 'Reddit').length,
      DevTo: additionalContent.filter(item => item.source === 'Dev.to').length,
      GitHub: additionalContent.filter(item => item.source === 'GitHub').length,
      'Mock Finance': mockFinanceData.length
    });
    console.log('免费新闻分类分布:', sortedNews.reduce((acc, news) => {
      acc[news.category] = (acc[news.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    return sortedNews;

  } catch (error) {
    console.error('获取免费新闻时出错:', error);
    return [];
  }
};
