import * as React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../lib/db';
import { SEO } from '../components/seo/SEO.tsx';

export default function Blog() {
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    getBlogs().then(setPosts);
  }, []);

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title="Intelligence Blog — Latest Research & Cognitive Insights | IQTest Pro"
        description="Explore the latest research in cognitive science, intelligence testing, and brain health. Stay informed with expert insights from IQTest Pro."
        keywords="intelligence blog, cognitive research, IQ testing news, brain health, mental performance, psychology articles, IQTest Pro blog"
      />
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black text-white mb-6">Intelligence Blog</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Insights, research, and news from the world of cognitive science.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-brand-navy-mid rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-brand-gold/30 transition-all"
            >
              <div className="p-10">
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  {post.metaDescription}
                </p>
                <Link to={`/blog/${post.slug}`} className="flex items-center gap-2 text-brand-gold font-bold text-sm hover:gap-4 transition-all">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
