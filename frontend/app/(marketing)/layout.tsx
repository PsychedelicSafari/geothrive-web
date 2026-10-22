import SiteHeader from '../components/site/SiteHeader';
import SiteFooter from '../components/site/SiteFooter';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="marketing">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
