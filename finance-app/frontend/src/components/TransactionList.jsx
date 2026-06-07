/**
 * TransactionList.jsx
 * Fetches and renders the user's transactions from GET /transactions/.
 */

import { useEffect, useState } from "react";
import { listTransactions } from "../api/transactions.js";
import TransactionItem from "./TransactionItem.jsx";

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

  const handleDeleted = () => {
    load();
  };

  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">Transactions</h2>
        <button className="btn btn--secondary" type="button" onClick={load}>
          Refresh
        </button>
      </div>

      {loading ? <div className="muted">Loading...</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}

      {!loading && !error && transactions.length === 0 ? (
        <div className="muted">No transactions yet.</div>
      ) : null}

      <ul className="tx-list">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} onDeleted={handleDeleted} />
        ))}
      </ul>
    </section>
  );
}

