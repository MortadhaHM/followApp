/**
 * TransactionList.jsx
 * Fetches and renders transactions with skeleton loading, empty state,
 * live category search/filter bar, and "Load More" pagination (5 items by default, all items when searching).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { listTransactions } from "../api/transactions.js";
import TransactionItem from "./TransactionItem.jsx";

/* ── Icons ─────────────────────────────────────────── */
const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const XSmallIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const FilterOffIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

/* ── Skeleton ───────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div className="skeleton skeleton-line" style={{ width: "30%" }} />
        <div className="skeleton skeleton-line" style={{ width: "20%" }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <div className="skeleton skeleton-line" style={{ width: "15%", height: 20, borderRadius: 999 }} />
        <div className="skeleton skeleton-line" style={{ width: "25%" }} />
      </div>
    </div>
  );
}

/* ── Summary helpers ────────────────────────────────── */
function computeSummary(transactions) {
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === "income") income += amt;
    else expense += amt;
  }
  return { income, expense, balance: income - expense };
}

function formatMoney(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Summary icons ──────────────────────────────────── */
const TrendUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
);

const ScaleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

/* ── Main component ─────────────────────────────────── */
export default function TransactionList({ refreshSignal, onEdit }) {
  const [transactions, setTransactions]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");
  const [query, setQuery]                     = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [displayLimit, setDisplayLimit]       = useState(5);
  const searchRef                             = useRef(null);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await listTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  const handleDeleted = () => load();
  const handleEdit    = (tx) => typeof onEdit === "function" && onEdit(tx);

  /* ── Live filtering ────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((tx) =>
      tx.category_or_source?.toLowerCase().includes(q) ||
      tx.description?.toLowerCase().includes(q) ||
      tx.tags?.toLowerCase().includes(q)
    );
  }, [transactions, query]);

  const isFiltering = query.trim().length > 0;

  /* ── Pagination: Limit 5 by default, all when searching ─ */
  const visibleTransactions = useMemo(() => {
    if (isFiltering) {
      return filtered; // show all matching transactions when searching
    }
    return filtered.slice(0, displayLimit);
  }, [filtered, isFiltering, displayLimit]);

  const hasMore = !isFiltering && displayLimit < filtered.length;

  /* ── Autocomplete suggestions (unique category names) ── */
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set();
    return transactions
      .map((tx) => tx.category_or_source)
      .filter((cat) => {
        if (!cat) return false;
        const key = cat.toLowerCase();
        if (!key.includes(q) || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 5);
  }, [transactions, query]);

  /* ── Summary always from full list ─────────────────── */
  const { income, expense, balance } = computeSummary(transactions);
  const showSummary = !loading && !error && transactions.length > 0;

  return (
    <>
      {/* Summary cards */}
      {showSummary && (
        <div className="summary-grid" aria-label="Financial summary">
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--income"><TrendUpIcon /></div>
            <div className="summary-card__label">Income</div>
            <div className="summary-card__value summary-card__value--income">{formatMoney(income)} DT</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--expense"><TrendDownIcon /></div>
            <div className="summary-card__label">Expenses</div>
            <div className="summary-card__value summary-card__value--expense">{formatMoney(expense)} DT</div>
          </div>
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--balance"><ScaleIcon /></div>
            <div className="summary-card__label">Balance</div>
            <div
              className="summary-card__value"
              style={{ color: balance >= 0 ? "var(--income-color)" : "var(--expense-color)" }}
            >
              {balance >= 0 ? "+" : "−"}{formatMoney(Math.abs(balance))} DT
            </div>
          </div>
        </div>
      )}

      <section className="card">
        {/* Header */}
        <div className="card__header">
          <h2 className="card__title">Transactions</h2>
          <button
            className="btn btn--secondary"
            type="button"
            onClick={load}
            disabled={loading}
            id="refresh-btn"
            aria-label="Refresh transactions"
          >
            <RefreshIcon />
            Refresh
          </button>
        </div>

        {/* ── Search / Filter bar ───────────────────────── */}
        {!loading && !error && transactions.length > 0 && (
          <div className="tx-search-wrap" role="search">
            <div className="tx-search-box">
              <span className="tx-search-icon"><SearchIcon /></span>
              <input
                ref={searchRef}
                id="tx-search"
                className="tx-search-input"
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search by category, description or tag…"
                autoComplete="off"
                aria-label="Search transactions"
                aria-autocomplete="list"
                aria-controls="tx-suggestions"
              />
              {isFiltering && (
                <button
                  className="tx-search-clear"
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                  aria-label="Clear search"
                  title="Clear"
                >
                  <XSmallIcon />
                </button>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul
                id="tx-suggestions"
                className="tx-search-suggestions"
                role="listbox"
                aria-label="Category suggestions"
              >
                {suggestions.map((cat) => (
                  <li
                    key={cat}
                    className="tx-search-suggestion"
                    role="option"
                    aria-selected="false"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setQuery(cat); setShowSuggestions(false); }}
                  >
                    <span className="tx-search-suggestion__icon"><SearchIcon /></span>
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Results count pill */}
            {isFiltering && (
              <div className="tx-filter-badge">
                {filtered.length === 0 ? (
                  <span>No matches for <strong>"{query.trim()}"</strong></span>
                ) : (
                  <>
                    <span className="tx-filter-badge__count">{filtered.length}</span>
                    <span> result{filtered.length !== 1 ? "s" : ""} for </span>
                    <span className="tx-filter-badge__query">"{query.trim()}"</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div style={{ display: "grid", gap: 10 }} aria-label="Loading transactions" aria-busy="true">
            <SkeletonRow /><SkeletonRow /><SkeletonRow />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert--error" role="alert">{error}</div>
        )}

        {/* Empty — no transactions at all */}
        {!loading && !error && transactions.length === 0 && (
          <div className="empty-state" role="status">
            <div className="empty-state__icon"><ReceiptIcon /></div>
            <p className="empty-state__title">No transactions yet</p>
            <p className="empty-state__text">
              Add your first transaction using the form — track every dollar in and out.
            </p>
          </div>
        )}

        {/* Empty — search has no results */}
        {!loading && !error && transactions.length > 0 && isFiltering && filtered.length === 0 && (
          <div className="empty-state empty-state--filter" role="status">
            <div className="empty-state__icon"><FilterOffIcon /></div>
            <p className="empty-state__title">No matching transactions</p>
            <p className="empty-state__text">
              Nothing matches <strong>"{query.trim()}"</strong>.{" "}
              <button
                className="tx-clear-link"
                type="button"
                onClick={() => setQuery("")}
              >
                Clear filter
              </button>
            </p>
          </div>
        )}

        {/* List */}
        {!loading && !error && visibleTransactions.length > 0 && (
          <>
            <ul className="tx-list" aria-label="Transaction list">
              {visibleTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onDeleted={handleDeleted}
                  onEdit={handleEdit}
                />
              ))}
            </ul>

            {/* Load More & View Less Buttons */}
            {!isFiltering && (hasMore || displayLimit > 5) && (
              <div className="tx-load-more-wrap">
                <div className="tx-pagination-buttons">
                  {hasMore && (
                    <button
                      type="button"
                      className="btn btn--secondary tx-load-more-btn"
                      onClick={() => setDisplayLimit((prev) => prev + 5)}
                    >
                      <ChevronDownIcon />
                      Load More ({filtered.length - visibleTransactions.length} remaining)
                    </button>
                  )}
                  {displayLimit > 5 && (
                    <button
                      type="button"
                      className="btn btn--secondary tx-load-more-btn"
                      onClick={() => setDisplayLimit(5)}
                    >
                      <ChevronUpIcon />
                      View Less
                    </button>
                  )}
                </div>
                <span className="tx-load-more-meta">
                  Showing {visibleTransactions.length} of {filtered.length} transactions
                </span>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
