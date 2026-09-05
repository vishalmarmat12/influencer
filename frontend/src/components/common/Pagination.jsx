import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
  currentPage = 1, 
  totalItems = 0, 
  itemsPerPage = 20, 
  onPageChange 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalItems <= itemsPerPage) return null; // No pagination needed if 20 or fewer items

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
        Showing <strong style={{ color: 'var(--text-main)' }}>{startIndex}</strong> to <strong style={{ color: 'var(--text-main)' }}>{endIndex}</strong> of <strong style={{ color: 'var(--text-main)' }}>{totalItems}</strong> entries (20 per page)
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: currentPage <= 1 ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onPageChange(1)}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            >
              1
            </button>
            {startPage > 2 && <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.8rem',
              fontWeight: p === currentPage ? 700 : 500
            }}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>...</span>}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onPageChange(totalPages)}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: currentPage >= totalPages ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '2px' }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
