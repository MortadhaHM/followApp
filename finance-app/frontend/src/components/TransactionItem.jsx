/**
 * TransactionItem.jsx
 * Displays a single transaction row with a delete action.
 */

import { deleteTransaction } from "../api/transactions.js";

function formatAmount(type, amount) {
  const n = Number(amount);
  const sign = type === "expense" ? "-" : "+";
  if (!Number.isFinite(n)) return `${sign}${amount}`;
  return `${sign}${n.toFixed(2)}`;
}

export default function TransactionItem({ transaction, onDeleted }) {
  const handleDelete = async () => {
    const ok = window.confirm("Delete this transaction?");
    if (!ok) return;

    try {
      await deleteTransaction(transaction.id);
      if (typeof onDeleted === "function") onDeleted(transaction.id);
    } catch (e) {
      alert(e.message || "Failed to delete transaction");
    }
  };

  return (
    <li className="tx-item">
      <div className="tx-item__main">
        <div className="tx-item__top">
          <div className="tx-item__date">{transaction.date}</div>
          <div
            className={`tx-item__amount ${
              transaction.type === "expense"
                ? "tx-item__amount--expense"
                : "tx-item__amount--income"
            }`}
          >
            {formatAmount(transaction.type, transaction.amount)}
          </div>
        </div>

        <div className="tx-item__meta">
          <span className="pill">
            {transaction.type === "income" ? "Income" : "Expense"}
          </span>
          <span className="tx-item__category">{transaction.category_or_source}</span>
        </div>

        {transaction.description ? (
          <div className="tx-item__desc">{transaction.description}</div>
        ) : null}
      </div>

      <button className="btn btn--danger" type="button" onClick={handleDelete}>
        Delete
      </button>
    </li>
  );
}

