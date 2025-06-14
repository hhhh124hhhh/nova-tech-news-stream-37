
import Header from "@/components/Header";
import NewsList from "@/components/NewsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI News Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            探索人工智能的最新发展，获取前沿科技资讯和深度分析
          </p>
        </div>
        <NewsList />
      </main>
    </div>
  );
};

export default Index;
