import type { Metadata } from 'next';
import { newsPosts } from '@/lib/news';
import NewsCard from '../../components/site/NewsCard';
import SocialLinks from '../../components/site/SocialLinks';

export const metadata: Metadata = {
  title: 'News & Field Notes',
  description:
    'Grid activation, regenerative geography and spatial intelligence. Three field notes from Kshetra’s GeoThrive Africa YouTube channel.',
};

export default function NewsPage(): React.ReactElement {
  return (
    <>
      <section className="site-container site-page-intro">
        <p className="site-eyebrow">News & field notes / Kshetra’s video journal</p>
        <h1>
          Ideas from the field.
          <br />
          <em>Connections worth sharing.</em>
        </h1>
        <p>
          Grid activation, local opportunity and the evidence behind regenerative geography. Explore
          three selected conversations from the GeoThrive Africa YouTube channel.
        </p>
      </section>
      <section className="site-container news-grid" aria-label="Latest field notes">
        {newsPosts.map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </section>
      <section className="site-container news-follow">
        <p className="site-eyebrow">Keep the conversation moving</p>
        <h2>
          Follow the geography.
          <br />
          <em>Join the conversation.</em>
        </h2>
        <SocialLinks />
      </section>
    </>
  );
}
