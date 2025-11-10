import { useState } from 'react';
import type { SpotlytNews } from '../types';
import './NewsList.css';

interface NewsListProps {
  news: SpotlytNews[];
  onUpdate: (id: string, updates: Partial<SpotlytNews>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

const NewsList = ({ news, onUpdate, onDelete }: NewsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<Partial<SpotlytNews>>({});
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleEdit = (item: SpotlytNews) => {
    setEditingId(item.id);
    setPendingUpdate({ ...item });
    setError(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setPendingUpdate({});
  };

  const handleSave = async (id: string) => {
    setLoadingId(id);
    setError(null);
    try {
      await onUpdate(id, pendingUpdate);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || 'Unable to update news');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const confirmation = window.confirm('Delete this news item?');
    if (!confirmation) return;
    setLoadingId(id);
    try {
      await onDelete(id);
    } catch (err: any) {
      setError(err.message || 'Unable to delete news');
    } finally {
      setLoadingId(null);
    }
  };

  if (!news.length) {
    return <div className="news-list-empty">No news yet. Create your first announcement above.</div>;
  }

  return (
    <div className="news-list">
      {error && <div className="news-list-error">{error}</div>}
      {news.map((item) => {
        const isEditing = editingId === item.id;

        return (
          <div key={item.id} className="news-list-item">
            <div className="news-list-header">
              {isEditing ? (
                <input
                  value={pendingUpdate.title || ''}
                  onChange={(event) => setPendingUpdate((prev) => ({ ...prev, title: event.target.value }))}
                />
              ) : (
                <h3>{item.title}</h3>
              )}

              <div className="news-list-actions">
                {isEditing ? (
                  <>
                    <button onClick={() => handleSave(item.id)} disabled={loadingId === item.id}>
                      Save
                    </button>
                    <button className="secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button className="danger" onClick={() => handleDeleteClick(item.id)} disabled={loadingId === item.id}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="news-list-meta">
              {isEditing ? (
                <select
                  value={pendingUpdate.feature || 'general'}
                  onChange={(event) => setPendingUpdate((prev) => ({ ...prev, feature: event.target.value }))}
                >
                  <option value="social_growth">Social Growth</option>
                  <option value="spotlyt_courses">Spotlyt Courses</option>
                  <option value="spotlyt_jobs">Spotlyt Jobs</option>
                  <option value="product_update">Product Update</option>
                  <option value="community">Community</option>
                  <option value="general">General</option>
                </select>
              ) : (
                <span className="badge">{item.feature}</span>
              )}

              <span>{item.is_published ? 'Published' : 'Draft'}</span>
              <span>{item.is_pinned ? 'Pinned' : ''}</span>
              <span>
                {item.published_at
                  ? new Date(item.published_at).toLocaleString()
                  : `Created ${new Date(item.created_at).toLocaleString()}`}
              </span>
            </div>

            <div className="news-list-body">
              {isEditing ? (
                <textarea
                  value={pendingUpdate.body || ''}
                  onChange={(event) => setPendingUpdate((prev) => ({ ...prev, body: event.target.value }))}
                  rows={3}
                />
              ) : (
                <p>{item.body}</p>
              )}
            </div>

            {isEditing && (
              <div className="news-list-edit-options">
                <label>
                  CTA Label
                  <input
                    value={pendingUpdate.cta_label || ''}
                    onChange={(event) => setPendingUpdate((prev) => ({ ...prev, cta_label: event.target.value }))}
                  />
                </label>
                <label>
                  CTA URL
                  <input
                    value={pendingUpdate.cta_url || ''}
                    onChange={(event) => setPendingUpdate((prev) => ({ ...prev, cta_url: event.target.value }))}
                  />
                </label>
                <label>
                  Image URL
                  <input
                    value={pendingUpdate.image_url || ''}
                    onChange={(event) => setPendingUpdate((prev) => ({ ...prev, image_url: event.target.value }))}
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={pendingUpdate.is_published ?? true}
                    onChange={(event) => setPendingUpdate((prev) => ({ ...prev, is_published: event.target.checked }))}
                  />
                  <span>Published</span>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={pendingUpdate.is_pinned ?? false}
                    onChange={(event) => setPendingUpdate((prev) => ({ ...prev, is_pinned: event.target.checked }))}
                  />
                  <span>Pinned</span>
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NewsList;
