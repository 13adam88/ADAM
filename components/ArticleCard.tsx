
import React, { useState } from 'react';
import type { Article } from '../types';
import { generateConclusion } from '../services/geminiService';
import { Loader } from './Loader';

interface ArticleCardProps {
  article: Article;
  onConclusionGenerated: (articleId: number, conclusion: string) => void;
}

const WandIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69a.75.75 0 01.981.981A10.501 10.501 0 0118 16.5a10.5 10.5 0 11-14.753-8.032.75.75 0 01.82.162z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M11.378 2.097a.75.75 0 01.625.372l.254.508.508.254a.75.75 0 01.372.625l.065.261.261.065a.75.75 0 01.625.372l.254.508.508.254a.75.75 0 01.372.625l.065.261.261.065a.75.75 0 01.372.625l.254.508.508.254a.75.75 0 010 1.25l-.508.254-.254.508a.75.75 0 01-.372.625l-.065.261-.261.065a.75.75 0 01-.625.372l-.254.508-.508.254a.75.75 0 01-1.25 0l-.508-.254-.254-.508a.75.75 0 01-.372-.625l-.065-.261-.261-.065a.75.75 0 01-.625-.372l-.254-.508-.508-.254a.75.75 0 01-.372-.625l-.065-.261-.261-.065a.75.75 0 01-.372-.625l-.254-.508-.508-.254a.75.75 0 010-1.25l.508-.254.254-.508a.75.75 0 01.372-.625l.065-.261.261-.065a.75.75 0 01.625-.372l.254-.508.508-.254a.75.75 0 01.625-.372z" clipRule="evenodd" />
    </svg>
);

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onConclusionGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);
    const conclusion = await generateConclusion(article);
    if (conclusion.startsWith("Error:")) {
      setError(conclusion);
    } else {
      onConclusionGenerated(article.id, conclusion);
    }
    setIsLoading(false);
  };

  return (
    <article className="bg-slate-800/50 rounded-xl shadow-lg p-6 flex flex-col border border-slate-700 hover:border-cyan-500 transition-all duration-300">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-3 text-cyan-400">{article.title}</h2>
        <p className="text-slate-400 mb-4">{article.introduction}</p>
        
        <div className="space-y-4 mb-6">
            {article.sections.map((section, index) => (
                <div key={index}>
                    <h3 className="font-semibold text-slate-300 mb-1">{section.heading}</h3>
                    <ul className="list-disc list-inside text-slate-400 space-y-1 pl-2">
                        {section.points.map((point, pIndex) => (
                            <li key={pIndex}>{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-100 mb-2">Original Conclusion</h4>
            <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-400">
              {article.existingConclusion}
            </blockquote>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-100 mb-2">AI-Generated Conclusion</h4>
            {article.generatedConclusion ? (
              <blockquote className="border-l-4 border-purple-500 bg-purple-900/20 p-4 rounded-r-lg text-slate-300">
                {article.generatedConclusion}
              </blockquote>
            ) : error ? (
                <div className="text-red-400 bg-red-900/30 p-3 rounded-md">{error}</div>
            ) : (
              <div className="text-slate-500 italic p-4 text-center border-2 border-dashed border-slate-700 rounded-lg">
                Click the button below to generate a new conclusion with AI.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleGenerateClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <Loader />
              Generating...
            </>
          ) : (
            <>
                <WandIcon className="w-5 h-5" />
                {article.generatedConclusion ? 'Regenerate Conclusion' : 'Generate Conclusion'}
            </>
          )}
        </button>
      </div>
    </article>
  );
};
