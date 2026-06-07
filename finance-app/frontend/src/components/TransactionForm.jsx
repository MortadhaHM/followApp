/**
 * TransactionForm.jsx
 * Form used to create a new income/expense transaction.
 * Loads dropdown values from GET /categories, POSTs to /transactions/ on submit.
 */

import { useEffect, useMemo, useState } from "react";
import { fetchCategories } from "../api/categories.js";
import { createTransaction } from "../api/transactions.js";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

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

  const options = useMemo(() => {
    return type === "income"
      ? categories.income_sources
      : categories.expense_categories;
  }, [categories, type]);

  useEffect(() => {
    let cancelled = false;
    setLoadingCategories(true);
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to load categories");
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Ensure dropdown always has a selection when options change.
  useEffect(() => {
    if (!categoryOrSource && options.length > 0) {
      setCategoryOrSource(options[0]);
    }
  }, [options, categoryOrSource]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!categoryOrSource) {
      setError("Please select a category/source.");
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

      // Clear form after success (keep the chosen type).
      setAmount("");
      setDescription("");
      setTags("");
      setDate(todayISO());

      if (typeof onCreated === "function") onCreated();
    } catch (e2) {
      setError(e2.message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2 className="card__title">Add Transaction</h2>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__row">
          <label className="label">Type</label>
          <div className="segmented">
            <button
              type="button"
              className={`segmented__btn ${
                type === "expense" ? "segmented__btn--active" : ""
              }`}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`segmented__btn ${
                type === "income" ? "segmented__btn--active" : ""
              }`}
              onClick={() => setType("income")}
            >
              Income
            </button>
          </div>
        </div>

        <div className="form__grid">
          <div className="form__field">
            <label className="label" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              className="input"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form__field">
            <label className="label" htmlFor="category">
              {type === "income" ? "Source" : "Category"}
            </label>
            <select
              id="category"
              className="select"
              value={categoryOrSource}
              onChange={(e) => setCategoryOrSource(e.target.value)}
              disabled={loadingCategories}
              required
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="form__field">
            <label className="label" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form__field">
          <label className="label" htmlFor="description">
            Description (optional)
          </label>
          <input
            id="description"
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., groceries"
          />
        </div>

        <div className="form__field">
          <label className="label" htmlFor="tags">
            Tags (optional)
          </label>
          <input
            id="tags"
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., food, weekly"
          />
        </div>

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add"}
        </button>
      </form>
    </section>
  );
}

