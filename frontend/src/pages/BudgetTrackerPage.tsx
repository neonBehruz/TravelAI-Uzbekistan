import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  PieChart,
  CreditCard,
  Receipt,
  Utensils,
  Car,
  Ticket,
  ShoppingBag,
  Hotel,
  Coffee,
  CheckCircle,
  Wifi,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Building,
  Lock,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface BankCard {
  id: string;
  cardNumber: string; // e.g. "8600 4589 1234 5678"
  cardHolder: string;
  expiry: string; // "08/29"
  cardType: 'uzcard' | 'humo' | 'visa' | 'mastercard';
  balanceUzs: number;
  colorTheme: 'emerald' | 'cyan' | 'gold' | 'purple' | 'dark';
  bankName: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'food' | 'transport' | 'tickets' | 'shopping' | 'stay' | 'other';
  amountUzs: number;
  date: string;
  paymentMethod: 'cash' | 'card';
  cardId?: string;
  cardName?: string;
  notes?: string;
}

const CATEGORY_CONFIG = {
  food: { name: "Taom & Palov", icon: Utensils, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  transport: { name: "Taksi & Transport", icon: Car, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  tickets: { name: "Obidalar & Chiptalar", icon: Ticket, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  shopping: { name: "Bozor & Suvenirlar", icon: ShoppingBag, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  stay: { name: "Mehmonxona / Turar joy", icon: Hotel, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  other: { name: "Boshqa xarajatlar", icon: Coffee, color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' }
};

const DEFAULT_CARDS: BankCard[] = [
  {
    id: 'c1',
    cardNumber: '8600 4589 1234 5678',
    cardHolder: 'SAYYOH HAMKOR',
    expiry: '09/29',
    cardType: 'uzcard',
    balanceUzs: 2400000,
    colorTheme: 'emerald',
    bankName: 'Kapitalbank'
  },
  {
    id: 'c2',
    cardNumber: '9860 1200 7845 9931',
    cardHolder: 'SAYYOH HAMKOR',
    expiry: '11/28',
    cardType: 'humo',
    balanceUzs: 1100000,
    colorTheme: 'cyan',
    bankName: 'Ipak Yo\'li Bank'
  }
];

const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: '1',
    title: 'Samarqand Oshi (Markaziy Osh Markazi)',
    category: 'food',
    amountUzs: 120000,
    date: '2026-08-26',
    paymentMethod: 'cash',
    notes: 'To‘y oshi, shakarob va ko‘k choy'
  },
  {
    id: '2',
    title: 'Registon maydoni kirish chiptasi',
    category: 'tickets',
    amountUzs: 100000,
    date: '2026-08-26',
    paymentMethod: 'card',
    cardId: 'c1',
    cardName: 'Uzcard (••5678)',
    notes: 'Sayyohlik chiptasi'
  },
  {
    id: '3',
    title: 'Yandex Go (Vokzal -> Mehmonxona)',
    category: 'transport',
    amountUzs: 25000,
    date: '2026-08-26',
    paymentMethod: 'card',
    cardId: 'c2',
    cardName: 'Humo (••9931)'
  },
  {
    id: '4',
    title: 'Siyob bozori quruq mevalari va holva',
    category: 'shopping',
    amountUzs: 180000,
    date: '2026-08-26',
    paymentMethod: 'cash',
    notes: 'Bodom va navvot'
  }
];

const CARD_THEMES = {
  emerald: {
    bg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)',
    border: 'rgba(52, 211, 153, 0.4)',
    accent: '#34d399',
    name: 'Zumrad (Emerald)'
  },
  cyan: {
    bg: 'linear-gradient(135deg, #083344 0%, #0e7490 50%, #155e75 100%)',
    border: 'rgba(34, 211, 238, 0.4)',
    accent: '#22d3ee',
    name: 'Feruza (Turquoise)'
  },
  gold: {
    bg: 'linear-gradient(135deg, #451a03 0%, #b45309 50%, #78350f 100%)',
    border: 'rgba(251, 191, 36, 0.4)',
    accent: '#fbbf24',
    name: 'Oltin (Gold)'
  },
  purple: {
    bg: 'linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #581c87 100%)',
    border: 'rgba(192, 132, 252, 0.4)',
    accent: '#c084fc',
    name: 'Binafsha (Royal Purple)'
  },
  dark: {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #090d16 100%)',
    border: 'rgba(148, 163, 184, 0.3)',
    accent: '#94a3b8',
    name: 'Obsidian Black'
  }
};

const BANK_NAMES = [
  'Kapitalbank',
  'Ipak Yo\'li Bank',
  'TBC Bank',
  'Anorbank',
  'NBU (Milliy Bank)',
  'SQB (O\'zsanoatqurilishbank)',
  'Hamkorbank',
  'Agrobank',
  'InfinBank',
  'Xalq Banki'
];

export const BudgetTrackerPage: React.FC = () => {
  const { t } = useLanguage();

  const [cards, setCards] = useState<BankCard[]>(() => {
    const saved = localStorage.getItem('safar_bank_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('safar_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  const [totalBudgetUzs, setTotalBudgetUzs] = useState<number>(() => {
    const saved = localStorage.getItem('safar_total_budget');
    return saved ? parseInt(saved, 10) : 3500000;
  });

  // Modal states
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [topUpCard, setTopUpCard] = useState<BankCard | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [cardToDelete, setCardToDelete] = useState<BankCard | null>(null);

  // Expense form states
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('food');
  const [newMethod, setNewMethod] = useState<'cash' | 'card'>('card');
  const [selectedCardId, setSelectedCardId] = useState<string>(() => (cards[0]?.id || ''));
  const [newNotes, setNewNotes] = useState('');

  // Card form states
  const [cardNumInput, setCardNumInput] = useState('');
  const [cardHolderInput, setCardHolderInput] = useState('');
  const [cardExpInput, setCardExpInput] = useState('');
  const [cardBalanceInput, setCardBalanceInput] = useState('');
  const [cardTypeInput, setCardTypeInput] = useState<BankCard['cardType']>('uzcard');
  const [cardThemeInput, setCardThemeInput] = useState<BankCard['colorTheme']>('emerald');
  const [cardBankInput, setCardBankInput] = useState(BANK_NAMES[0]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('safar_bank_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('safar_expenses', JSON.stringify(expenses));
    localStorage.setItem('safar_total_budget', totalBudgetUzs.toString());
  }, [expenses, totalBudgetUzs]);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amountUzs, 0);
  const remainingBudget = totalBudgetUzs - totalSpent;
  const spentPercent = totalBudgetUzs > 0 ? Math.min(100, Math.round((totalSpent / totalBudgetUzs) * 100)) : 0;
  const totalCardsBalance = cards.reduce((acc, curr) => acc + curr.balanceUzs, 0);

  const exchangeRateUsd = 12700;
  const exchangeRateEur = 13800;

  // Auto detect card type from number
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumInput(formatted);

    if (raw.startsWith('8600')) setCardTypeInput('uzcard');
    else if (raw.startsWith('9860')) setCardTypeInput('humo');
    else if (raw.startsWith('4')) setCardTypeInput('visa');
    else if (raw.startsWith('5')) setCardTypeInput('mastercard');
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpInput(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpInput(raw);
    }
  };

  // Add new card handler
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumInput.trim();
    const cleanHolder = cardHolderInput.trim().toUpperCase() || 'SAYYOH HAMKOR';
    const cleanExp = cardExpInput.trim() || '12/29';

    if (!cleanNum) return;

    const newCard: BankCard = {
      id: `card_${Date.now()}`,
      cardNumber: cleanNum,
      cardHolder: cleanHolder,
      expiry: cleanExp,
      cardType: cardTypeInput,
      balanceUzs: 0,
      colorTheme: cardThemeInput,
      bankName: cardBankInput
    };

    const updated = [...cards, newCard];
    setCards(updated);
    if (!selectedCardId) setSelectedCardId(newCard.id);

    // Reset card form
    setCardNumInput('');
    setCardHolderInput('');
    setCardExpInput('');
    setCardBalanceInput('');
    setShowAddCardModal(false);
  };

  // Delete card handler
  const handleDeleteCard = (cardId: string) => {
    const target = cards.find((c) => c.id === cardId);
    if (target) {
      setCardToDelete(target);
    }
  };

  const handleConfirmDeleteCard = () => {
    if (!cardToDelete) return;
    const updated = cards.filter((c) => c.id !== cardToDelete.id);
    setCards(updated);
    if (selectedCardId === cardToDelete.id) {
      setSelectedCardId(updated[0]?.id || '');
    }
    setCardToDelete(null);
  };

  // Top up card balance
  const handleTopUpCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpCard) return;
    const addedAmount = parseInt(topUpAmount.replace(/\s+/g, ''), 10);
    if (isNaN(addedAmount) || addedAmount <= 0) return;

    const updatedCards = cards.map((c) => {
      if (c.id === topUpCard.id) {
        return { ...c, balanceUzs: c.balanceUzs + addedAmount };
      }
      return c;
    });

    setCards(updatedCards);
    setTotalBudgetUzs((prev) => prev + addedAmount);
    setTopUpCard(null);
    setTopUpAmount('');
  };

  // Add expense handler with real-time card balance deduction
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(newAmount.replace(/\s+/g, ''), 10);
    if (!newTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    let targetCard: BankCard | undefined;
    let cardLabel: string | undefined;

    if (newMethod === 'card' && selectedCardId) {
      targetCard = cards.find((c) => c.id === selectedCardId);
      if (targetCard) {
        const last4 = targetCard.cardNumber.slice(-4);
        const typeName = targetCard.cardType.toUpperCase();
        cardLabel = `${typeName} (••${last4})`;

        // Deduct from card balance
        setCards(cards.map((c) => {
          if (c.id === targetCard!.id) {
            return { ...c, balanceUzs: Math.max(0, c.balanceUzs - parsedAmount) };
          }
          return c;
        }));
      }
    }

    const item: ExpenseItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      amountUzs: parsedAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newMethod,
      cardId: targetCard?.id,
      cardName: cardLabel,
      notes: newNotes.trim()
    };

    setExpenses([item, ...expenses]);
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setShowAddExpenseModal(false);
  };

  // Delete expense with refund option to card
  const handleDeleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    if (target && target.paymentMethod === 'card' && target.cardId) {
      // Refund back to card
      setCards(cards.map((c) => {
        if (c.id === target.cardId) {
          return { ...c, balanceUzs: c.balanceUzs + target.amountUzs };
        }
        return c;
      }));
    }
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(245, 184, 56, 0.12), rgba(7, 13, 30, 0.95))',
        border: '1px solid var(--border-gold)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 184, 56, 0.2)',
              color: '#FFD700',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '8px'
            }}>
              <Wallet size={14} /> Sayyohlik Xarajatlari & Bank Kartalari Hamyoni
            </div>
            <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '4px', fontWeight: 800 }}>
              💳 Smart Sayohat Byudjeti & Hamyoni
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Bank kartalaringizni ulang, real vaqtda xarajatlarni toifalarga ajrating va mablag'ingizni to'liq nazorat qiling.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="btn-secondary"
              style={{
                padding: '12px 18px',
                gap: '8px',
                borderColor: 'var(--accent-turquoise)',
                color: 'var(--accent-turquoise)',
                background: 'rgba(0, 168, 150, 0.12)'
              }}
            >
              <CreditCard size={18} />
              <span>+ Karta Qo'shish</span>
            </button>

            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="btn-primary"
              style={{ padding: '12px 20px', gap: '8px' }}
            >
              <Plus size={18} />
              <span>Xarajat Qo'shish</span>
            </button>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          {/* Card 1: Total Planned Budget */}
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Rejalashtirilgan Jami Byudjet</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
              {totalBudgetUzs.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--text-gold)' }}>UZS</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              ≈ ${(totalBudgetUzs / exchangeRateUsd).toFixed(1)} / €{(totalBudgetUzs / exchangeRateEur).toFixed(1)}
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Jami Sarflangan</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444' }}>
              {totalSpent.toLocaleString()} <span style={{ fontSize: '14px', color: '#FCA5A5' }}>UZS</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              ≈ ${(totalSpent / exchangeRateUsd).toFixed(1)} ({spentPercent}%)
            </div>
          </div>

          {/* Card 3: Remaining Budget */}
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(0, 168, 150, 0.08)', border: '1px solid var(--border-active)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-turquoise)', marginBottom: '4px' }}>Qolgan Mablag'</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: remainingBudget >= 0 ? 'var(--accent-turquoise)' : '#EF4444' }}>
              {remainingBudget.toLocaleString()} <span style={{ fontSize: '14px' }}>UZS</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ≈ ${(remainingBudget / exchangeRateUsd).toFixed(1)}
            </div>
          </div>

          {/* Card 4: Total Cards Balance */}
          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(245, 184, 56, 0.08)', border: '1px solid var(--border-gold)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-gold)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CreditCard size={12} /> Kartalardagi Jami Mablag'
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFD700' }}>
              {totalCardsBalance.toLocaleString()} <span style={{ fontSize: '14px' }}>UZS</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {cards.length} ta faol karta
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
            <span>Byudjet sarflanish ko'rsatkichi</span>
            <span style={{ fontWeight: 700, color: spentPercent > 90 ? '#EF4444' : 'var(--text-turquoise)' }}>{spentPercent}% sarflandi</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${spentPercent}%`,
              height: '100%',
              background: spentPercent > 90 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, var(--accent-turquoise), var(--accent-gold))',
              borderRadius: '10px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* BANK CARDS SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="var(--accent-turquoise)" /> Biriktirilgan Bank Kartalari
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Uzcard, Humo, Visa va Mastercard kartalaringiz balansi va xarajat monitoringi
            </p>
          </div>

          <button
            onClick={() => setShowAddCardModal(true)}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '8px 16px', gap: '6px' }}
          >
            <Plus size={15} /> Yangi karta qo'shish
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
            <CreditCard size={48} color="var(--accent-gold)" style={{ opacity: 0.5, marginBottom: '12px' }} />
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '6px' }}>Hozircha bank kartalari qo'shilmagan</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Xarajatlarni kartangiz balansidan avtomatik yechilishini ta'minlash uchun karta qo'shing.
            </p>
            <button onClick={() => setShowAddCardModal(true)} className="btn-primary" style={{ margin: '0 auto', gap: '8px' }}>
              <Plus size={16} /> Birinchi kartani qo'shish
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '20px'
          }}>
            {cards.map((card) => {
              const theme = CARD_THEMES[card.colorTheme] || CARD_THEMES.emerald;
              const formattedNumber = card.cardNumber.replace(/(\d{4})\s*(\d{4})\s*(\d{4})\s*(\d{4})/, '$1 •••• •••• $4');

              return (
                <div
                  key={card.id}
                  style={{
                    borderRadius: '20px',
                    padding: '22px',
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '190px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle decorative circles */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    pointerEvents: 'none'
                  }} />

                  {/* Top row: Bank & Wireless */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building size={16} style={{ opacity: 0.8 }} />
                      <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>{card.bankName}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wifi size={18} style={{ transform: 'rotate(90deg)', opacity: 0.8 }} />
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.3)',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {card.cardType}
                      </span>
                    </div>
                  </div>

                  {/* Middle row: EMV Chip & Balance */}
                  <div style={{ margin: '14px 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      {/* EMV Chip Graphic */}
                      <div style={{
                        width: '36px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #ffd700, #b8860b)',
                        border: '1px solid rgba(0,0,0,0.2)',
                        marginBottom: '8px',
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)'
                      }} />
                      <div style={{ fontSize: '15px', letterSpacing: '2px', fontWeight: 700, fontFamily: 'monospace' }}>
                        {formattedNumber}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>Balans</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                        {card.balanceUzs.toLocaleString()} <span style={{ fontSize: '11px', color: theme.accent }}>UZS</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: Cardholder & Expiry & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                      <div style={{ fontSize: '9px', opacity: 0.7, textTransform: 'uppercase' }}>Egasining ismi</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>{card.cardHolder}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '9px', opacity: 0.7, textTransform: 'uppercase' }}>Muddati</div>
                      <div style={{ fontSize: '12px', fontWeight: 700 }}>{card.expiry}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setTopUpCard(card);
                          setTopUpAmount('');
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: 'none',
                          color: '#fff',
                          padding: '5px 9px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                        title="Balansni to'ldirish"
                      >
                        <PlusCircle size={13} /> To'ldirish
                      </button>

                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#fca5a5',
                          padding: '5px 7px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                        title="Kartani o'chirish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expenses List & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Expenses History */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              <Receipt size={18} color="var(--accent-turquoise)" /> Xarajatlar Tarixi
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{expenses.length} ta yozuv</span>
          </div>

          {expenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
              Hozircha hech qanday xarajat kiritilmagan.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expenses.map((exp) => {
                const conf = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG.other;
                const IconComponent = conf.icon;
                return (
                  <div key={exp.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: conf.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: conf.color,
                        flexShrink: 0
                      }}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{exp.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px', flexWrap: 'wrap' }}>
                          <span style={{ color: conf.color, fontWeight: 600 }}>{conf.name}</span>
                          <span>•</span>
                          <span style={{
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: exp.paymentMethod === 'card' ? 'rgba(0, 168, 150, 0.15)' : 'rgba(245, 184, 56, 0.15)',
                            color: exp.paymentMethod === 'card' ? 'var(--accent-turquoise)' : 'var(--text-gold)',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {exp.paymentMethod === 'card' ? `💳 ${exp.cardName || 'Karta'}` : '💵 Naqd'}
                          </span>
                          <span>•</span>
                          <span>{exp.date}</span>
                        </div>
                        {exp.notes && (
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                            "{exp.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                          -{exp.amountUzs.toLocaleString()} UZS
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          ≈ ${(exp.amountUzs / exchangeRateUsd).toFixed(1)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.7, padding: '4px' }}
                        title="O'chirish (Mablag' kartaga qaytariladi)"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Category Distribution */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
            <PieChart size={18} color="var(--accent-gold)" /> Kategoriya Bo'yicha Taqsimot
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(CATEGORY_CONFIG).map(([catKey, conf]) => {
              const catTotal = expenses.filter((e) => e.category === catKey).reduce((acc, curr) => acc + curr.amountUzs, 0);
              const catPercent = totalSpent > 0 ? Math.round((catTotal / totalSpent) * 100) : 0;
              const IconComponent = conf.icon;

              return (
                <div key={catKey} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                      <IconComponent size={16} color={conf.color} />
                      <span>{conf.name}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: conf.color }}>
                      {catTotal.toLocaleString()} UZS ({catPercent}%)
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${catPercent}%`, height: '100%', background: conf.color, borderRadius: '10px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD BANK CARD */}
      {showAddCardModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.98), rgba(7, 13, 30, 0.99))',
            border: '1px solid var(--border-gold)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--accent-turquoise)" /> Yangi Bank Kartasini Qo'shish
              </h3>
            </div>

            <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Card Number */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Karta Raqami (16 xonali)
                </label>
                <input
                  type="text"
                  required
                  placeholder="8600 0000 0000 0000"
                  value={cardNumInput}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className="search-input-field"
                  style={{ width: '100%', fontSize: '15px', fontFamily: 'monospace', letterSpacing: '1px' }}
                />
              </div>

              {/* Card Type & Bank Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>To'lov Tizimi</label>
                  <select
                    value={cardTypeInput}
                    onChange={(e) => setCardTypeInput(e.target.value as any)}
                    className="city-select-dropdown"
                    style={{ width: '100%' }}
                  >
                    <option value="uzcard" style={{ background: '#0D1630' }}>Uzcard (8600)</option>
                    <option value="humo" style={{ background: '#0D1630' }}>Humo (9860)</option>
                    <option value="visa" style={{ background: '#0D1630' }}>Visa</option>
                    <option value="mastercard" style={{ background: '#0D1630' }}>Mastercard</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Bank Nomi</label>
                  <select
                    value={cardBankInput}
                    onChange={(e) => setCardBankInput(e.target.value)}
                    className="city-select-dropdown"
                    style={{ width: '100%' }}
                  >
                    {BANK_NAMES.map((b) => (
                      <option key={b} value={b} style={{ background: '#0D1630' }}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cardholder & Expiry */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Karta Egasi Ismi</label>
                  <input
                    type="text"
                    required
                    placeholder="ALISHER NAVOIY"
                    value={cardHolderInput}
                    onChange={(e) => setCardHolderInput(e.target.value.toUpperCase())}
                    className="search-input-field"
                    style={{ width: '100%', textTransform: 'uppercase' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Muddati (OO/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="08/29"
                    value={cardExpInput}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className="search-input-field"
                    style={{ width: '100%', textAlign: 'center' }}
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Karta Dizayni / Rangi
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {Object.entries(CARD_THEMES).map(([themeKey, tConf]) => (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setCardThemeInput(themeKey as any)}
                      style={{
                        height: '42px',
                        borderRadius: '10px',
                        background: tConf.bg,
                        border: cardThemeInput === themeKey ? '2px solid #FFD700' : `1px solid ${tConf.border}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: cardThemeInput === themeKey ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
                      }}
                      title={tConf.name}
                    >
                      {cardThemeInput === themeKey && <CheckCircle size={16} color="#FFD700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Kartani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TOP UP CARD BALANCE */}
      {topUpCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.98), rgba(7, 13, 30, 0.99))',
            border: '1px solid var(--border-gold)'
          }}>
            <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} color="var(--accent-turquoise)" /> Karta Balansini To'ldirish
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {topUpCard.bankName} • {topUpCard.cardType.toUpperCase()} (••{topUpCard.cardNumber.slice(-4)})
            </p>

            <form onSubmit={handleTopUpCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Qo'shiladigan Miqdor (UZS)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Masalan: 500000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="search-input-field"
                  style={{ width: '100%', fontSize: '16px', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[100000, 300000, 500000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setTopUpAmount(quick.toString())}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    +{(quick / 1000).toLocaleString()} ming
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTopUpCard(null)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Balansni To'ldirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD EXPENSE */}
      {showAddExpenseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.98), rgba(7, 13, 30, 0.99))',
            border: '1px solid var(--border-gold)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, marginBottom: '16px' }}>
              Yangi Xarajat Qo'shish
            </h3>

            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nomi / Xarid tavsifi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Registon maydoni chiptasi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="search-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Miqdori (So'mda / UZS)</label>
                <input
                  type="number"
                  required
                  placeholder="Masalan: 75000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="search-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Kategoriya</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="city-select-dropdown"
                    style={{ width: '100%' }}
                  >
                    {Object.entries(CATEGORY_CONFIG).map(([key, conf]) => (
                      <option key={key} value={key} style={{ background: '#0D1630' }}>
                        {conf.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>To'lov turi</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="city-select-dropdown"
                    style={{ width: '100%' }}
                  >
                    <option value="card" style={{ background: '#0D1630' }}>💳 Bank kartasi</option>
                    <option value="cash" style={{ background: '#0D1630' }}>💵 Naqd pul</option>
                  </select>
                </div>
              </div>

              {/* Select Card if payment method is Card */}
              {newMethod === 'card' && (
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Qaysi kartadan yechilsin?
                  </label>
                  {cards.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#EF4444', padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                      Avval bank kartasini qo'shing yoki Naqd pul to'lovini tanlang.
                    </div>
                  ) : (
                    <select
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      className="city-select-dropdown"
                      style={{ width: '100%' }}
                    >
                      {cards.map((c) => (
                        <option key={c.id} value={c.id} style={{ background: '#0D1630' }}>
                          {c.bankName} - {c.cardType.toUpperCase()} (••{c.cardNumber.slice(-4)}) — Balans: {c.balanceUzs.toLocaleString()} UZS
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Izoh / Eslatma (ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="Masalan: Chorsu bozoridan esdalik suveniri"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="search-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CUSTOM DELETE CONFIRMATION MODAL */}
      {cardToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '28px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(25, 12, 30, 0.98), rgba(10, 15, 35, 0.99))',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.25)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
            }}>
              <Trash2 size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
                Bank Kartasini O'chirish
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Haqiqatan ham ushbu kartani hamyoningizdan o'chirmoqchimisiz?
              </p>
            </div>

            {/* Target Card Preview Box */}
            <div style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff' }}>
                  {cardToDelete.bankName} • {cardToDelete.cardType.toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                  {cardToDelete.cardNumber.slice(0, 4)} •••• •••• {cardToDelete.cardNumber.slice(-4)}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Balans:</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-turquoise)' }}>
                  {cardToDelete.balanceUzs.toLocaleString()} UZS
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setCardToDelete(null)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '13px' }}
              >
                Bekor Qilish
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCard}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)'
                }}
              >
                <Trash2 size={16} />
                <span>O'chirish</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
