/**
 * Dashboard.jsx
 * Protected main screen: sticky Navbar, two-column layout (form left, list right).
 */

import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";

export default function Dashboard() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <>
      <Navbar />
      <main className="container" id="main-content">
        <div className="main-layout">
          {/* Left: Add Transaction form */}
          <div>
            <TransactionForm onCreated={() => setRefreshSignal((n) => n + 1)} />
          </div>

          {/* Right: Summary + Transaction list */}
          <div>
            <TransactionList refreshSignal={refreshSignal} />
          </div>
        </div>
      </main>
    </>
  );
}
