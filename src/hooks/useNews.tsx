import { useState, useEffect } from "react";
import { fetchAINews, NewsItem } from "@/services/newsApi";
import { translateNewsItem } from "@/services/translationApi";

// 扩展的模拟数据
const mockNews: NewsItem[] = [
  {
    id: "mock-1",
    title: "OpenAI发布GPT-4 Turbo：性能提升，成本降低",
    summary: "OpenAI最新发布的GPT-4 Turbo模型在保持高性能的同时，大幅降低了使用成本，支持更长的上下文长度。",
    content: "OpenAI在最新的开发者大会上发布了GPT-4 Turbo，这是该公司迄今为止最先进且性价比最高的模型。新模型支持128K上下文长度，相比之前的32K有了显著提升。同时，API调用成本降低了3倍，这将使更多开发者能够使用先进的AI技术。",
    author: "OpenAI团队",
    publishDate: new Date().toLocaleDateString('zh-CN'),
    category: "国际AI",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    readTime: "3分钟",
    source: "OpenAI"
  },
  {
    id: "mock-2", 
    title: "百度文心一言4.0正式发布，性能媲美GPT-4",
    summary: "百度发布了文心一言4.0版本，在理解、生成、逻辑和记忆四个维度都有显著提升，已接近GPT-4水平。",
    content: "百度在2024年开发者大会上正式发布文心一言4.0，这是百度迄今为止最强大的大语言模型。新版本在中文理解和生成能力上表现出色，特别是在古诗词创作、文学创作等中文特色任务上超越了国外同类产品。百度CEO李彦宏表示，文心一言4.0的综合能力已经达到GPT-4的水平。",
    author: "百度AI",
    publishDate: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'),
    category: "国内AI",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟",
    source: "百度"
  },
  {
    id: "mock-3",
    title: "Midjourney V6发布：AI绘画进入新时代",
    summary: "Midjourney发布V6版本，在图像质量、细节处理和文本理解方面都有突破性改进。",
    content: "Midjourney V6版本正式发布，这次更新带来了革命性的改进。新版本在图像分辨率、色彩准确度和细节处理方面都有显著提升。特别是在文本理解和图像中文字渲染方面，V6版本表现出了前所未有的准确性。用户现在可以生成包含准确文字的图像，这在之前是难以实现的。",
    author: "Midjourney团队",
    publishDate: new Date(Date.now() - 172800000).toLocaleDateString('zh-CN'),
    category: "AI绘画",
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80",
    readTime: "3分钟",
    source: "Midjourney"
  },
  {
    id: "mock-4",
    title: "Runway发布Gen-3：AI视频生成新突破",
    summary: "Runway发布第三代AI视频生成模型Gen-3，视频质量和时长都有大幅提升。",
    content: "Runway公司发布了Gen-3 Alpha模型，这是他们第三代AI视频生成技术。Gen-3在视频质量、运动连贯性和时长方面都有显著改进。新模型可以生成最长10秒的高质量视频，并且在人物动作、场景变换和物理规律方面表现更加真实。这标志着AI视频生成技术进入了一个新的发展阶段。",
    author: "Runway团队",
    publishDate: new Date(Date.now() - 259200000).toLocaleDateString('zh-CN'),
    category: "AI视频",
    imageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟",
    source: "Runway"
  },
  {
    id: "mock-5",
    title: "AutoGPT推出智能代理新功能",
    summary: "AutoGPT发布了全新的智能代理功能，可以自主完成复杂的多步骤任务。",
    content: "AutoGPT团队发布了最新版本，引入了革命性的智能代理功能。新版本的AI代理可以自主分解复杂任务，制定执行计划，并逐步完成目标。这种能力使得AI不再只是被动回答问题，而是能够主动思考和执行任务。用户只需要提供高层次的目标，AI代理就能自动完成包括信息搜集、数据分析、内容创作等多个步骤的工作流程。",
    author: "AutoGPT团队",
    publishDate: new Date(Date.now() - 345600000).toLocaleDateString('zh-CN'),
    category: "AI智能体",
    imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80",
    readTime: "5分钟",
    source: "AutoGPT"
  },
  {
    id: "mock-6",
    title: "Claude 3.5 Sonnet发布：推理能力大幅提升",
    summary: "Anthropic发布Claude 3.5 Sonnet，在数学推理和代码生成方面表现优异。",
    content: "Anthropic公司发布了Claude 3.5 Sonnet模型，这是Claude家族的最新成员。新模型在数学推理、逻辑思考和代码生成方面都有显著提升。特别是在处理复杂的数学问题和编程任务时，Claude 3.5 Sonnet展现出了超越GPT-4的能力。模型还支持更长的上下文窗口，可以处理长达200K token的文本，这使得它在文档分析和长篇内容创作方面更加实用。",
    author: "Anthropic团队",
    publishDate: new Date(Date.now() - 432000000).toLocaleDateString('zh-CN'),
    category: "大语言模型",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟",
    source: "Anthropic"
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [translatedNews, setTranslatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('zh');

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        console.log('开始获取AI新闻数据...');
        
        const allNews = await fetchAINews();

        console.log(`获取到 ${allNews.length} 条新闻`);

        if (allNews.length === 0) {
          console.log('API调用失败，使用模拟数据');
          setNews(mockNews);
          setApiKeyMissing(true);
        } else {
          const sortedNews = allNews.sort((a, b) => 
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          );
          setNews(sortedNews);
          setApiKeyMissing(false);
        }
      } catch (error) {
        console.error('获取新闻时出错:', error);
        setNews(mockNews);
        setApiKeyMissing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();

    const interval = setInterval(() => {
      console.log("正在更新最新AI新闻数据...");
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

      setLoading(true);
      try {
        const translated = await Promise.all(
          news.map(item => translateNewsItem(item, currentLanguage))
        );
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

  const getNewsByCategory = (category: string) => {
    const newsToFilter = translatedNews.length > 0 ? translatedNews : news;
    if (category === "全部" || category === "All" || category === "すべて" || category === "전체") {
      return newsToFilter;
    }
    return newsToFilter.filter(item => item.category === category);
  };

  const getNewsById = (id: string) => {
    const newsToSearch = translatedNews.length > 0 ? translatedNews : news;
    return newsToSearch.find(item => item.id === id);
  };

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  return { 
    news: translatedNews.length > 0 ? translatedNews : news, 
    loading, 
    getNewsByCategory, 
    getNewsById, 
    apiKeyMissing,
    changeLanguage,
    currentLanguage
  };
};
