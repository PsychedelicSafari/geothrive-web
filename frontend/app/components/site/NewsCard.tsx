import Image from 'next/image';
import Link from 'next/link';
import { newsPosts } from '@/lib/news';
import Arrow from './Arrow';

export default function NewsCard({
  post,
  heading = 'h2',
}: {
  post: (typeof newsPosts)[number];
  heading?: 'h2' | 'h3';
}): React.ReactElement {
  const Heading = heading;
  return (
    <article className="news-card">
      <Link
        href={`/news/${post.slug}`}
        className="news-card-image"
        aria-label={`Read ${post.title}`}
      >
        <Image
          src={`/images/video-${post.videoId}.jpg`}
          alt={`Video preview: ${post.videoTitle}`}
          width={480}
          height={360}
          sizes="(max-width: 800px) 100vw, 33vw"
        />
        <span aria-hidden="true">↗</span>
      </Link>
      <div className="news-card-copy">
        <p className="site-eyebrow">{post.category}</p>
        <p className="news-date">
          Original video · <time dateTime={post.videoDate}>{post.dateLabel}</time>
        </p>
        <Heading>
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </Heading>
        <p>{post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className="site-text-link">
          Read the field note <Arrow />
        </Link>
      </div>
    </article>
  );
}
