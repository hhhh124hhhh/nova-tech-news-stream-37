import { useState, useEffect } from "react";
import { fetchAINews, NewsItem, getApiStatus, hasAnyApiKey, unifyCategory } from "@/services/newsApi";
import { fetchFreeAINews } from "@/services/freeNewsApi";
import { translateNewsItem } from "@/services/translationApi";

// 更新为通用全球新闻的模拟数据 - 移除AI相关内容
const mockNews: NewsItem[] = [
  {
    id: "mock-1",
    title: "全球经济复苏强劲，多国央行调整货币政策",
    summary: "🌍 经济亮点：全球经济显示强劲复苏势头，主要经济体GDP增长超预期。美联储、欧央行等多国央行开始调整货币政策，专家预计未来经济将持续稳定增长，为全球贸易带来新机遇！",
    content: `全球经济在经历了前期的挑战后，正展现出强劲的复苏势头。最新经济数据显示，主要经济体的GDP增长均超出预期。

## 主要经济指标

### 美国经济表现
美国第三季度GDP增长率达到4.2%，远超市场预期的3.1%。就业市场持续改善，失业率降至近年来新低。

### 欧洲经济复苏
欧盟经济也显示出积极信号，德国、法国等主要经济体制造业指数回升，消费者信心指数创新高。

## 央行政策调整

各国央行正密切关注经济数据，美联储暗示可能调整利率政策，欧央行也在考虑逐步收紧货币政策。

## 对全球贸易的影响

经济复苏为全球贸易带来新机遇，跨境投资活动明显增加，国际合作项目数量创历史新高。`,
    author: "国际财经报道",
    publishDate: new Date().toLocaleDateString('zh-CN'),
    category: "财经",
    readTime: "4分钟",
    source: "全球财经网",
    originalUrl: "https://example.com/global-economy"
  },
  {
    id: "mock-2", 
    title: "新能源汽车产业迎来技术突破，市场前景广阔",
    summary: "🚗 科技前沿：电动汽车电池技术取得重大突破，续航里程大幅提升！新能源汽车产业链不断完善，充电基础设施快速发展，绿色出行成为新趋势。",
    content: `新能源汽车产业正迎来技术突破和市场快速发展的关键时期。

## 技术突破

### 电池技术进步
最新一代锂电池技术实现重大突破，单次充电续航里程突破1000公里，充电时间缩短至15分钟。

### 智能驾驶发展
自动驾驶技术不断成熟，多家车企推出L3级别自动驾驶功能，为未来出行带来便利。

## 市场发展

全球新能源汽车销量持续增长，预计今年将突破1500万辆，占汽车总销量的比重进一步提升。

## 基础设施建设

充电桩建设步伐加快，公共充电网络覆盖范围不断扩大，为新能源汽车普及提供有力支撑。`,
    author: "科技前沿",
    publishDate: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'),
    category: "科技",
    readTime: "3分钟",
    source: "科技日报",
    originalUrl: "https://example.com/ev-tech"
  },
  {
    id: "mock-3",
    title: "国际体育盛会筹备进展顺利，多项赛事即将开幕",
    summary: "🏆 体育盛事：多项重要国际体育赛事筹备工作进展顺利！场馆建设、安全保障、志愿者培训等各项准备工作已基本就绪。全球体育迷翘首以盼，期待精彩赛事的到来！",
    content: `多项重要国际体育赛事的筹备工作正在紧锣密鼓地进行中，各项准备工作进展顺利。

## 场馆建设

### 现代化设施
新建和改造的体育场馆采用了最先进的技术，不仅满足比赛需求，还充分考虑了环保和可持续发展要求。

### 配套设施完善
住宿、交通、医疗等配套设施建设已基本完成，为运动员和观众提供优质服务保障。

## 安全保障

组委会制定了全面的安全保障方案，与当地执法部门密切合作，确保赛事安全顺利进行。

## 全球期待

来自世界各地的运动员已开始抵达，各国媒体也纷纷派出报道团队，全球体育迷对即将到来的精彩比赛充满期待。`,
    author: "体育记者团",
    publishDate: new Date(Date.now() - 172800000).toLocaleDateString('zh-CN'),
    category: "体育",
    readTime: "5分钟",
    source: "国际体育报",
    originalUrl: "https://example.com/sports-events"
  },
  {
    id: "mock-4",
    title: "全球教育改革新趋势：数字化学习成为主流",
    summary: "📚 教育革新：全球教育正迎来数字化转型浪潮！在线学习平台、个性化学习等创新模式正在重塑教育格局。这场教育革命将为学生提供更优质、更便捷的学习体验！",
    content: `全球教育系统正在经历一场深刻的数字化变革，新技术的应用正在重新定义教学和学习方式。

## 数字化教学趋势

### 在线学习普及
在线学习平台用户数量激增，优质教育资源得以更广泛地传播，打破了地域限制。

### 技术创新应用
虚拟现实、增强现实等技术在教育领域的应用越来越广泛，为学生提供沉浸式学习体验。

## 个性化学习

基于大数据分析的个性化学习系统能够根据学生的学习特点制定专属学习计划，提高学习效率。

## 教师角色转变

教师的角色正在从知识传授者转变为学习引导者和促进者，更加注重培养学生的创新思维和实践能力。`,
    author: "教育专家",
    publishDate: new Date(Date.now() - 259200000).toLocaleDateString('zh-CN'),
    category: "教育",
    readTime: "4分钟",
    source: "教育周刊",
    originalUrl: "https://example.com/education-reform"
  },
  {
    id: "mock-5",
    title: "国际合作应对气候变化，绿色发展成全球共识",
    summary: "🌱 环保行动：各国政府和国际组织加强合作，共同应对气候变化挑战！绿色发展理念深入人心，碳中和目标成为全球共识。携手共建美好地球家园，为子孙后代留下蓝天绿水！",
    content: `面对日益严峻的气候变化挑战，国际社会正在加强合作，推动绿色发展成为全球共识。

## 国际合作机制

### 多边协议
多个国际气候协议得到有效执行，各国承诺减排目标逐步实现，国际合作机制不断完善。

### 技术共享
发达国家向发展中国家提供清洁技术支持，促进全球绿色技术的普及和应用。

## 绿色转型进展

各国纷纷制定碳中和时间表，大力发展可再生能源，推动产业结构向绿色低碳转型。

## 社会参与

民众环保意识显著提升，绿色生活方式成为新时尚，企业社会责任意识不断增强。`,
    author: "环保组织",
    publishDate: new Date(Date.now() - 345600000).toLocaleDateString('zh-CN'),
    category: "环境",
    readTime: "3分钟",
    source: "环球环保网",
    originalUrl: "https://example.com/climate-action"
  },
  {
    id: "mock-6",
    title: "国际政治新格局：多边主义成为主流趋势",
    summary: "🤝 政治动态：国际政治格局正在发生深刻变化，多边主义和国际合作成为主流趋势！各国通过对话协商解决分歧，共同维护世界和平与稳定，为全球发展创造良好环境！",
    content: `当前国际政治格局正在经历深刻调整，多边主义和国际合作日益成为处理国际事务的主流方式。

## 多边合作机制

### 国际组织作用
联合国、世贸组织等国际组织在维护国际秩序、促进合作方面发挥越来越重要的作用。

### 区域合作深化
各区域合作组织不断加强协调，推动区域一体化进程，促进共同发展。

## 外交新趋势

各国更加重视通过外交途径解决争端，对话协商成为处理国际分歧的首选方式。

## 全球治理

面对全球性挑战，各国认识到需要加强全球治理合作，共同应对跨国问题。`,
    author: "国际关系专家",
    publishDate: new Date(Date.now() - 432000000).toLocaleDateString('zh-CN'),
    category: "政治",
    readTime: "6分钟",
    source: "国际政治周刊",
    originalUrl: "https://example.com/international-politics"
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [translatedNews, setTranslatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [apiStatus, setApiStatus] = useState(getApiStatus());
  const [usingFreeApi, setUsingFreeApi] = useState(false);

  const fetchAllNews = async () => {
    setLoading(true);
    try {
      console.log('开始获取全球新闻数据...');
      
      const hasApiKeys = hasAnyApiKey();
      setApiStatus(getApiStatus());

      let allNews: NewsItem[] = [];

      if (hasApiKeys) {
        console.log('使用配置的API密钥获取实时新闻...');
        allNews = await fetchAINews();
        setUsingFreeApi(false);
      } else {
        console.log('使用免费演示API获取新闻...');
        allNews = await fetchFreeAINews();
        setUsingFreeApi(true);
      }

      console.log(`成功获取到 ${allNews.length} 条全球新闻`);

      if (allNews.length === 0) {
        console.log('所有API调用失败，使用全球新闻演示数据');
        setNews(mockNews);
        setApiKeyMissing(!hasApiKeys);
      } else {
        // 为获取的新闻添加完整内容（如果没有的话）
        const newsWithContent = allNews.map(item => ({
          ...item,
          content: item.content || `${item.summary}\n\n这是从${item.source || '外部来源'}获取的新闻内容。由于API限制，完整内容可能需要访问原始链接获取更多详细信息。\n\n关键信息：\n- 发布时间：${item.publishDate}\n- 来源：${item.source || '未知'}\n- 分类：${item.category}\n\n如需了解更多详细内容，请点击"查看原文"按钮访问完整文章。`
        }));
        
        const sortedNews = newsWithContent.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
        setNews(sortedNews);
        setApiKeyMissing(false);
      }
    } catch (error) {
      console.error('获取全球新闻时出错:', error);
      setNews(mockNews);
      setApiKeyMissing(true);
      setUsingFreeApi(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();

    // 每30分钟更新一次新闻
    const interval = setInterval(() => {
      console.log("正在更新最新全球新闻数据...");
      fetchAllNews();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 语言切换效果
  useEffect(() => {
    const translateNews = async () => {
      if (currentLanguage === 'zh') {
        setTranslatedNews(news);
        return;
      }

      if (news.length === 0) {
        return;
      }

      setLoading(true);
      try {
        console.log(`正在翻译新闻到${currentLanguage}...`);
        const translated = await Promise.all(
          news.map(item => translateNewsItem(item, currentLanguage))
        );
        console.log(`翻译完成，共${translated.length}条新闻`);
        setTranslatedNews(translated);
      } catch (error) {
        console.error('翻译新闻时出错:', error);
        setTranslatedNews(news);
      } finally {
        setLoading(false);
      }
    };

    translateNews();
  }, [news, currentLanguage]);

  const handleApiKeyChange = (apiKeys: {
    newsapi?: string;
    juhe?: string;
    tianapi?: string;
    currents?: string;
  }) => {
    console.log('API密钥已更新，重新获取新闻数据...');
    // 立即重新获取新闻
    setTimeout(() => {
      fetchAllNews();
    }, 100);
  };

  const getNewsByCategory = (category: string) => {
    const newsToFilter = currentLanguage === 'zh' ? news : translatedNews;
    
    // 统一分类到中文基准
    const unifiedCategory = unifyCategory(category);
    
    console.log(`筛选分类: ${category} -> ${unifiedCategory}`);
    
    if (unifiedCategory === "全部") {
      console.log(`返回全部新闻: ${newsToFilter.length} 条`);
      return newsToFilter;
    }
    
    const filtered = newsToFilter.filter(item => {
      const itemUnifiedCategory = unifyCategory(item.category);
      return itemUnifiedCategory === unifiedCategory;
    });
    
    console.log(`分类 ${unifiedCategory} 的新闻数量: ${filtered.length}`);
    console.log('可用分类:', [...new Set(newsToFilter.map(item => unifyCategory(item.category)))]);
    
    return filtered;
  };

  const getNewsById = (id: string) => {
    const newsToSearch = currentLanguage === 'zh' ? news : translatedNews;
    return newsToSearch.find(item => item.id === id);
  };

  const changeLanguage = (language: string) => {
    console.log(`切换语言到: ${language}`);
    setCurrentLanguage(language);
  };

  return { 
    news: currentLanguage === 'zh' ? news : translatedNews, 
    loading, 
    getNewsByCategory, 
    getNewsById, 
    apiKeyMissing,
    changeLanguage,
    currentLanguage,
    apiStatus,
    usingFreeApi,
    handleApiKeyChange,
    refreshNews: fetchAllNews
  };
};
