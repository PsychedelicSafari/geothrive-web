export default function MappingWorkflowVisual({ step }: { step: number }): React.ReactElement {
  return (
    <svg className="kiosk-workflow-visual" viewBox="0 0 280 140" fill="none" aria-hidden="true">
      <path
        d="M0 32 85 13l89 25 106-18M0 98l79-21 94 33 107-24M60 0l21 140M182 0l-14 140"
        stroke="currentColor"
        opacity=".17"
      />
      {step === 1 && (
        <>
          <circle cx="140" cy="64" r="35" stroke="currentColor" strokeDasharray="3 6" />
          <path
            d="M140 112s-25-29-25-48a25 25 0 0 1 50 0c0 19-25 48-25 48Z"
            fill="#d7ed80"
            stroke="currentColor"
          />
          <circle cx="140" cy="64" r="8" stroke="currentColor" />
        </>
      )}
      {step === 2 && (
        <>
          <path d="m139 31 43 24v49l-43 24-43-24V55Z" fill="#a9c48a" stroke="currentColor" />
          <path
            d="m96 55 43 24 43-24M139 79v49M88 29l43 24 43-24-43-24Z"
            fill="#d7ed80"
            stroke="currentColor"
          />
          <path d="m115 100 14-18 9 8 11-21 21 31" stroke="currentColor" />
        </>
      )}
      {step === 3 && (
        <>
          <path d="m67 50 72 38 70-47M139 88l-5 38" stroke="currentColor" strokeDasharray="4 4" />
          <circle cx="67" cy="50" r="18" fill="#d7ed80" stroke="currentColor" />
          <circle cx="139" cy="88" r="23" fill="#a9c48a" stroke="currentColor" />
          <circle cx="209" cy="41" r="15" fill="#d7ed80" stroke="currentColor" />
          <path d="M131 88h16M139 80v16M61 50h12M203 41h12" stroke="currentColor" />
        </>
      )}
      {step === 4 && (
        <>
          <rect x="98" y="20" width="85" height="104" rx="3" fill="#f6f5ed" stroke="currentColor" />
          <path d="M113 45h55M113 61h32M113 77h42M113 100h24" stroke="currentColor" />
          <circle cx="184" cy="99" r="23" fill="#d7ed80" stroke="currentColor" />
          <path d="m174 99 7 7 14-15" stroke="currentColor" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
