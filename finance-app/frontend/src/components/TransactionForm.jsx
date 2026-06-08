/**
 * TransactionForm.jsx
 * Form to create a new income/expense transaction.
 * Features: icon-prefixed inputs, gradient submit button, success toast.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCategories } from "../api/categories.js";
import { createTransaction } from "../api/transactions.js";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ── Icons ─────────────────────────────────────────── */
const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 6h16M4 12h8m-8 6h16"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
);

const TextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="17" y1="10" x2="3" y2="10"/>
    <line x1="21" y1="6"  x2="3" y2="6"/>
    <line x1="21" y1="14" x2="3" y2="14"/>
    <line x1="17" y1="18" x2="3" y2="18"/>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5"  y1="12" x2="19" y2="12"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TrendUpSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const TrendDownSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
);

/* ── Toast ─────────────────────────────────────────── */
function Toast({ message, onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2200);
    const t2 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="toast-container" aria-live="polite">
      <div className={`toast toast--success${exiting ? " toast--exiting" : ""}`} role="status">
        <div className="toast__icon">
          <CheckIcon />
        </div>
        <div className="toast__body">
          <div className="toast__title">Transaction added!</div>
          <div className="toast__msg">{message}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */
export default function TransactionForm({ onCreated }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [categoryOrSource, setCategoryOrSource] = useState("");
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const [categories, setCategories] = useState({
    income_sources: [],
    expense_categories: [],
  });
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState(null);

  const options = useMemo(() => {
    return type === "income"
      ? categories.income_sources
      : categories.expense_categories;
  }, [categories, type]);

  useEffect(() => {
    let cancelled = false;
    setLoadingCategories(true);
    fetchCategories()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch((e) => { if (!cancelled) setError(e.message || "Failed to load categories"); })
      .finally(() => { if (!cancelled) setLoadingCategories(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!categoryOrSource && options.length > 0) {
      setCategoryOrSource(options[0]);
    }
  }, [options, categoryOrSource]);

  // Reset category when type changes
  useEffect(() => {
    setCategoryOrSource("");
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!categoryOrSource) {
      setError("Please select a category or source.");
      return;
    }
    if (!date) {
      setError("Please choose a date.");
      return;
    }

    setSubmitting(true);
    try {
      await createTransaction({
        type,
        amount: numericAmount,
        category_or_source: categoryOrSource,
        date,
        description: description.trim() ? description.trim() : null,
        tags: tags.trim() ? tags.trim() : null,
      });

      setAmount("");
      setDescription("");
      setTags("");
      setDate(todayISO());

      setToastMsg(
        `${type === "income" ? "+" : "−"}$${numericAmount.toFixed(2)} · ${categoryOrSource}`
      );

      if (typeof onCreated === "function") onCreated();
    } catch (e2) {
      setError(e2.message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const clearToast = useCallback(() => setToastMsg(null), []);

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onDone={clearToast} />}

      <section className="card">
        <h2 className="card__title">Add Transaction</h2>

        {error ? (
          <div className="alert alert--error" role="alert" style={{ marginBottom: 12 }}>
            {error}
          </div>
        ) : null}

        <form className="form" onSubmit={handleSubmit} id="transaction-form" noValidate>
          {/* Type toggle */}
          <div className="form__row">
            <label className="label">Transaction type</label>
            <div className="segmented" role="group" aria-label="Transaction type">
              <button
                type="button"
                id="type-expense"
                className={`segmented__btn${type === "expense" ? " segmented__btn--active" : ""}`}
                onClick={() => setType("expense")}
                aria-pressed={type === "expense"}
              >
                <TrendDownSmall />
                Expense
              </button>
              <button
                type="button"
                id="type-income"
                className={`segmented__btn${type === "income" ? " segmented__btn--active" : ""}`}
                onClick={() => setType("income")}
                aria-pressed={type === "income"}
              >
                <TrendUpSmall />
                Income
              </button>
            </div>
          </div>

          {/* Amount / Category / Date row */}
          <div className="form__grid">
            <div className="form__field">
              <label className="label" htmlFor="amount">Amount</label>
              <div className="input-wrapper">
                <span className="input-icon"><DollarIcon /></span>
                <input
                  id="amount"
                  className="input input--with-icon"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form__field">
              <label className="label" htmlFor="category">
                {type === "income" ? "Source" : "Category"}
              </label>
              <div className="input-wrapper">
                <span className="input-icon"><CategoryIcon /></span>
                <select
                  id="category"
                  className="select input--with-icon"
                  value={categoryOrSource}
                  onChange={(e) => setCategoryOrSource(e.target.value)}
                  disabled={loadingCategories}
                  required
                >
                  {loadingCategories && <option value="">Loading…</option>}
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form__field">
              <label className="label" htmlFor="date">Date</label>
              <div className="input-wrapper">
                <span className="input-icon"><CalendarIcon /></span>
                <input
                  id="date"
                  className="input input--with-icon"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form__field">
            <label className="label" htmlFor="description">
              Description <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon"><TextIcon /></span>
              <input
                id="description"
                className="input input--with-icon"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., weekly groceries"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form__field">
            <label className="label" htmlFor="tags">
              Tags <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon"><TagIcon /></span>
              <input
                id="tags"
                className="input input--with-icon"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., food, weekly"
              />
            </div>
          </div>

          <button
            className="btn btn--primary btn--full"
            type="submit"
            id="submit-transaction"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" />
                Saving…
              </>
            ) : (
              <>
                <PlusIcon />
                Add Transaction
              </>
            )}
          </button>
        </form>
      </section>
    </>
  );
}
