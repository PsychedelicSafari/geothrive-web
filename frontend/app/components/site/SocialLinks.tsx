import { socialProfiles } from '@/lib/site';

function SocialIcon({ network }: { network: 'x' | 'youtube' | 'linkedin' }): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`social-icon social-icon-${network}`}
      fill="currentColor"
      aria-hidden="true"
    >
      {network === 'x' && (
        <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-7.4L5.6 22H2.4l8.2-9.4L.8 2h6.4l4.4 6.6L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" />
      )}
      {network === 'youtube' && (
        <>
          <rect x="1" y="4" width="22" height="16" rx="5" fill="#ed3156" />
          <path d="m10 8 6 4-6 4Z" fill="#fff" />
        </>
      )}
      {network === 'linkedin' && (
        <>
          <rect width="24" height="24" rx="3" fill="#1674b8" />
          <path
            d="M5 9h3v10H5V9Zm1.5-4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM10 9h3v1.4c.6-1 1.5-1.7 3-1.7 3 0 3.5 1.9 3.5 4.4V19h-3v-5.2c0-1.2 0-2.7-1.7-2.7S13 12.4 13 13.8V19h-3V9Z"
            fill="#fff"
          />
        </>
      )}
    </svg>
  );
}

export default function SocialLinks(): React.ReactElement {
  return (
    <nav className="site-socials" aria-label="Kshetra’s social profiles">
      {socialProfiles.map(({ network, label, handle, url }) => (
        <a
          key={network}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}: ${handle} (opens in new tab)`}
        >
          <SocialIcon network={network} />
          <span>
            {label}
            <small>{handle}</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}
