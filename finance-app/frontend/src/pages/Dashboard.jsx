/**
 * Dashboard.jsx
 * Protected main screen: shows Navbar, TransactionForm, and TransactionList.
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
      <main className="container">
        <TransactionForm onCreated={() => setRefreshSignal((n) => n + 1)} />
        <TransactionList refreshSignal={refreshSignal} />
      </main>
    </>
  );
}

