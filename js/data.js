/* ═══════════════════════════════════════════════════
   UBA Smart Money — Dummy Data
   All figures are illustrative only.
   ═══════════════════════════════════════════════════ */

const DATA = {

  user: {
    firstName:   'Oluwaseun',
    fullName:    'Oluwaseun Adeyemi',
    initials:    'OA',
    tier:        'Silver Saver',
    nextTier:    'Gold',
    tierProgress: 50,
    healthScore: 72,
    streak:      6,
    activeGoals: 3,
    accounts: [
      { type: 'Savings', number: '****4821', balance: 542320 },
      { type: 'Current', number: '****2267', balance: 305000 }
    ],
    totalBalance: 847320
  },

  summary: {
    income:  320000,
    spent:   187400,
    saved:    42000,
    period:  'May 2026'
  },

  transactions: [
    {
      merchant:  'Shoprite Ikeja',
      category:  'Shopping',
      amount:    -8400,
      date:      'Today, 11:22 AM',
      iconId:    'i-shopping',
      iconColor: 'grey'
    },
    {
      merchant:  'Salary — Andela',
      category:  'Income',
      amount:    +320000,
      date:      'Today, 6:02 AM',
      iconId:    'i-arrow-r',
      iconColor: 'green'
    },
    {
      merchant:  'Uber Nigeria',
      category:  'Transport',
      amount:    -3200,
      date:      'Yesterday, 8:14 PM',
      iconId:    'i-transport',
      iconColor: 'grey'
    }
  ],

  goals: [
    {
      id:        'vacation',
      name:      'Vacation Fund',
      iconId:    'i-palm',
      iconColor: 'amber',
      saved:      84000,
      target:    150000,
      pct:           56,
      deadline:  'Aug 2026',
      status:    'on-track',
      tip:       'At ₦18,000/month you will arrive 3 weeks ahead of your August deadline.',
      monthlyContrib:   18000,
      recommendedContrib: 18000,
      contributions: [
        { date: '1 May 2026', amount: 18000 },
        { date: '1 Apr 2026', amount: 18000 },
        { date: '1 Mar 2026', amount: 15000 }
      ]
    },
    {
      id:        'emergency',
      name:      'Emergency Fund',
      iconId:    'i-shield',
      iconColor: 'red',
      saved:     264000,
      target:    300000,
      pct:           88,
      deadline:  'Jun 2026',
      status:    'on-track',
      tip:       '₦36,000 more and this goal is complete. You are ahead of plan.',
      monthlyContrib:   22000,
      recommendedContrib: 22000,
      contributions: [
        { date: '1 May 2026', amount: 22000 },
        { date: '1 Apr 2026', amount: 22000 },
        { date: '1 Mar 2026', amount: 22000 }
      ]
    },
    {
      id:        'house',
      name:      'House Deposit',
      iconId:    'i-house',
      iconColor: 'blue',
      saved:     120000,
      target:   2000000,
      pct:            6,
      deadline:  'Dec 2028',
      status:    'at-risk',
      tip:       'You are behind plan. Increase by ₦5,000/month to get back on track.',
      monthlyContrib:   15000,
      recommendedContrib: 20000,
      contributions: [
        { date: '1 May 2026', amount: 15000 },
        { date: '1 Apr 2026', amount: 15000 },
        { date: '1 Mar 2026', amount: 15000 }
      ]
    }
  ],

  spending: [
    { label: 'Food',      amount: 38000, pct: 82, color: 'var(--uba-red-alert)' },
    { label: 'Transport', amount: 26000, pct: 55, color: 'var(--uba-amber)' },
    { label: 'Utilities', amount: 19000, pct: 42, color: 'var(--uba-blue)' },
    { label: 'Shopping',  amount: 14000, pct: 30, color: 'var(--uba-grey-dark)' },
    { label: 'Others',    amount:  9000, pct: 20, color: 'var(--uba-grey-mid)' }
  ],

  insights: [
    {
      type:      'warn',
      iconId:    'i-food',
      iconClass: 'warn',
      title:     'Food spending spike',
      body:      'You spent <strong>₦38,000 on food</strong> this month — 34% above your April average. Most occurred on Saturday evenings via delivery apps.',
      cta:       'Discuss with Coach',
      ctaClass:  'amber',
      ctaFn:     "Coach.ask('Why is my food spending so high this month?')",
      time:      'Today'
    },
    {
      type:      'save',
      iconId:    'i-bolt',
      iconClass: 'save',
      title:     'Savings opportunity',
      body:      '<strong>₦47,000</strong> in your UBA Current account has not moved in 12 days. Move it to Emergency Fund — you are only ₦36,000 from completing that goal.',
      cta:       'Move Funds',
      ctaClass:  'green',
      ctaFn:     "Sheets.open('sheet-quicksave')",
      time:      '2 days ago'
    },
    {
      type:      'info',
      iconId:    'i-trend-up',
      iconClass: 'info',
      title:     'Savings rate improved',
      body:      'Your savings rate rose from <strong>8% → 13%</strong> this month. Sustain this for 3 consecutive months to unlock Smart Money Premium features.',
      cta:       null,
      ctaClass:  null,
      ctaFn:     null,
      time:      'This week'
    },
    {
      type:      'bad',
      iconId:    'i-trend-down',
      iconClass: 'bad',
      title:     'Debt ratio alert',
      body:      'Your loan repayments are <strong>41% of monthly income</strong>. A healthy debt ratio is below 30% of income. Your coach has a step-by-step plan ready.',
      cta:       'See Debt Plan',
      ctaClass:  'red',
      ctaFn:     "Coach.ask('Show me a debt repayment plan')",
      time:      'This month'
    }
  ],

  notifications: [
    {
      unread: true,
      title:  'Food spend is up ↑34%',
      body:   'You have crossed your food budget for May. Tap to see the breakdown.',
      time:   '2 min ago'
    },
    {
      unread: true,
      title:  '₦320,000 salary received',
      body:   'Your Andela salary has been credited to your UBA Current account.',
      time:   'Today, 6:02 AM'
    },
    {
      unread: true,
      title:  'Idle ₦47,000 detected',
      body:   'Move it to Emergency Fund and hit your goal 2 weeks early.',
      time:   '2 days ago'
    },
    {
      unread: false,
      title:  'Streak: 6 months saving',
      body:   'You have reached Silver Saver tier. Three more months to Gold.',
      time:   '28 Apr 2026'
    }
  ],

  coachResponses: {
    'Why is my food spending so high this month?':
      `<p>Looking at your May transactions, <strong>₦22,400 (59%)</strong> of your food spend happened on Saturday evenings between 7–10 PM — mostly delivery apps.</p>
       <p>If you cooked at home just 2 of those Saturdays, you would save approximately <strong>₦11,000/month</strong> — enough to close your Vacation Fund <strong>6 weeks earlier</strong>.</p>`,

    'How do I hit my vacation goal faster?':
      `<p>You need <strong>₦66,000 more</strong> by August. At ₦18,000/month you are 3 weeks short. Three options:</p>
       <p>1. Reduce food spend by ₦4,000 — saves 3 weeks<br>2. Pause shopping for one month — saves 5 weeks<br>3. Move idle ₦47,000 from your Current account — closes the gap <strong>immediately</strong></p>
       <p>Option 3 is the fastest route. Would you like help with that transfer?</p>`,

    'Can I afford a ₦50,000 purchase?':
      `<p>Your available balance after bills and active goals this month is <strong>₦63,200</strong>.</p>
       <p>A ₦50,000 purchase is affordable — but it leaves only ₦13,200 as a buffer. I would recommend capping the purchase at <strong>₦35,000</strong> to stay comfortable, or waiting until after your next salary credit.</p>`,

    'Show me a debt repayment plan':
      `<p>Your loan repayments are currently <strong>₦131,200/month</strong> — 41% of your ₦320,000 income. The healthy ceiling is 30% (₦96,000).</p>
       <p><strong>Your 3-step plan:</strong><br>1. Prioritise the highest-interest loan first<br>2. Redirect ₦10,000/month from reduced food spend toward debt<br>3. Target 30% ratio within <strong>8 months</strong></p>
       <p>This brings your debt ratio to 29% by January 2027.</p>`,

    'Build me a savings plan':
      `<p>Here is your personalised May plan:</p>
       <p><strong>Income:</strong> ₦320,000<br><strong>Fixed bills:</strong> ₦145,000<br><strong>Recommended spend:</strong> ₦120,000<br><strong>Target savings:</strong> <strong>₦55,000 (17%)</strong></p>
       <p>Suggested split: ₦22,000 → Emergency Fund · ₦18,000 → Vacation · ₦15,000 → House Deposit</p>`
  },

  /* Format helpers */
  fmt: {
    currency(n) {
      return '₦' + Math.abs(n).toLocaleString('en-NG');
    },
    pct(n) {
      return n + '%';
    }
  }
};
