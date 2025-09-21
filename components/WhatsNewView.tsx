import React from 'react';
import type { UpdatePost } from '../types';
import { SparklesIcon } from './icons';

interface WhatsNewViewProps {
  posts: UpdatePost[];
}

const WhatsNewView: React.FC<WhatsNewViewProps> = ({ posts }) => {
  return (
    <div className="flex-1 flex flex-col bg-zinc-900 overflow-hidden">
      <div className="p-4 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 shrink-0">
        <h1 className="text-lg font-semibold text-center">What's New</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
              <div className="flex items-baseline gap-4 mb-3 text-zinc-400">
                <span className="text-sm font-semibold bg-purple-600/50 text-purple-200 px-2 py-0.5 rounded-full">{post.version}</span>
                <time dateTime={post.id} className="text-sm">{post.date}</time>
              </div>
              <h2 className="text-2xl font-bold text-white">{post.title}</h2>
              <div className="mt-4 text-zinc-300 space-y-2 prose prose-invert prose-sm">
                {post.description.split('\n').map((line, index) => {
                  if (line.trim().startsWith('*')) {
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <SparklesIcon className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
                        <p className="m-0">{line.replace('*', '').trim()}</p>
                      </div>
                    );
                  }
                  return <p key={index} className="m-0">{line}</p>;
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatsNewView;
