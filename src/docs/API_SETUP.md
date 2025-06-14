
# 新闻API配置指南

本项目支持多个新闻API源，以获取最新的AI大模型相关新闻。以下是各个API的获取和配置方法：

## 1. NewsAPI (国际新闻)
- **网站**: https://newsapi.org/
- **免费额度**: 每月1000次请求
- **获取方式**:
  1. 注册NewsAPI账号
  2. 获取API Key
  3. 在项目中设置环境变量: `VITE_NEWS_API_KEY`

## 2. 聚合数据API (中国新闻)
- **网站**: https://www.juhe.cn/
- **免费额度**: 每天100次请求
- **获取方式**:
  1. 注册聚合数据账号
  2. 申请"头条新闻"API
  3. 获取API Key
  4. 在项目中设置环境变量: `VITE_JUHE_API_KEY`

## 3. 天行数据API (综合新闻)
- **网站**: https://www.tianapi.com/
- **免费额度**: 每天100次请求
- **获取方式**:
  1. 注册天行数据账号
  2. 申请"新闻资讯"API
  3. 获取API Key
  4. 在项目中设置环境变量: `VITE_TIANAPI_KEY`

## 4. Currents API (NewsAPI替代方案)
- **网站**: https://currentsapi.services/
- **免费额度**: 每月600次请求
- **获取方式**:
  1. 注册Currents API账号
  2. 获取API Key
  3. 在项目中设置环境变量: `VITE_CURRENTS_API_KEY`

## 环境变量配置

在Lovable项目中，您需要通过项目设置来配置这些API密钥：

1. 点击项目设置
2. 找到"Secrets"或"环境变量"部分
3. 添加以下变量：
   - `VITE_NEWS_API_KEY`: NewsAPI密钥
   - `VITE_JUHE_API_KEY`: 聚合数据API密钥
   - `VITE_TIANAPI_KEY`: 天行数据API密钥
   - `VITE_CURRENTS_API_KEY`: Currents API密钥

## 推荐配置

为了获得最佳的新闻覆盖效果，建议至少配置以下API：

1. **NewsAPI** - 获取国际AI新闻
2. **聚合数据API** - 获取中国科技新闻
3. **天行数据API** - 作为备用数据源

## API限制说明

- 免费API都有请求次数限制
- 项目会自动处理API失败的情况
- 如果所有API都无法使用，系统会显示演示数据
- 建议配置多个API以确保新闻数据的稳定性

## 注意事项

1. 部分API可能需要实名认证
2. 中国地区的API访问可能受到网络限制
3. 建议定期检查API额度使用情况
4. 可以根据需要调整新闻获取频率
