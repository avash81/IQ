import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogBySlug } from '../lib/db';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { SEO } from '../components/seo/SEO.tsx';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getBlogBySlug(slug).then(data => {
        setBlog(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-white">Blog not found.</div>;

  return (
    <div className="min-h-screen bg-brand-navy pt-24 pb-20 px-4">
      <SEO 
        title={`${blog.title} — IQTest Pro Blog`}
        description={blog.metaDescription || `Read our latest article on ${blog.title}. Explore cognitive research and intelligence insights.`}
        keywords={blog.keywords?.join(', ') || `iq test, intelligence, ${blog.title}, cognitive science`}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.title,
          "description": blog.metaDescription,
          "author": {
            "@type": "Organization",
            "name": "IQTest Pro"
          },
          "datePublished": blog.createdAt,
          "publisher": {
            "@type": "Organization",
            "name": "IQTest Pro",
            "logo": {
              "@type": "ImageObject",
              "url": "https://iqtestpro.com/logo.png"
            }
          }
        })}
      </script>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-black text-white mb-8">{blog.title}</h1>
        <div className="prose prose-lg prose-invert prose-brand-gold">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
}
