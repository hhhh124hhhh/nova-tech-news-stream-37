
import { useState, useEffect } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "ChatGPT推出GPT-4o：实时语音对话功能震撼发布",
    summary: "OpenAI最新发布的GPT-4o模型支持实时语音对话，能够理解语调和情感，响应速度大幅提升，为AI交互体验带来革命性变化。",
    author: "AI前沿",
    publishDate: "2024-06-14",
    category: "AI智能体",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    readTime: "3分钟"
  },
  {
    id: "2",
    title: "Runway Gen-3 Alpha发布：AI视频生成达到新高度",
    summary: "Runway推出的Gen-3 Alpha模型在视频生成质量和一致性方面取得重大突破，支持高分辨率视频生成和复杂场景渲染。",
    author: "视频AI研究",
    publishDate: "2024-06-14",
    category: "AI视频",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟"
  },
  {
    id: "3",
    title: "Midjourney V6发布：AI绘画进入超现实主义时代",
    summary: "Midjourney V6版本在图像质量、细节表现和风格控制方面实现重大升级，支持更复杂的提示词和更精准的艺术风格模拟。",
    author: "数字艺术家",
    publishDate: "2024-06-13",
    category: "AI绘画",
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80",
    readTime: "5分钟"
  },
  {
    id: "4",
    title: "Claude 3.5 Sonnet：Anthropic发布最强推理模型",
    summary: "Anthropic发布的Claude 3.5 Sonnet在代码生成、数学推理和创意写作方面表现卓越，在多项基准测试中超越GPT-4。",
    author: "AI评测专家",
    publishDate: "2024-06-12",
    category: "大语言模型",
    imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80",
    readTime: "6分钟"
  },
  {
    id: "5",
    title: "谷歌推出Gemini 1.5 Pro：支持200万token上下文",
    summary: "谷歌最新发布的Gemini 1.5 Pro模型支持高达200万token的上下文长度，能够处理超长文档和复杂推理任务。",
    author: "谷歌AI团队",
    publishDate: "2024-06-11",
    category: "大语言模型",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    readTime: "7分钟"
  },
  {
    id: "6",
    title: "Stability AI发布SDXL Turbo：实时AI图像生成",
    summary: "Stability AI推出SDXL Turbo模型，实现单步图像生成，大幅提升AI绘画速度，为实时创作应用开辟新可能。",
    author: "Stability研究院",
    publishDate: "2024-06-10",
    category: "AI绘画",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟"
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = () => {
      setLoading(true);
      setTimeout(() => {
        setNews(mockNews);
        setLoading(false);
      }, 1000);
    };

    fetchNews();

    // 模拟实时更新
    const interval = setInterval(() => {
      console.log("正在更新最新AI新闻数据...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { news, loading };
};
