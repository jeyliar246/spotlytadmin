import './ActivityTable.css';

type Column<T> = {
  key: keyof T;
  label: string;
  transform?: (value: T[keyof T], row: T) => string;
};

interface ActivityTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: string;
}

function ActivityTable<T>({ title, description, columns, data, isLoading = false, emptyState }: ActivityTableProps<T>) {
  return (
    <section className="activity-card">
      <header className="activity-card__header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </header>

      <div className="activity-card__body">
        {isLoading ? (
          <div className="activity-card__loading">Loading…</div>
        ) : data.length === 0 ? (
          <div className="activity-card__empty">{emptyState || 'No data yet.'}</div>
        ) : (
          <div className="activity-table__scroll">
            <table className="activity-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((column) => {
                      const rawValue = row[column.key];
                      const displayValue = column.transform ? column.transform(rawValue, row) : String(rawValue ?? '—');
                      return <td key={column.label}>{displayValue}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ActivityTable;
