/**
 * TransactionList.jsx
 * Fetches and renders transactions with skeleton loading and empty state.
 */

import { useEffect, useState } from "react";
import { listTransactions } from "../api/transactions.js";
import TransactionItem from "./TransactionItem.jsx";

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

export default function TransactionList({ refreshSignal }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const { income, expense, balance } = computeSummary(transactions);
  const showSummary = !loading && !error && transactions.length > 0;

  return (
    <>
      {/* Summary cards */}
      {showSummary && (
        <div className="summary-grid" aria-label="Financial summary">
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--income">
              <TrendUpIcon />
            </div>
            <div className="summary-card__label">Income</div>
            <div className="summary-card__value summary-card__value--income">
              ${formatMoney(income)}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--expense">
              <TrendDownIcon />
            </div>
            <div className="summary-card__label">Expenses</div>
            <div className="summary-card__value summary-card__value--expense">
              ${formatMoney(expense)}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--balance">
              <ScaleIcon />
            </div>
            <div className="summary-card__label">Balance</div>
            <div
              className="summary-card__value"
              style={{ color: balance >= 0 ? "var(--income-color)" : "var(--expense-color)" }}
            >
              {balance >= 0 ? "+" : "−"}${formatMoney(Math.abs(balance))}
            </div>
          </div>
        </div>
      )}

      <section className="card">
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

        {/* Skeleton loading */}
        {loading && (
          <div style={{ display: "grid", gap: 10 }} aria-label="Loading transactions" aria-busy="true">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert--error" role="alert">{error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && transactions.length === 0 && (
          <div className="empty-state" role="status">
            <div className="empty-state__icon">
              <ReceiptIcon />
            </div>
            <p className="empty-state__title">No transactions yet</p>
            <p className="empty-state__text">
              Add your first transaction using the form — track every dollar in and out.
            </p>
          </div>
        )}

        {/* List */}
        {!loading && !error && transactions.length > 0 && (
          <ul className="tx-list" aria-label="Transaction list">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} onDeleted={handleDeleted} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
