
import { useState, useEffect } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
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
    content: "OpenAI在今天的发布会上正式推出了GPT-4o模型，这是该公司迄今为止最先进的AI模型。GPT-4o不仅在文本处理能力上有显著提升，更重要的是首次实现了真正的实时语音对话功能。\n\n新模型能够理解用户的语调、情感和语境，并以自然流畅的方式进行回应。在演示中，GPT-4o展现了惊人的对话能力，能够实时调整语速、语调，甚至在对话中展现幽默感。\n\n技术层面上，GPT-4o采用了全新的多模态架构，将文本、语音和视觉信息进行统一处理，大幅提升了响应速度和准确性。这标志着AI助手向更自然的人机交互迈出了重要一步。",
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
    content: "Runway ML公司发布了备受期待的Gen-3 Alpha视频生成模型，这款模型在视频生成领域树立了新的标杆。相比前代产品，Gen-3 Alpha在视频质量、时间一致性和细节表现方面都有显著提升。\n\n新模型支持生成最长10秒的高质量视频，分辨率可达1280x768像素。更重要的是，Gen-3 Alpha在处理复杂场景时展现出了卓越的能力，包括人物动作、物体交互和环境变化等。\n\n该模型采用了先进的时空注意力机制，确保视频帧之间的连贯性和流畅性。这一突破为内容创作者、广告制作和电影特效行业带来了全新的可能性。",
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
    content: "Midjourney发布了V6版本，这一更新被誉为AI绘画领域的里程碑。新版本在图像生成质量、艺术风格控制和细节表现方面都有革命性提升。\n\nV6版本最大的亮点是其对复杂提示词的理解能力显著增强。用户现在可以使用更自然的语言描述来生成精确的图像，模型能够理解细微的艺术指导和风格要求。\n\n在技术实现上，V6采用了全新的扩散模型架构，结合了最新的注意力机制和风格迁移技术。这使得生成的图像不仅在视觉质量上达到了专业水准，更在艺术表现力方面展现出了惊人的创造力。",
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
    content: "Anthropic公司正式发布了Claude 3.5 Sonnet，这款大语言模型在多个关键领域都展现出了卓越的性能表现，特别是在推理能力和代码生成方面。\n\n在标准化测试中，Claude 3.5 Sonnet在数学推理、逻辑分析和代码编写任务上的表现超越了GPT-4，成为目前性能最强的大语言模型之一。该模型在处理复杂的多步推理问题时表现尤为出色。\n\n值得注意的是，Claude 3.5 Sonnet在安全性和可控制性方面也有显著改进。Anthropic采用了新的Constitutional AI训练方法，使模型在保持高性能的同时，更好地遵循道德准则和安全指导原则。",
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
    content: "谷歌DeepMind团队发布了Gemini 1.5 Pro模型，这款模型最大的突破是支持高达200万token的上下文长度，这一能力远超目前市面上的其他大语言模型。\n\n200万token的上下文长度意味着模型可以一次性处理约150万字的文本内容，相当于一本中等长度的小说。这为文档分析、学术研究和复杂项目管理等应用场景带来了前所未有的可能性。\n\n在实际测试中，Gemini 1.5 Pro展现出了卓越的长文档理解和分析能力，能够准确提取关键信息、总结要点，并进行深入的内容分析。这一能力的提升将大大扩展AI在专业领域的应用范围。",
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
    content: "Stability AI发布了革命性的SDXL Turbo模型，这是首个能够实现真正实时图像生成的AI模型。与传统的多步扩散模型不同，SDXL Turbo采用了创新的单步生成技术。\n\n这一技术突破使得图像生成速度提升了数十倍，用户可以看到图像随着提示词的输入而实时生成和变化。这为交互式设计、实时创作和游戏开发等领域带来了全新的可能性。\n\n尽管生成速度大幅提升，SDXL Turbo在图像质量方面并没有明显妥协。该模型仍能生成高质量、细节丰富的图像，为AI绘画的普及和应用推广奠定了重要基础。",
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

  const getNewsByCategory = (category: string) => {
    if (category === "全部") {
      return news;
    }
    return news.filter(item => item.category === category);
  };

  const getNewsById = (id: string) => {
    return news.find(item => item.id === id);
  };

  return { news, loading, getNewsByCategory, getNewsById };
};
