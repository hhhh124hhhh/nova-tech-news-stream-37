
import { useState } from "react";
import { Settings, Save, TestTube, CheckCircle, XCircle } from "lucide-react";
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
      testFailed: "API test failed"
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
      testFailed: "API测试失败"
    };
  };

  const text = getText();

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
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{text.title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {text.description}
          </DialogDescription>
        </DialogHeader>
        
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

          <div className="flex space-x-2 pt-4">
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
