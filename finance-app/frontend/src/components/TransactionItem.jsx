/**
 * TransactionItem.jsx
 * Displays a single transaction with animated slide-in, color-coded badges,
 * and a styled delete action.
 */

import { useEffect, useRef, useState } from "react";
import { deleteTransaction } from "../api/transactions.js";

function formatAmount(type, amount) {
  const n = Number(amount);
  const sign = type === "expense" ? "−" : "+";
  if (!Number.isFinite(n)) return `${sign}${amount}`;
  return `${sign}$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <polyline points="19 12 12 19 5 12"/>
  </svg>
);

export default function TransactionItem({ transaction, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const itemRef = useRef(null);

  // Stagger the animation based on DOM position
  useEffect(() => {
    if (itemRef.current) {
      const siblings = itemRef.current.parentElement?.children;
      if (siblings) {
        const idx = Array.from(siblings).indexOf(itemRef.current);
        itemRef.current.style.animationDelay = `${Math.min(idx * 0.05, 0.4)}s`;
      }
    }
  }, []);

  const handleDelete = async () => {
    const ok = window.confirm("Delete this transaction?");
    if (!ok) return;

    setDeleting(true);
    try {
      await deleteTransaction(transaction.id);
      if (typeof onDeleted === "function") onDeleted(transaction.id);
    } catch (e) {
      alert(e.message || "Failed to delete transaction");
      setDeleting(false);
    }
  };

  const isIncome = transaction.type === "income";

  return (
    <li className="tx-item" ref={itemRef} aria-label={`${transaction.type} transaction`}>
      <div className="tx-item__main">
        <div className="tx-item__top">
          <div className="tx-item__date">{formatDate(transaction.date)}</div>
          <div
            className={`tx-item__amount ${
              isIncome ? "tx-item__amount--income" : "tx-item__amount--expense"
            }`}
          >
            {formatAmount(transaction.type, transaction.amount)}
          </div>
        </div>

        <div className="tx-item__meta">
          <span className={`pill ${isIncome ? "pill--income" : "pill--expense"}`}>
            {isIncome ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {isIncome ? "Income" : "Expense"}
          </span>
          <span className="tx-item__category">{transaction.category_or_source}</span>
        </div>

        {transaction.description ? (
          <div className="tx-item__desc" title={transaction.description}>
            {transaction.description}
          </div>
        ) : null}
      </div>

      <button
        className="btn btn--danger btn--icon"
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete transaction"
        title="Delete"
      >
        {deleting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <TrashIcon />}
      </button>
    </li>
  );
}
