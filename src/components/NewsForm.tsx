import { FormEvent, useState } from 'react';
import './NewsForm.css';

interface NewsFormProps {
  onCreate: (payload: {
    title: string;
    body: string;
    feature: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    isPinned?: boolean;
  }) => Promise<void> | void;
}

const features = [
  { value: 'social_growth', label: 'Social Growth' },
  { value: 'spotlyt_courses', label: 'Spotlyt Courses' },
  { value: 'spotlyt_jobs', label: 'Spotlyt Jobs' },
  { value: 'product_update', label: 'Product Update' },
  { value: 'community', label: 'Community' },
  { value: 'general', label: 'General' },
];

const NewsForm = ({ onCreate }: NewsFormProps) => {
  const [form, setForm] = useState({
    title: '',
    body: '',
    feature: 'general',
    imageUrl: '',
    ctaLabel: '',
    ctaUrl: '',
    isPinned: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onCreate({
        title: form.title.trim(),
        body: form.body.trim(),
        feature: form.feature,
        imageUrl: form.imageUrl.trim() || undefined,
        ctaLabel: form.ctaLabel.trim() || undefined,
        ctaUrl: form.ctaUrl.trim() || undefined,
        isPinned: form.isPinned,
      });

      setSuccess('News item published!');
      setForm({ title: '', body: '', feature: 'general', imageUrl: '', ctaLabel: '', ctaUrl: '', isPinned: false });
    } catch (err: any) {
      setError(err.message || 'Unable to publish news');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="news-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Headline</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
        </label>

        <label>
          <span>Feature</span>
          <select
            value={form.feature}
            onChange={(event) => setForm((prev) => ({ ...prev, feature: event.target.value }))}
          >
            {features.map((feature) => (
              <option key={feature.value} value={feature.value}>
                {feature.label}
              </option>
            ))}
          </select>
        </label>

        <label className="full-width">
          <span>Body</span>
          <textarea
            value={form.body}
            onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
            rows={4}
            required
          />
        </label>

        <label>
          <span>Image URL (optional)</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            placeholder="https://"
          />
        </label>

        <label>
          <span>CTA Label (optional)</span>
          <input
            type="text"
            value={form.ctaLabel}
            onChange={(event) => setForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
          />
        </label>

        <label>
          <span>CTA URL (optional)</span>
          <input
            type="url"
            value={form.ctaUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, ctaUrl: event.target.value }))}
            placeholder="https://"
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(event) => setForm((prev) => ({ ...prev, isPinned: event.target.checked }))}
          />
          <span>Pin this announcement</span>
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Publishing…' : 'Publish News'}
      </button>
    </form>
  );
};

export default NewsForm;
