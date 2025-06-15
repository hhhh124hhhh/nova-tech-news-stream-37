
import { useState } from "react";
import { Settings, Save, TestTube, CheckCircle, XCircle, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ApiSettingsProps {
  onApiKeyChange: (apiKeys: {
    newsapi?: string;
    juhe?: string;
    tianapi?: string;
    currents?: string;
  }) => void;
  currentLanguage: string;
}

const ApiSettings = ({ onApiKeyChange, currentLanguage }: ApiSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    newsapi: localStorage.getItem('newsapi_key') || '',
    juhe: localStorage.getItem('juhe_key') || '',
    tianapi: localStorage.getItem('tianapi_key') || '',
    currents: localStorage.getItem('currents_key') || ''
  });
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({});
  const [isTesting, setIsTesting] = useState(false);

  const getText = () => {
    if (currentLanguage === 'en') return {
      title: "API Settings",
      description: "Configure news API keys to get real-time updates",
      save: "Save Settings",
      test: "Test APIs",
      testing: "Testing...",
      newsapi: "NewsAPI Key (International News)",
      juhe: "JuHe API Key (China News)",
      tianapi: "TianAPI Key (Comprehensive News)",
      currents: "Currents API Key (Alternative)",
      placeholder: "Enter API key...",
      success: "Settings saved successfully!",
      testSuccess: "API test successful",
      testFailed: "API test failed",
      configGuide: "Configuration Guide",
      howToGet: "How to get API keys"
    };
    return {
      title: "API设置",
      description: "配置新闻API密钥以获取实时更新",
      save: "保存设置",
      test: "测试API",
      testing: "测试中...",
      newsapi: "NewsAPI密钥（国际新闻）",
      juhe: "聚合数据API密钥（中国新闻）",
      tianapi: "天行数据API密钥（综合新闻）",
      currents: "Currents API密钥（备选方案）",
      placeholder: "输入API密钥...",
      success: "设置保存成功！",
      testSuccess: "API测试成功",
      testFailed: "API测试失败",
      configGuide: "配置指南",
      howToGet: "如何获取API密钥"
    };
  };

  const text = getText();

  // API配置信息
  const apiConfigs = [
    {
      key: 'newsapi',
      name: 'NewsAPI',
      description: currentLanguage === 'en' ? 'International news source' : '国际新闻源',
      website: 'https://newsapi.org/',
      freeLimit: currentLanguage === 'en' ? '1000 requests/month' : '每月1000次请求',
      steps: currentLanguage === 'en' ? [
        '1. Visit newsapi.org',
        '2. Register for a free account',
        '3. Get your API key from the dashboard',
        '4. Paste it in the field above'
      ] : [
        '1. 访问 newsapi.org',
        '2. 注册免费账号',
        '3. 在控制台获取API密钥',
        '4. 粘贴到上方输入框'
      ]
    },
    {
      key: 'juhe',
      name: '聚合数据',
      description: currentLanguage === 'en' ? 'China news source' : '中国新闻源',
      website: 'https://www.juhe.cn/',
      freeLimit: currentLanguage === 'en' ? '100 requests/day' : '每天100次请求',
      steps: currentLanguage === 'en' ? [
        '1. Visit juhe.cn',
        '2. Register and verify account',
        '3. Apply for "头条新闻" API',
        '4. Get API key after approval'
      ] : [
        '1. 访问 juhe.cn',
        '2. 注册并实名认证',
        '3. 申请"头条新闻"API',
        '4. 审核通过后获取密钥'
      ]
    },
    {
      key: 'tianapi',
      name: '天行数据',
      description: currentLanguage === 'en' ? 'Comprehensive news source' : '综合新闻源',
      website: 'https://www.tianapi.com/',
      freeLimit: currentLanguage === 'en' ? '100 requests/day' : '每天100次请求',
      steps: currentLanguage === 'en' ? [
        '1. Visit tianapi.com',
        '2. Register for free account',
        '3. Apply for "新闻资讯" API',
        '4. Get API key from dashboard'
      ] : [
        '1. 访问 tianapi.com',
        '2. 注册免费账号',
        '3. 申请"新闻资讯"API',
        '4. 在控制台获取密钥'
      ]
    },
    {
      key: 'currents',
      name: 'Currents API',
      description: currentLanguage === 'en' ? 'Alternative international news' : '备选国际新闻源',
      website: 'https://currentsapi.services/',
      freeLimit: currentLanguage === 'en' ? '600 requests/month' : '每月600次请求',
      steps: currentLanguage === 'en' ? [
        '1. Visit currentsapi.services',
        '2. Sign up for free account',
        '3. Get API key from dashboard',
        '4. No approval needed'
      ] : [
        '1. 访问 currentsapi.services',
        '2. 注册免费账号',
        '3. 在控制台获取密钥',
        '4. 无需审核即可使用'
      ]
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // 保存到localStorage
    Object.entries(apiKeys).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`${key}_key`, value);
      } else {
        localStorage.removeItem(`${key}_key`);
      }
    });

    // 通知父组件更新
    onApiKeyChange(apiKeys);
    setIsOpen(false);
  };

  const testApi = async (apiType: string, apiKey: string) => {
    if (!apiKey) return null;

    try {
      let testUrl = '';
      switch (apiType) {
        case 'newsapi':
          testUrl = `https://newsapi.org/v2/everything?q=AI&pageSize=1&apiKey=${apiKey}`;
          break;
        case 'currents':
          testUrl = `https://api.currentsapi.services/v1/search?keywords=AI&page_size=1&apiKey=${apiKey}`;
          break;
        default:
          return null;
      }

      const response = await fetch(testUrl);
      return response.ok;
    } catch (error) {
      console.error(`测试${apiType} API时出错:`, error);
      return false;
    }
  };

  const handleTestAllApis = async () => {
    setIsTesting(true);
    const results: {[key: string]: boolean | null} = {};

    for (const [key, value] of Object.entries(apiKeys)) {
      if (value) {
        results[key] = await testApi(key, value);
      } else {
        results[key] = null;
      }
    }

    setTestResults(results);
    setIsTesting(false);
  };

  const getTestIcon = (result: boolean | null) => {
    if (result === null) return null;
    return result ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
          <Settings className="h-4 w-4 mr-2" />
          API设置
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{text.title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {text.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* API密钥输入区域 */}
          <div className="space-y-4">
            {Object.entries(apiKeys).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={key} className="text-slate-200 text-sm">
                    {text[key as keyof typeof text] as string}
                  </Label>
                  {getTestIcon(testResults[key])}
                </div>
                <Input
                  id={key}
                  type="password"
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={text.placeholder}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            ))}
          </div>

          {/* 配置指南 */}
          <div className="border-t border-slate-600 pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="h-4 w-4 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">{text.configGuide}</h3>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {apiConfigs.map((config) => (
                <AccordionItem key={config.key} value={config.key} className="border-slate-600">
                  <AccordionTrigger className="text-slate-200 hover:text-white">
                    <div className="flex items-center space-x-2">
                      <span>{config.name}</span>
                      <span className="text-xs text-slate-400">({config.freeLimit})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 space-y-3">
                    <p className="text-sm">{config.description}</p>
                    
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-blue-400" />
                        <a 
                          href={config.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          {config.website}
                        </a>
                      </div>
                      
                      <div className="space-y-1">
                        {config.steps.map((step, index) => (
                          <p key={index} className="text-xs text-slate-400">{step}</p>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-2 pt-4 border-t border-slate-600">
            <Button 
              onClick={handleTestAllApis} 
              disabled={isTesting}
              variant="outline"
              className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTesting ? text.testing : text.test}
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {text.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiSettings;
