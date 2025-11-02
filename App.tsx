
import React, { useState } from 'react';
import { ArticleCard } from './components/ArticleCard';
import { initialArticles } from './constants';
import type { Article } from './types';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const handleConclusionGenerated = (articleId: number, conclusion: string) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.id === articleId
          ? { ...article, generatedConclusion: conclusion }
          : article
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 mb-2">
            AI Article Conclusion Generator
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Leveraging Gemini to craft compelling, call-to-action oriented conclusions for your articles.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onConclusionGenerated={handleConclusionGenerated}
            />
          ))}
        </div>
        
        <footer className="text-center mt-16 text-slate-500">
          <p>Built with React, TypeScript, Tailwind CSS, and the Gemini API.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
