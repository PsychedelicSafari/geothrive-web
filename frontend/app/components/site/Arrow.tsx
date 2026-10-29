export default function Arrow({ diagonal = false }: { diagonal?: boolean }): React.ReactElement {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="site-arrow">
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}
