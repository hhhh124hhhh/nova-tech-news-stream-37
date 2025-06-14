import { useState, useEffect } from "react";
import { fetchAINews, NewsItem, getApiStatus, hasAnyApiKey, unifyCategory } from "@/services/newsApi";
import { fetchFreeAINews } from "@/services/freeNewsApi";
import { translateNewsItem } from "@/services/translationApi";

// 更新AI大模型相关的模拟数据，使用更吸引人的摘要
const mockNews: NewsItem[] = [
  {
    id: "mock-1",
    title: "OpenAI发布GPT-4.5：突破性的多模态推理能力",
    summary: "🚀 突破性进展！OpenAI最新发布的GPT-4.5模型在多模态理解和推理方面实现重大突破，支持图像、音频、视频的综合分析，标志着AI技术进入全新时代。这项创新将彻底改变我们与人工智能交互的方式，开启智能化新纪元！",
    content: "OpenAI在最新的技术发布会上展示了GPT-4.5模型的强大能力。新模型不仅在文本生成方面保持领先，更在多模态推理上实现了质的飞跃。GPT-4.5能够同时处理文本、图像、音频和视频输入，并进行深度的跨模态推理分析。在复杂场景理解、科学问题解答和创意内容生成方面都展现出了前所未有的能力。",
    author: "OpenAI团队",
    publishDate: new Date().toLocaleDateString('zh-CN'),
    category: "大语言模型",
    imageUrl: "https://picsum.photos/800/600?random=1",
    readTime: "4分钟",
    source: "OpenAI",
    originalUrl: "https://openai.com/blog/gpt-4-5"
  },
  {
    id: "mock-2", 
    title: "Midjourney V6发布：AI绘画进入新纪元",
    summary: "🎨 创新亮点：Midjourney V6版本正式发布，在图像质量、细节处理和创意表现方面实现了革命性突破！新版本将AI艺术创作推向前所未有的高度，让每个人都能成为数字艺术大师。探索AI的无限可能！",
    content: "Midjourney V6版本的发布标志着AI绘画技术进入了一个全新的时代。新版本在图像分辨率、色彩表现、细节处理等方面都有显著提升。特别是在人物面部表情、手部细节、光影效果等传统AI绘画难点上实现了重大突破。V6还增加了更强的风格控制能力，用户可以更精确地控制生成图像的艺术风格和视觉效果。",
    author: "Midjourney团队",
    publishDate: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'),
    category: "AI绘画",
    imageUrl: "https://picsum.photos/800/600?random=2",
    readTime: "3分钟",
    source: "Midjourney",
    originalUrl: "https://midjourney.com/v6-release"
  },
  {
    id: "mock-3",
    title: "OpenAI Sora震撼发布：文本生成视频的革命",
    summary: "🔥 热门话题：OpenAI发布Sora模型，能够根据文本描述生成高质量的60秒视频，引发AI视频生成领域的巨大变革！这项突破性技术将重新定义内容创作，让想象力成为唯一的限制。引领科技新潮流！",
    content: "OpenAI最新发布的Sora模型在AI视频生成领域实现了前所未有的突破。Sora能够根据用户的文本描述生成长达60秒的高质量视频，视频具有复杂的场景、多个角色和精确的物理运动。该模型展现出了对现实世界物理规律的深度理解，生成的视频在连贯性、真实感和创意表现方面都达到了令人惊叹的水平。",
    author: "OpenAI",
    publishDate: new Date(Date.now() - 172800000).toLocaleDateString('zh-CN'),
    category: "AI视频",
    imageUrl: "https://picsum.photos/800/600?random=3",
    readTime: "5分钟",
    source: "OpenAI",
    originalUrl: "https://openai.com/blog/sora"
  },
  {
    id: "mock-4",
    title: "GitHub Copilot X：AI编程助手的全面升级",
    summary: "⚡ 最新突破：GitHub发布Copilot X，集成GPT-4技术，为开发者提供更智能的编程辅助体验！这款革命性工具将大幅提升编程效率，让复杂的代码开发变得简单直观。每个开发者的智能编程伙伴！",
    content: "GitHub Copilot X是基于GPT-4技术的全新AI编程助手，相比前代产品在代码理解、生成质量和上下文感知方面都有显著提升。Copilot X不仅能够生成高质量的代码片段，还能理解复杂的项目结构，提供智能的重构建议，甚至能够协助进行代码审查和bug修复。这一工具的发布将极大提升开发者的工作效率。",
    author: "GitHub",
    publishDate: new Date(Date.now() - 259200000).toLocaleDateString('zh-CN'),
    category: "AI编程",
    imageUrl: "https://picsum.photos/800/600?random=4",
    readTime: "4分钟",
    source: "GitHub",
    originalUrl: "https://github.com/features/copilot"
  },
  {
    id: "mock-5",
    title: "AutoGPT 2.0：下一代AI智能体架构发布",
    summary: "🌟 重磅消息：AutoGPT团队发布2.0版本，引入全新的智能体架构，支持长期记忆和复杂任务规划！这款智能助手能够自主学习和适应，真正实现了AI智能体的自主性和实用性。智能革命正在到来！",
    content: "AutoGPT 2.0正式发布，这是AI智能体领域的一个重要里程碑。新版本采用了革命性的架构设计，包括持久化记忆系统、高级任务规划器和自适应学习机制。AutoGPT 2.0能够处理跨越数天甚至数周的复杂项目，自主学习新技能，并与多种工具和服务集成，真正实现了智能体的自主性和实用性。",
    author: "AutoGPT团队",
    publishDate: new Date(Date.now() - 345600000).toLocaleDateString('zh-CN'),
    category: "AI智能体",
    imageUrl: "https://picsum.photos/800/600?random=5",
    readTime: "3分钟",
    source: "AutoGPT",
    originalUrl: "https://autogpt.co"
  },
  {
    id: "mock-6",
    title: "Transformer架构重大突破：新型注意力机制发布",
    summary: "📈 行业变革：斯坦福大学研究团队发布新型注意力机制，将Transformer模型的效率提升10倍，引发AI训练技术革命！这项突破性研究将让更大规模的模型训练成为可能，同时大幅降低AI应用成本。了解更多最新动态！",
    content: "斯坦福大学的研究团队在Nature上发表了关于新型注意力机制的论文，这项技术被称为'线性注意力'。新机制将传统Transformer的计算复杂度从O(n²)降低到O(n)，在保持模型性能的同时大幅提升训练和推理效率。这一突破有望让更大规模的模型训练成为可能，同时降低AI应用的计算成本。",
    author: "斯坦福大学",
    publishDate: new Date(Date.now() - 432000000).toLocaleDateString('zh-CN'),
    category: "AI训练技术",
    imageUrl: "https://picsum.photos/800/600?random=6",
    readTime: "6分钟",
    source: "Nature",
    originalUrl: "https://www.nature.com/articles/s41586-023-06525-1"
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
      console.log('开始获取AI大模型新闻数据...');
      
      // 检查是否有配置的API密钥
      const hasApiKeys = hasAnyApiKey();
      setApiStatus(getApiStatus());

      let allNews: NewsItem[] = [];

      if (hasApiKeys) {
        // 使用用户配置的API密钥获取实时新闻
        console.log('使用配置的API密钥获取实时新闻...');
        allNews = await fetchAINews();
        setUsingFreeApi(false);
      } else {
        // 使用免费演示API
        console.log('使用免费演示API获取新闻...');
        allNews = await fetchFreeAINews();
        setUsingFreeApi(true);
      }

      console.log(`成功获取到 ${allNews.length} 条AI大模型新闻`);

      if (allNews.length === 0) {
        console.log('所有API调用失败，使用AI大模型演示数据');
        setNews(mockNews);
        setApiKeyMissing(!hasApiKeys);
      } else {
        const sortedNews = allNews.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
        setNews(sortedNews);
        setApiKeyMissing(false);
      }
    } catch (error) {
      console.error('获取AI大模型新闻时出错:', error);
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
      console.log("正在更新最新AI大模型新闻数据...");
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
