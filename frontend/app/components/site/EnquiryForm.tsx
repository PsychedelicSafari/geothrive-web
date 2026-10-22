'use client';

import { useState } from 'react';
import { contactEmail, services } from '@/lib/site';
import Arrow from './Arrow';

export default function EnquiryForm(): React.ReactElement {
  const [draft, setDraft] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');

  function prepareEnquiry(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get('name') ?? '').trim();
    const email = String(fields.get('email') ?? '').trim();
    const organisation = String(fields.get('organisation') ?? '').trim();
    const interest = String(fields.get('interest') ?? 'A spatial project');
    const message = String(fields.get('message') ?? '').trim();
    if (!name || !email || !message) {
      setValidationError('Please add your name, email address and a short project description.');
      return;
    }
    setValidationError('');
    const subject = `GeoThrive enquiry: ${interest}`;
    const body = `Hello Kshetra,\n\n${message}\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation || 'Not provided'}\nInterest: ${interest}`;
    setDraft(
      `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  }

  return (
    <form
      className="site-enquiry-form"
      onSubmit={prepareEnquiry}
      onChange={() => {
        setDraft(null);
        setValidationError('');
      }}
    >
      <div className="site-form-row">
        <div>
          <label id="enquiry-name-label" htmlFor="enquiry-name">
            Your name <span>(required)</span>
          </label>
          <input
            id="enquiry-name"
            aria-labelledby="enquiry-name-label"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
          />
        </div>
        <div>
          <label id="enquiry-email-label" htmlFor="enquiry-email">
            Email address <span>(required)</span>
          </label>
          <input
            id="enquiry-email"
            aria-labelledby="enquiry-email-label"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>
      </div>
      <div>
        <label id="enquiry-organisation-label" htmlFor="enquiry-organisation">
          Organisation <span>(optional)</span>
        </label>
        <input
          id="enquiry-organisation"
          aria-labelledby="enquiry-organisation-label"
          name="organisation"
          autoComplete="organization"
          maxLength={160}
        />
      </div>
      <div>
        <label htmlFor="enquiry-interest">What would you like to explore?</label>
        <select id="enquiry-interest" name="interest">
          <option>A spatial project</option>
          {services.map((service) => (
            <option key={service.id}>{service.title}</option>
          ))}
          <option>A collaboration</option>
        </select>
      </div>
      <div>
        <label id="enquiry-message-label" htmlFor="enquiry-message">
          Tell me about your project <span>(required)</span>
        </label>
        <textarea
          id="enquiry-message"
          aria-labelledby="enquiry-message-label"
          name="message"
          rows={5}
          required
          maxLength={2000}
          placeholder="The place, the question, and what you hope to achieve."
        />
      </div>
      <p className="site-form-note" id="enquiry-delivery-note">
        This form prepares an email draft in your email app. You review and send it there. Nothing
        is sent or saved by this form.
      </p>
      <button type="submit" className="site-button" aria-describedby="enquiry-delivery-note">
        Prepare enquiry <Arrow diagonal />
      </button>
      {validationError ? (
        <p role="alert" className="site-form-note">
          {validationError}
        </p>
      ) : null}
      <div aria-live="polite">
        {draft ? (
          <div className="site-draft-ready">
            <p>Your enquiry is ready to review.</p>
            <a href={draft} className="site-text-link">
              Open email draft <Arrow diagonal />
            </a>
            <p>
              Having trouble opening your email app? You can email{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a> directly.
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
