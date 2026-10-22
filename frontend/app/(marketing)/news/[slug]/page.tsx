import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { newsPosts } from '@/lib/news';
import Arrow from '../../../components/site/Arrow';

export const dynamicParams = false;
export function generateStaticParams(): Array<{ slug: string }> {
  return newsPosts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);
  if (!post) return { title: 'Field note not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: 'article', title: post.title, description: post.excerpt },
  };
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactElement> {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const watchUrl = `https://www.youtube.com/watch?v=${post.videoId}`;
  return (
    <article className="site-container news-article">
      <header>
        <Link href="/news" className="site-text-link">
          ← All field notes
        </Link>
        <p className="site-eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="site-lead">{post.excerpt}</p>
        <p className="news-date">
          GeoThrive Africa · Selected 17 October 2026 · Original video:{' '}
          <time dateTime={post.videoDate}>{post.dateLabel}</time>
        </p>
      </header>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="news-video-preview"
        aria-label={`Watch ${post.videoTitle} on YouTube (opens in new tab)`}
      >
        <Image
          src={`/images/video-${post.videoId}.jpg`}
          alt={`Preview of ${post.videoTitle}`}
          width={480}
          height={360}
          sizes="(max-width: 800px) 100vw, 850px"
        />
        <span className="news-play" aria-hidden="true">
          ▶
        </span>
      </a>
      <div className="news-article-body">
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="site-button">
          Watch the original video on YouTube <Arrow diagonal />
        </a>
        <aside className="news-source">
          <p className="site-eyebrow">From Kshetra | GeoThrive Africa</p>
          <p>
            <cite>{post.videoTitle}</cite>
          </p>
          <p>{post.sourceNote}</p>
        </aside>
        <Link href={post.relatedHref} className="site-text-link">
          {post.relatedLabel} <Arrow />
        </Link>
      </div>
    </article>
  );
}
