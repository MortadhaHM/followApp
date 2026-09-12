import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Transaction {
  id: number;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  date: string;
  description: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  transactions: Transaction[] = [
    {
      id: 1,
      type: 'expense',
      category: 'Groceries',
      amount: 45.50,
      date: '2026-03-10',
      description: 'Weekly supermarket shopping'
    },
    {
      id: 2,
      type: 'income',
      category: 'Freelance',
      amount: 450.00,
      date: '2026-03-08',
      description: 'Web development contract payout'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Housing & Utilities',
      amount: 120.00,
      date: '2026-03-05',
      description: 'Electricity & Internet'
    },
    {
      id: 4,
      type: 'expense',
      category: 'Transport',
      amount: 25.00,
      date: '2026-03-02',
      description: 'Monthly train pass'
    }
  ];

  get totalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }
}
