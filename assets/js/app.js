/* EUROFIDUCIA — Core Application Logic
   Handles: Auth, Sessions, Notifications, AI Support, Messaging, Transactions, Loans, Email/SMS
   All data stored in localStorage for demo persistence.
*/

var EV = EV || {};

// ===================== PORTFOLIOS & LOANS CATALOG =====================
EV.catalog = {
  portfolios: [
    'FR Conservative Portfolio','FR Balanced Portfolio','FR Growth Portfolio',
    'IT Conservative Portfolio','IT Balanced Portfolio','IT Growth Portfolio',
    'Euro Growth Portfolio','Global Growth Portfolio'
  ],
  loanTypes: [
    'Personal Loan','Mortgage Loan','Auto Loan','Business Loan','Student Loan',
    'Debt Consolidation Loan','Home Equity Loan','Bridge Loan','Equipment Financing',
    'Credit Line / revolving','Green Energy Loan','Medical Loan'
  ],
  products: [
    'CAC 40 Index Fund','FTSE MIB ETF','Euro Stoxx 50 ETF','MSCI World ETF',
    'S&P 500 ETF','BTP Italia 2035','French OAT 10Y','Green Bond Fund',
    'European SCPI','Bitcoin','Ethereum','Gold ETC','Silver ETC',
    'PER Retirement Fund','Livret A Savings','LDDS Savings','Private Equity Fund I',
    'Venture Capital Fund','Infrastructure Fund','European Dividend Fund',
    'Nasdaq 100 ETF','Emerging Markets ETF','Japan Topix ETF','Real Estate Crowdfunding'
  ]
};

// ===================== MOTIVATIONAL EMAIL & SMS TEMPLATES =====================
// Default library. Admin can EDIT these (subject + body) from the dashboard;
// edits are persisted in EV.store under 'edited_email_templates' so they survive
// redeploy / device changes via the sync layer. Admin can also restore defaults.
// Every template supports {name} personalization and is delivered to BOTH the
// user's email inbox and their dashboard Messages page in the official EuroFiducia
// template. If the user opted in to SMS, a short SMS alert is also sent.
EV._emailTemplatesDefaults = [
  {
    id:'welcome', icon:'🎉', name:'Welcome & Get Started',
    subject:'Welcome to EuroFiducia — Your Journey to Wealth Begins Here',
    body:'Dear {name},\n\nWelcome to the EuroFiducia family! We are thrilled to have you join thousands of investors across France and Italy who are building their financial future with us.\n\nYour account is now active, and you are just steps away from your first investment. Here is how to get started:\n\n1. Complete your identity verification (KYC) in your dashboard\n2. Make your first deposit via SEPA, card, or open banking\n3. Choose a portfolio that matches your risk profile\n4. Watch your investments grow!\n\nRemember, our AI support assistant is available 24/7 in your language to answer any questions.\n\nStart investing today →\n\nWarm regards,\nThe EuroFiducia Team'
  },
  {
    id:'motivate1', icon:'🚀', name:'Investment Opportunity — Markets Are Moving',
    subject:'🚀 Don\'t Miss Today\'s Investment Opportunities',
    body:'Dear {name},\n\nThe markets are presenting exceptional opportunities right now. European equities are showing strong momentum, and our managed portfolios are performing above target this quarter.\n\nHere is a snapshot of what is happening:\n\n• CAC 40 and FTSE MIB indices are trending upward\n• Our Euro Growth portfolio is up 8.4% year-to-date\n• Green energy and sustainable funds are outperforming expectations\n• Italian BTP yields remain attractive for income investors\n\nNow is the perfect time to review your portfolio and consider increasing your investment. Even a small additional contribution can make a big difference over time thanks to compound growth.\n\nLog in to your dashboard to explore opportunities →\n\nBest regards,\nThe EuroFiducia Investment Team'
  },
  {
    id:'motivate2', icon:'📈', name:'Portfolio Performance Update',
    subject:'📈 Your Portfolio Is Growing — See Your Progress',
    body:'Dear {name},\n\nGreat news! We wanted to share an update on how your investments are performing.\n\nThis quarter, your portfolio has shown solid progress. Our investment strategists continue to optimize your holdings to maximize returns while managing risk according to your profile.\n\nKey highlights:\n\n• Diversified exposure across European and global markets\n• Active rebalancing to capture growth opportunities\n• Transparent fees with no hidden costs\n\nKeep up the great work as an investor. Consistency is the key to long-term wealth building.\n\nView your full portfolio details →\n\nWarmly,\nThe EuroFiducia Team'
  },
  {
    id:'motivate3', icon:'💰', name:'Start Small, Grow Big',
    subject:'💰 Every Great Fortune Started With a First Investment',
    body:'Dear {name},\n\nDid you know that some of the world\'s most successful investors started with very small amounts? The secret is not how much you start with — it is that you start.\n\nAt EuroFiducia, you can begin investing with as little as €100. Here is what that could look like over time:\n\n• €100/month for 10 years at 6% average return = ~€16,000\n• €250/month for 20 years at 7% average return = ~€130,000\n• €500/month for 30 years at 8% average return = ~€680,000\n\nThe earlier you start, the more time your money has to grow through the power of compounding.\n\nReady to take the next step? Log in and explore our portfolios →\n\nBelieving in your financial future,\nThe EuroFiducia Team'
  },
  {
    id:'motivate4', icon:'🌱', name:'Sustainable Investing Appeal',
    subject:'🌱 Invest in Your Values — Sustainable Portfolios Available',
    body:'Dear {name},\n\nWhat if your investments could grow your wealth AND make the world a better place?\n\nOur Sustainable and ESG portfolios allow you to invest in companies that prioritize environmental responsibility, social impact, and strong governance — without sacrificing returns.\n\nSustainable investing highlights:\n\n• Green bonds financing renewable energy projects\n• ESG-screened equity funds\n• European green transition infrastructure\n• Competitive returns aligned with your values\n\nJoin the growing movement of investors who believe profit and purpose can go hand in hand.\n\nExplore sustainable portfolios →\n\nWith purpose,\nThe EuroFiducia Team'
  },
  {
    id:'motivate5', icon:'🏦', name:'Retirement Planning',
    subject:'🏦 Is Your Retirement On Track? Let\'s Check Together',
    body:'Dear {name},\n\nRetirement may seem far away, but the best time to plan for it is now. Whether you are in France with a PER (Plan d\'Épargne Retraite) or in Italy with your pension planning, EuroFiducia can help you build a retirement nest egg that gives you peace of mind.\n\nConsider this:\n\n• State pensions alone may not maintain your lifestyle\n• Tax-advantaged retirement products can boost your savings\n• Starting early means smaller contributions over a longer period\n• Our Conservative and Balanced portfolios are ideal for retirement planning\n\nLet us help you secure your future. Review our retirement investment options today.\n\nPlan your retirement →\n\nLooking out for your future,\nThe EuroFiducia Team'
  },
  {
    id:'motivate6', icon:'🔥', name:'Limited-Time Portfolio Offer',
    subject:'🔥 Special Offer — Reduced Fees on Growth Portfolios This Month',
    body:'Dear {name},\n\nWe have an exciting opportunity for you! For a limited time, we are offering reduced management fees on our Growth and Global Growth portfolios.\n\nOffer details:\n\n• 25% off management fees on Growth portfolios\n• Free portfolio consultation with our advisors\n• No minimum increase required\n\nThis is our way of thanking you for being a valued EuroFiducia investor and encouraging you to take advantage of current market conditions.\n\nThis offer is available for a limited time only. Do not miss out!\n\nClaim your offer →\n\nWarm regards,\nThe EuroFiducia Team'
  },
  {
    id:'motivate7', icon:'🏆', name:'Milestone & Achievement',
    subject:'🏆 Congratulations on Your Investment Milestone!',
    body:'Dear {name},\n\nCongratulations! You have reached an important milestone in your investment journey with EuroFiducia. Your dedication to building your financial future is truly commendable.\n\nAs a valued investor, you now have access to:\n\n• Priority customer support\n• Advanced portfolio analytics\n• Exclusive investment opportunities\n• Regular market insights and reports\n\nKeep investing, keep growing. The best is yet to come!\n\nCelebrate your progress →\n\nProud of your journey,\nThe EuroFiducia Team'
  },
  {
    id:'motivate8', icon:'⚡', name:'Act Now — Time in the Market',
    subject:'⚡ Time in the Market Beats Timing the Market',
    body:'Dear {name},\n\nIt is natural to wonder: "Is now the right time to invest?" The truth is, time IN the market almost always beats timing the market.\n\nInvestors who stay invested through market ups and downs historically achieve better long-term results than those who try to time their entries and exits.\n\nAt EuroFiducia, our managed portfolios are designed for long-term growth:\n\n• Professional rebalancing keeps your portfolio on track\n• Diversification reduces the impact of volatility\n• Regular contributions (dollar-cost averaging) smooth out market fluctuations\n\nDo not wait for the "perfect" moment. The perfect moment is now.\n\nStart or increase your investment →\n\nYour partners in growth,\nThe EuroFiducia Team'
  },
  {
    id:'verify', icon:'✅', name:'KYC Verification Reminder',
    subject:'✅ Complete Your Verification to Unlock Full Features',
    body:'Dear {name},\n\nThis is a friendly reminder to complete your identity verification (KYC) in your EuroFiducia dashboard.\n\nCompleting your verification allows you to:\n\n• Make deposits and withdrawals without limits\n• Access all investment products\n• Generate official transaction receipts\n• Ensure compliance with European regulations\n\nThe process takes just a few minutes — simply upload your government ID and proof of address in your dashboard settings.\n\nComplete verification now →\n\nThank you for helping us keep EuroFiducia secure,\nThe EuroFiducia Compliance Team'
  },
  {
    id:'promo_fast24', icon:'\u26a1', name:'24-Hour Fast Investment Plan',
    subject:'\u26a1 Turn $200 Into Profit in Just 24 Hours',
    body:'Dear {name},\n\nOur new 24-Hour Fast Investment Plan is live, and it is designed for investors who want rapid results.\n\nHow it works:\n\n\u2022 Minimum investment: $200\n\u2022 Term: 24 hours\n\u2022 ROI: credited automatically at maturity\n\u2022 No lock-in beyond the 24-hour term\n\nThis is perfect if you want to test the waters, earn a fast return, and reinvest or withdraw the same week. The gas fee is on us \u2014 you only fund your principal.\n\nLog in to your dashboard \u2192 Investments \u2192 Fast Plans to start now.\n\nBest regards,\nThe EuroFiducia Investment Team'
  },
  {
    id:'promo_fast48', icon:'\u23f1', name:'48-Hour Fast Investment Plan',
    subject:'\u23f1 48 Hours. $200 Minimum. Your Capital Working Harder.',
    body:'Dear {name},\n\nNot ready to wait a month to see returns? Our 48-Hour Fast Investment Plan lets your capital work for you over two days, with a competitive short-term ROI.\n\n\u2022 Minimum investment: $200\n\u2022 Term: 48 hours\n\u2022 ROI: credited at maturity\n\u2022 Gas fee covered by EuroFiducia\n\nIt is the smartest way to put idle funds to work without locking them away. Open your dashboard, pick the 48-hour plan, and watch your investment mature.\n\nStart your 48-hour plan \u2192\n\nThe EuroFiducia Investment Team'
  },
  {
    id:'adv_why_invest', icon:'\ud83e\uddd1\u200d\ud83d\udcbc', name:'Why You Should Try Investing',
    subject:'\ud83d\udca1 7 Reasons Investing Beats Leaving Cash in the Bank',
    body:'Dear {name},\n\nIf your savings are sitting in a regular bank account, inflation is quietly shrinking their real value every single year. Investing is how you fight back. Here are seven reasons you should give it a try:\n\n1. Beat inflation \u2014 cash loses purchasing power; investments historically grow faster than inflation.\n2. Compound growth \u2014 your returns earn their own returns, accelerating your wealth over time.\n3. Passive income \u2014 dividends and interest pay you while you sleep.\n4. Diversification \u2014 spread risk across stocks, bonds, real estate, and crypto instead of one bank.\n5. Financial freedom \u2014 a growing portfolio gives you options: retirement, a home, your children\u2019s future.\n6. Accessibility \u2014 at EuroFiducia you can start from $200 with plans as short as 24 hours.\n7. Professional management \u2014 our strategists rebalance your portfolio so you don\u2019t have to watch the markets all day.\n\nYou don\u2019t need to be an expert. You just need to start.\n\nBegin your first investment today \u2192\n\nBelieving in your future,\nThe EuroFiducia Team'
  },
  {
    id:'adv_compound', icon:'\ud83c\udfaf', name:'The Power of Compound Interest',
    subject:'\ud83c\udfaf The Eighth Wonder of the World: Compound Interest',
    body:'Dear {name},\n\nAlbert Einstein reportedly called compound interest \u201cthe eighth wonder of the world.\u201d Here is why it matters to you.\n\nWhen your investment earns a return, and you reinvest that return, your next return is calculated on a larger amount. Do this for years and the growth becomes exponential.\n\nA simple illustration:\n\n\u2022 $5,000 invested at 7% for 10 years \u2192 ~$9,800\n\u2022 The same $5,000 at 7% for 30 years \u2192 ~$38,000\n\nThe difference is not the money you put in \u2014 it is the time you give it. The sooner you start, the harder compounding works for you.\n\nOpen a plan today and let time become your greatest asset.\n\nYour partners in growth,\nThe EuroFiducia Team'
  },
  {
    id:'adv_start_small', icon:'\ud83d\udc63', name:'Start Small, Build Big',
    subject:'\ud83d\udc63 You Don\u2019t Need to Be Rich to Start Investing',
    body:'Dear {name},\n\nOne of the biggest myths about investing is that you need a fortune to begin. You don\u2019t. You need a decision.\n\nAt EuroFiducia, our fast investment plans start from just $200. That single decision \u2014 to begin \u2014 is worth more than waiting until you feel \u201cready.\u201d Most successful investors started small and grew steadily.\n\nHere is a simple path:\n\n1. Make your first deposit (crypto is instant and the gas fee is on us).\n2. Choose a plan that fits your horizon \u2014 24h, 48h, weekly, monthly, quarterly, or yearly.\n3. Reinvest your returns to accelerate growth.\n4. Repeat.\n\nSmall, consistent steps build lasting wealth. Take the first one today.\n\nWarm regards,\nThe EuroFiducia Team'
  },
  {
    id:'adv_diversify', icon:'\ud83e\ude99', name:'Diversification & Risk Management',
    subject:'\ud83e\ude99 Don\u2019t Put All Your Eggs in One Basket',
    body:'Dear {name},\n\nThe single most important rule in investing is diversification \u2014 spreading your money across different assets so that no single loss can derail your goals.\n\nAt EuroFiducia you can diversify across:\n\n\u2022 European & global equities\n\u2022 Government and corporate bonds\n\u2022 Real estate funds (SCPI)\n\u2022 Sustainable / ESG portfolios\n\u2022 Cryptoassets\n\u2022 Short-term fast plans for liquidity\n\nA well-diversified portfolio smooths out volatility and keeps you invested through every market condition. Our managed portfolios handle this for you automatically.\n\nBuild a balanced portfolio today \u2192\n\nThe EuroFiducia Investment Team'
  },
  {
    id:'adv_dca', icon:'\ud83d\udd04', name:'Dollar-Cost Averaging',
    subject:'\ud83d\udd04 The Simple Strategy That Removes the Stress of Timing',
    body:'Dear {name},\n\nMany beginners worry about investing \u201cat the right time.\u201d The truth is, nobody can predict the perfect moment. Dollar-cost averaging removes that stress entirely.\n\nThe idea is simple: invest a fixed amount on a regular schedule, regardless of what the market is doing.\n\n\u2022 When prices are high, you buy fewer units.\n\u2022 When prices are low, you buy more units.\n\u2022 Over time, your average cost per unit smooths out.\n\nThis disciplined approach turns market volatility into an advantage and keeps you consistently invested \u2014 which is what drives long-term returns.\n\nSet up a recurring investment plan today \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_patience', icon:'\ud83c\udf3f', name:'Patience Pays Off',
    subject:'\ud83c\udf3f The Best Investors Are Patient Investors',
    body:'Dear {name},\n\nMarkets rise and fall \u2014 that is their nature. What separates successful investors from the rest is patience.\n\nHistory shows that markets trend upward over the long run, even after sharp downturns. Investors who panic and sell during dips usually lock in losses. Those who stay invested capture the recovery and the growth that follows.\n\nAt EuroFiducia, our longer-term plans (monthly, quarterly, and yearly) are designed for exactly this kind of patient, steady growth. Pair them with our fast plans for short-term liquidity, and you have a complete strategy.\n\nStay the course. Your future self will thank you.\n\nThe EuroFiducia Team'
  },
  {
    id:'promo_gasfree', icon:'\ud83c\udf89', name:'Gas Fee Is On Us',
    subject:'\ud83c\udf89 Good News: We Cover Your Gas Fees',
    body:'Dear {name},\n\nHere is something most platforms won\u2019t tell you: we cover the gas fees on your deposits and plan investments.\n\nThat means:\n\n\u2022 No network fees deducted from your deposit\n\u2022 Your full principal goes to work for you\n\u2022 Faster, cheaper funding with cryptocurrency\n\nCombine that with our 24-hour and 48-hour fast plans (starting at $200), and you have one of the most efficient ways to put your money to work in Europe.\n\nFund your account and pick a plan \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'promo_unlock', icon:'\ud83d\udd13', name:'Unlock All Features After First Payment',
    subject:'\ud83d\udd13 One Payment Unlocks Everything on EuroFiducia',
    body:'Dear {name},\n\nA quick reminder of how EuroFiducia works: once your first deposit is confirmed \u2014 or your loan processing fee is settled \u2014 all platform features activate automatically.\n\nWhat unlocks:\n\n\u2022 Full investment marketplace (stocks, ETFs, bonds, crypto, real estate)\n\u2022 Fast investment plans (24h / 48h) and longer-term plans\n\u2022 Withdrawals to your verified account\n\u2022 Transaction receipts and portfolio statements\n\u2022 Loan disbursement (if you applied)\n\nThere\u2019s nothing else you need to do. Make your first deposit today (crypto is instant and the gas fee is on us) and everything switches on.\n\nGet started \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'promo_loan_fee', icon:'\ud83d\udcb0', name:'Loan Fee & Disbursement Explained',
    subject:'\ud83d\udcb0 Your Loan: Pay the Fee, Get the Funds',
    body:'Dear {name},\n\nIf you\u2019ve applied for a loan with EuroFiducia, here\u2019s what happens next.\n\nOnce your application is approved, a mandatory 5% processing fee must be settled before disbursement. This fee is settled in cryptocurrency so it can be verified instantly \u2014 which means we can release your loan funds the same day.\n\nOur assurance to you:\n\n\u2022 Full refund if your loan cannot be disbursed\n\u2022 Funds held in a segregated escrow wallet\n\u2022 Permanent blockchain transaction hash as proof of payment\n\u2022 Same-day verification and release\n\nAfter the fee is settled, your loan amount is disbursed to your verified bank account and all platform features activate automatically.\n\nCheck your dashboard \u2192 Loans for your application status.\n\nThe EuroFiducia Loan Team'
  },
  {
    id:'adv_goals', icon:'\ud83c\udfaf', name:'Set Your Financial Goals',
    subject:'\ud83c\udfaf What Are You Investing For? Let\u2019s Define Your Goal',
    body:'Dear {name},\n\nEvery successful investment journey starts with a clear goal. Knowing your \u201cwhy\u201d makes it far easier to stay disciplined when markets get noisy.\n\nCommon goals our investors share:\n\n\u2022 Building a retirement nest egg\n\u2022 Saving for a home deposit\n\u2022 Funding children\u2019s education\n\u2022 Creating a passive income stream\n\u2022 Growing an emergency fund that actually beats inflation\n\nOnce you know your goal, pick the plan that matches your timeline:\n\n\u2022 Short-term needs \u2192 24h / 48h / weekly fast plans\n\u2022 Medium-term goals \u2192 monthly or quarterly plans\n\u2022 Long-term wealth \u2192 yearly plans and managed portfolios\n\nDefine your goal and start today \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_emergency', icon:'\ud83d\uded1', name:'Investing vs Emergency Fund',
    subject:'\ud83d\uded1 Invest Smart: Keep a Buffer, Grow the Rest',
    body:'Dear {name},\n\nBefore you invest, here\u2019s a smart principle: keep an emergency fund, then put the rest to work.\n\nA good rule of thumb is to keep 3\u20136 months of living expenses in an easy-to-access account. Everything beyond that should be invested so it grows instead of losing value to inflation.\n\nEuroFiducia makes this easy:\n\n\u2022 Our fast plans (24h / 48h) act like a near-liquid investment for funds you might need soon.\n\u2022 Longer plans grow your long-term wealth.\n\nThat way you\u2019re protected and still growing \u2014 the best of both worlds.\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_inflation', icon:'\ud83d\udcc8', name:'Inflation Is Eating Your Savings',
    subject:'\ud83d\udcc8 The Silent Thief: How Inflation Shrinks Your Savings',
    body:'Dear {name},\n\nIf inflation is 3% a year and your bank account pays 0.5%, your money loses 2.5% of its real value every single year. Over a decade, that is a significant chunk of your purchasing power gone.\n\nInvesting is the antidote. Historically, a diversified portfolio returns well above inflation over the long term.\n\nDon\u2019t let inflation quietly undo years of hard work. Move idle cash into a EuroFiducia plan and let it grow.\n\nStart protecting your money today \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_passive', icon:'\ud83d\udcb8', name:'Build Passive Income',
    subject:'\ud83d\udcb8 Make Your Money Work While You Sleep',
    body:'Dear {name},\n\nThe wealthy don\u2019t only earn from their time \u2014 they earn from their assets. Dividends, interest, and investment returns create passive income that flows whether you\u2019re working, resting, or on holiday.\n\nAt EuroFiducia you can build passive income through:\n\n\u2022 Dividend-paying European equities\n\u2022 Bond coupon payments (French OAT, Italian BTP)\n\u2022 Real estate fund distributions\n\u2022 Fast-plan returns you can reinvest weekly\n\nStart small, reinvest your returns, and watch passive income become a growing part of your life.\n\nThe EuroFiducia Team'
  },
  {
    id:'promo_weekly', icon:'\ud83d\uddd3', name:'Weekly Plan Spotlight',
    subject:'\ud83d\uddd3 Earn Returns Every Single Week',
    body:'Dear {name},\n\nOur Weekly Investment Plan is one of the most popular choices for investors who want regular, predictable returns without locking funds away for months.\n\n\u2022 Term: 7 days\n\u2022 ROI: competitive weekly return\n\u2022 Capital returned at maturity\n\u2022 Reinvest to compound week after week\n\nIt is the ideal middle ground between our lightning-fast 24h/48h plans and our longer monthly, quarterly, and yearly options.\n\nOpen a weekly plan from your dashboard \u2192\n\nThe EuroFiducia Investment Team'
  },
  {
    id:'promo_monthly', icon:'\ud83d\udcc5', name:'Monthly Plan Spotlight',
    subject:'\ud83d\udcc5 Steady Monthly Returns, Your Way',
    body:'Dear {name},\n\nLooking for a balance between speed and growth? Our Monthly Investment Plan offers a solid return over a 30-day term \u2014 long enough to capture meaningful growth, short enough to stay flexible.\n\n\u2022 Term: 30 days\n\u2022 ROI: attractive monthly return\n\u2022 Maturity: principal + return credited automatically\n\nPair a monthly plan with a fast plan and you\u2019ve got both liquidity and growth working for you.\n\nExplore monthly plans in your dashboard \u2192\n\nThe EuroFiducia Investment Team'
  },
  {
    id:'promo_quarterly', icon:'\ud83c\udfa9', name:'Quarterly Plan Spotlight',
    subject:'\ud83c\udfa9 90 Days to Stronger Growth',
    body:'Dear {name},\n\nOur Quarterly Investment Plan gives your capital 90 days to grow \u2014 the sweet spot for investors who want a higher return than monthly plans but don\u2019t want to commit to a full year.\n\n\u2022 Term: 90 days\n\u2022 ROI: enhanced quarterly return\n\u2022 Auto-credited at maturity\n\nLonger terms reward patience with better rates. If you can wait three months, this is a smart, efficient choice.\n\nOpen a quarterly plan today \u2192\n\nThe EuroFiducia Investment Team'
  },
  {
    id:'promo_yearly', icon:'\ud83c\udf89', name:'Yearly Plan \u2014 Maximum Growth',
    subject:'\ud83c\udf89 Maximize Your Returns with Our Yearly Plan',
    body:'Dear {name},\n\nTime is the most powerful force in investing. Our Yearly Investment Plan rewards your patience with the highest ROI we offer \u2014 designed for long-term wealth builders.\n\n\u2022 Term: 365 days\n\u2022 ROI: maximum annual return\n\u2022 Principal + full return credited at maturity\n\nThis is the plan for retirement savings, building a home deposit, or any goal where compounding has time to work its magic.\n\nStart a yearly plan and let 12 months of growth work for you \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_first_deposit', icon:'\ud83c\udfa8', name:'Your First Deposit Matters Most',
    subject:'\ud83c\udfa8 The Hardest Deposit Is the First One',
    body:'Dear {name},\n\nEvery investor remembers their first deposit. It is the moment intention becomes action. After that, everything gets easier \u2014 you can see your money growing, reinvest your returns, and build momentum.\n\nYou don\u2019t need to start big. Our fast plans begin at just $200, and the gas fee is on us. One small deposit today can be the foundation of something significant.\n\nTake that first step. Future you will be grateful.\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_habit', icon:'\ud83d\udd04', name:'Build the Investing Habit',
    subject:'\ud83d\udd04 Consistency Beats Intensity in Investing',
    body:'Dear {name},\n\nYou don\u2019t need to time the market or make dramatic moves. You just need a habit. Investors who consistently add to their portfolio \u2014 even small amounts \u2014 outperform those who wait for the \u201cperfect\u201d moment.\n\nSet a simple rule for yourself:\n\n\u2022 Deposit a fixed amount each week or month\n\u2022 Reinvest your returns automatically\n\u2022 Review your portfolio quarterly, not daily\n\nSmall, steady habits compound into real wealth. Build yours today.\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_wealth', icon:'\ud83c\udfc6', name:'Wealth Is Built, Not Won',
    subject:'\ud83c\udfc6 Wealth Is Built, Not Won Overnight',
    body:'Dear {name},\n\nWealth is rarely the result of a single lucky break. It is built, layer by layer, through patience, discipline, and the decision to let your money work for you.\n\nEuroFiducia gives you the tools: fast plans for quick returns, longer plans for compounding growth, and managed portfolios for hands-off investing. The only missing ingredient is your decision to begin.\n\nStart building today. Brick by brick, plan by plan, your wealth takes shape.\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_risk_reward', icon:'\u2696\ufe0f', name:'Understanding Risk & Reward',
    subject:'\u2696\ufe0f Know Your Risk Tolerance Before You Invest',
    body:'Dear {name},\n\nInvesting always involves some risk \u2014 but risk is not the enemy. Unmanaged risk is. The key is matching your investments to your personal risk tolerance.\n\nConservative? Our bonds and balanced portfolios prioritise stability.\nBalanced? A mix of equities, bonds, and real estate spreads risk while seeking growth.\nGrowth-minded? Our growth portfolios and crypto options target higher returns.\n\nAnd for funds you want to keep flexible, our 24h / 48h / weekly plans offer short-term returns with quick access.\n\nKnow yourself, choose your plan, and invest with confidence.\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_community', icon:'\ud83c\udf0d', name:'Join Thousands of EuroFiducia Investors',
    subject:'\ud83c\udf0d You\u2019re Part of a Growing Community of Investors',
    body:'Dear {name},\n\nWhen you invest with EuroFiducia, you\u2019re never investing alone. You\u2019re joining thousands of investors across France, Italy, and the wider European Economic Area who are building their financial futures with us.\n\nOur community benefits from:\n\n\u2022 Regulated, transparent investment services\n\u2022 AI support in your language, 24/7\n\u2022 Plans for every timeline and goal\n\u2022 Gas fees covered on your deposits\n\nYou\u2019re in good company. Keep growing.\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_reinvest', icon:'\ud83c\udf00', name:'Reinvest to Accelerate Growth',
    subject:'\ud83c\udf00 Reinvest Your Returns and Watch Growth Accelerate',
    body:'Dear {name},\n\nWhen your fast plan or monthly plan matures, you have a choice: withdraw the return, or reinvest it. Reinvesting is the engine of compounding.\n\nEach time you reinvest, your next return is calculated on a larger base. Over many cycles, this transforms modest gains into meaningful wealth.\n\nOur dashboard makes it simple \u2014 when a plan matures, reinvest in one click into the same or a different plan.\n\nKeep the compounding cycle turning. Your future self will be glad you did.\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_dont_wait', icon:'\u23f3', name:'Don\u2019t Wait for the \u201cPerfect\u201d Time',
    subject:'\u23f3 The Best Time to Start Was Yesterday. The Next Best Is Today.',
    body:'Dear {name},\n\nMany people delay investing waiting for the \u201cperfect\u201d moment \u2014 when markets are calm, when they have more savings, when life is less busy. That moment rarely arrives.\n\nThe reality: time in the market beats timing the market. The investors who succeed are the ones who simply begin and stay consistent.\n\nWith EuroFiducia you can start from $200, choose a plan from 24 hours to a full year, and let us cover the gas fees. There is no perfect time. There is only today.\n\nStart now \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_tax', icon:'\ud83d\udcb4', name:'Tax-Advantaged Investing',
    subject:'\ud83d\udcb4 Invest Smartly: Understand Tax-Advantaged Products',
    body:'Dear {name},\n\nWhere you invest can be just as important as what you invest in. Tax-advantaged products let more of your returns stay in your pocket.\n\nDepending on your country:\n\n\u2022 France: PER (Plan d\u2019\u00c9pargne Retraite), Livret A, LDDS, PEA\n\u2022 Italy: PIR (Piano Individuale di Risparmio), deposit accounts\n\u2022 Other EU: country-specific wrappers\n\nThese can reduce or defer tax on your investment gains. Our retirement and savings products are designed to help you take advantage of these benefits.\n\nExplore tax-smart options in your dashboard \u2192\n\nThe EuroFiducia Team'
  },
  {
    id:'promo_referral', icon:'\ud83e\udd1d', name:'Refer & Grow Together',
    subject:'\ud83e\udd1d Invite Friends, Grow the EuroFiducia Community',
    body:'Dear {name},\n\nInvesting is more rewarding when you do it alongside people you trust. Invite friends and family to join EuroFiducia and help them start their own wealth-building journey.\n\nWhen your referrals make their first deposit:\n\n\u2022 They unlock all platform features\n\u2022 They gain access to fast plans from $200\n\u2022 They get gas-fee-free deposits, just like you\n\nA stronger community means a stronger platform for everyone. Share EuroFiducia today.\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_pride', icon:'\ud83c\udf1f', name:'Be Proud of Starting',
    subject:'\ud83c\udf1f You Did What Most People Only Talk About',
    body:'Dear {name},\n\nMost people talk about investing someday. You actually started. That alone puts you ahead of the majority. Be proud of that.\n\nEvery plan you open, every return you reinvest, every deposit you make \u2014 it all adds up. Wealth isn\u2019t built in a single dramatic move. It\u2019s built in moments just like this one.\n\nKeep going. You\u2019re on the right path.\n\nThe EuroFiducia Team'
  },
  {
    id:'adv_emotions', icon:'\ud83d\udc87', name:'Don\u2019t Let Emotions Drive Your Investing',
    subject:'\ud83d\udc87 Keep Calm and Stay Invested',
    body:'Dear {name},\n\nThe biggest threat to your returns isn\u2019t the market \u2014 it\u2019s your own emotions. Fear makes investors sell at the worst time. Greed makes them chase bubbles.\n\nThe antidote is a plan:\n\n\u2022 Decide your goals and timeline in advance\n\u2022 Pick plans that match your risk tolerance\n\u2022 Avoid checking your portfolio obsessively\n\u2022 Trust the process over the long term\n\nEuroFiducia\u2019s managed portfolios and structured plans help you stay disciplined by removing the day-to-day decision-making stress.\n\nInvest with your head, not your emotions.\n\nThe EuroFiducia Team'
  },
  {
    id:'motivate_recession', icon:'\ud83c\udf10', name:'Opportunities in Every Market',
    subject:'\ud83c\udf10 Down Markets Are Sale Days for Patient Investors',
    body:'Dear {name},\n\nWhen markets fall, headlines scream panic. But for long-term investors, downturns are simply assets going on sale.\n\nHistory is clear: every major decline has eventually been followed by recovery and new highs. Investors who buy during fear and hold through recovery capture the strongest gains.\n\nIf you have cash on the sidelines, consider our fast plans for liquidity and longer plans to deploy capital steadily through any market.\n\nDon\u2019t fear the dips. Use them.\n\nThe EuroFiducia Team'
  },
  {
    id:'promo_newplans', icon:'\ud83c\udf81', name:'New Plans Added',
    subject:'\ud83c\udf81 New Investment Plans Are Now Live on EuroFiducia',
    body:'Dear {name},\n\nWe\u2019ve expanded our investment lineup to give you even more flexibility:\n\n\u2022 24-Hour Fast Plan (from $200)\n\u2022 48-Hour Fast Plan (from $200)\n\u2022 Weekly Plan\n\u2022 Monthly Plan\n\u2022 Quarterly Plan\n\u2022 Yearly Plan (maximum ROI)\n\nWhether you want quick returns or long-term growth, there\u2019s now a plan that fits your exact timeline. And remember \u2014 the gas fee is on us.\n\nExplore all plans in your dashboard \u2192\n\nThe EuroFiducia Investment Team'
  },
  {
    id:'motivate_secure', icon:'\ud83d\udd12', name:'Your Money Is Secure',
    subject:'\ud83d\udd12 How EuroFiducia Keeps Your Investments Secure',
    body:'Dear {name},\n\nSecurity is the foundation of confident investing. Here\u2019s how we protect you:\n\n\u2022 Regulated investment services under European frameworks\n\u2022 KYC/AML compliance for every account\n\u2022 Segregated custody for your funds\n\u2022 Blockchain-verified crypto deposits with permanent proof\n\u2022 Encrypted data handling\n\nWhen your money is secure, you can invest with peace of mind. That\u2019s our commitment to you.\n\nThe EuroFiducia Team'
  }
];

// ---- Template manager (editable, persisted) ----
// Admin can EDIT any template's subject/body/name from the dashboard; edits are
// stored in EV.store under 'edited_email_templates' so they survive redeploy and
// device changes via the sync layer. Admin can also restore a template (or all)
// back to defaults. EV.emailTemplates is exposed as a live accessor so existing
// admin code always reads the latest edited versions.
EV.templates = {
  getAll: function() {
    var edited = EV.store.get('edited_email_templates', {});
    return EV._emailTemplatesDefaults.map(function(tpl) {
      if (edited[tpl.id]) {
        return Object.assign({}, tpl, edited[tpl.id]);
      }
      return tpl;
    });
  },
  getOne: function(id) {
    return this.getAll().find(function(t){ return t.id === id; }) || null;
  },
  edit: function(id, changes) {
    var edited = EV.store.get('edited_email_templates', {});
    edited[id] = Object.assign({}, edited[id] || {}, changes);
    EV.store.set('edited_email_templates', edited);
    return this.getOne(id);
  },
  reset: function(id) {
    var edited = EV.store.get('edited_email_templates', {});
    delete edited[id];
    EV.store.set('edited_email_templates', edited);
    return this.getOne(id);
  },
  resetAll: function() {
    EV.store.set('edited_email_templates', {});
    return this.getAll();
  }
};
Object.defineProperty(EV, 'emailTemplates', {
  get: function() { return EV.templates.getAll(); },
  configurable: true
});

// ===================== DATA STORE =====================
EV.store = {
  get: function(key, def) {
    try { var v = localStorage.getItem('ev_'+key); return v ? JSON.parse(v) : (def||null); }
    catch(e){ return def||null; }
  },
  set: function(key, val) {
    try { localStorage.setItem('ev_'+key, JSON.stringify(val)); } catch(e){}
  },
  push: function(key, item) {
    var arr = this.get(key, []);
    arr.push(item); this.set(key, arr); return arr;
  }
};

// ===================== EMAIL & SMS =====================
EV.mail = {
  // Send an email — stores a local record AND fires a request to the server
  // which attempts to deliver a REAL email via the Resend API (if configured).
  send: function(to, subject, body, opts) {
    opts = opts || {};
    var record = {
      id: 'E'+Date.now()+Math.random().toString(36).slice(2,5),
      to: to, subject: subject, body: body,
      time: new Date().toISOString(),
      type: opts.type || 'notification',
      template: opts.template || null,
      read: false
    };
    EV.store.push('email_log', record);
    // If to a specific user, also store in their email inbox
    if (opts.userId) {
      EV.store.push('user_emails_'+opts.userId, record);
    }
    // Fire-and-forget: tell the server to send the REAL email
    if (typeof fetch === 'function' && EV.sync && EV.sync.serverURL) {
      try {
        fetch(EV.sync.serverURL + '/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: to, subject: subject, body: body, opts: opts })
        }).then(function(r){ return r.json(); }).then(function(result){
          if (result && result.delivered) {
            console.log('[mail] Real email delivered to', to);
          } else if (result && result.simulated) {
            console.log('[mail] Email simulated (server has no email API key configured)');
          }
        }).catch(function(e){ /* silent — local record already stored */ });
      } catch (e) {}
    }
    return record;
  },
  // Send an SMS — stores a local record AND fires a request to the server
  sendSMS: function(phone, message, opts) {
    opts = opts || {};
    var record = {
      id: 'S'+Date.now()+Math.random().toString(36).slice(2,5),
      to: phone, message: message,
      time: new Date().toISOString(),
      type: opts.type || 'sms_notification',
      read: false
    };
    EV.store.push('sms_log', record);
    if (opts.userId) {
      EV.store.push('user_sms_'+opts.userId, record);
    }
    // Fire-and-forget: tell the server to attempt real SMS delivery
    if (typeof fetch === 'function' && EV.sync && EV.sync.serverURL) {
      try {
        fetch(EV.sync.serverURL + '/api/sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: phone, message: message, opts: opts })
        }).catch(function(){});
      } catch (e) {}
    }
    return record;
  }
};

// ===================== AUTH =====================
EV.auth = {
  register: function(data) {
    var users = EV.store.get('users', []);
    var existing = users.find(function(u){return u.email===data.email;});
    if (existing) return {ok:false, msg:'Email already registered'};
    var user = {
      id: 'U'+Date.now(),
      firstName: data.firstName, lastName: data.lastName,
      email: data.email, phone: data.phone, password: data.password,
      country: data.country, lang: data.lang || getCurrentLang(),
      kycStatus: 'pending', accountStatus: 'pending', // NEW: accounts start pending
      riskProfile: data.riskProfile || 'balanced',
      investorType: data.investorType || 'retail',
      // KYC details
      idType: data.idType||'', idNumber: data.idNumber||'',
      dob: data.dob||'', taxResidency: data.taxResidency||'',
      address: data.address||'', city: data.city||'', postalCode: data.postalCode||'',
      // Investor profile
      experience: data.experience||'', income: data.income||'',
      objective: data.objective||'', horizon: data.horizon||'',
      // NEW: Bank account verification
      bankName: data.bankName||'', accountHolder: data.accountHolder||'',
      iban: data.iban||'', bic: data.bic||'', bankAccountNumber: data.bankAccountNumber||'',
      bankCountry: data.bankCountry||data.country||'',
      // Compliance
      pep: data.pep||false, sanctions: data.sanctions||false, aml: data.aml||false,
      // SMS opt-in
      smsOptIn: data.smsOptIn||false,
      createdAt: new Date().toISOString(),
      balance: 0, invested: 0, pl: 0,
      portfolio: [], transactions: [], messages: [],
      verified: false,
      // Referral system
      referralCode: EV.util.genReferralCode(),
      referredBy: data.referredBy || ''
    };
    users.push(user);
    EV.store.set('users', users);
    // Send acknowledgment email to user
    EV.mail.send(user.email,
      'Account Submission Received — EuroFiducia',
      'Dear '+user.firstName+' '+user.lastName+',\n\nThank you for submitting your account application to EuroFiducia. We have received your registration details, identity information, and bank account verification.\n\nYour account is currently under review by our compliance team. This process typically takes 1-2 business days. During this time, our team will verify your identity documents and bank account details in accordance with European AML/KYC regulations.\n\nWhat happens next:\n1. Our compliance team reviews your submission\n2. You will receive an email once your account is approved\n3. Upon approval, you can make your first deposit and start investing\n\nIf we need any additional information, we will contact you via email and your dashboard.\n\nYou can track your account status by logging into your dashboard.\n\nThank you for choosing EuroFiducia.\n\nBest regards,\nThe EuroFiducia Compliance Team\nEuroFiducia SAS — France & Italy',
      {type:'account_acknowledgment', userId:user.id});
    // Send SMS acknowledgment if opted in
    if (user.smsOptIn && user.phone) {
      EV.mail.sendSMS(user.phone,
        'EuroFiducia: Account submission received. Your application is under review. You will be notified once approved. Track status in your dashboard.',
        {type:'account_acknowledgment', userId:user.id});
    }
    // Notify admin
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'registration', time: new Date().toISOString(),
      userId: user.id, userName: user.firstName+' '+user.lastName,
      text: 'New account registration: '+user.firstName+' '+user.lastName+' ('+user.email+') — Status: PENDING review',
      read: false
    });
    // Also email admin
    EV.mail.send('admin@eurofiducia.eu',
      'New Account Registration — '+user.firstName+' '+user.lastName,
      'A new user has registered:\n\nName: '+user.firstName+' '+user.lastName+'\nEmail: '+user.email+'\nPhone: '+user.phone+'\nCountry: '+user.country+'\nBank: '+user.bankName+' (IBAN: '+user.iban+')\n\nAccount status: PENDING\nPlease review in the admin dashboard → User Management.',
      {type:'admin_registration_alert'});
    return {ok:true, user:user};
  },
  login: function(email, password) {
    var users = EV.store.get('users', []);
    var admin = EV.store.get('admin', {email:'admin@eurofiducia.eu', password:'admin123'});
    if (email===admin.email && password===admin.password) {
      EV.store.set('admin_session', {email:admin.email, time:Date.now()});
      return {ok:true, role:'admin'};
    }
    var user = users.find(function(u){return u.email===email && u.password===password;});
    if (!user) return {ok:false, msg:'Invalid email or password'};
    if (user.accountStatus==='suspended') return {ok:false, msg:'Account suspended. Contact support.'};
    EV.store.set('session', {userId:user.id, time:Date.now()});
    return {ok:true, role:'user', user:user};
  },
  logout: function() {
    EV.store.set('session', null);
    EV.store.set('admin_session', null);
    window.location.href = '../index.html';
  },
  currentUser: function() {
    var sess = EV.store.get('session');
    if (!sess) return null;
    var users = EV.store.get('users', []);
    return users.find(function(u){return u.id===sess.userId;}) || null;
  },
  isAdmin: function() {
    return !!EV.store.get('admin_session');
  },
  updateUser: function(userId, updates) {
    var users = EV.store.get('users', []);
    var idx = users.findIndex(function(u){return u.id===userId;});
    if (idx>=0) { users[idx] = Object.assign(users[idx], updates); EV.store.set('users', users); return users[idx]; }
    return null;
  },
  // Admin approves a pending account
  approveAccount: function(userId) {
    // Generate unique account numbers upon approval (only if not already assigned)
    var existing = EV.store.get('users', []).find(function(u){return u.id===userId;});
    var acctNo = (existing && existing.accountNumber) ? existing.accountNumber : EV.util.genAccountNumber();
    var memberId = (existing && existing.memberId) ? existing.memberId : EV.util.genMemberId();
    var user = this.updateUser(userId, {
      accountStatus:'active', kycStatus:'verified', verified:true,
      accountNumber: acctNo, memberId: memberId, approvedAt: new Date().toISOString()
    });
    if (user) {
      // === $200 SIGN-UP BONUS ===
      // Credit $200 sign-up bonus to the newly approved user
      EV.tx.generate(userId, {
        type: 'deposit',
        amount: 200,
        method: 'Sign-up Bonus',
        description: '$200 Sign-up Bonus — Welcome to EuroFiducia!',
        status: 'completed'
      });
      // Record bonus flag on user so it's only given once
      EV.auth.updateUser(userId, { signupBonusCredited: true });

      // === $50 REFERRAL BONUS ===
      // If this user was referred by someone, credit $50 to the referrer
      if (user.referredBy) {
        var allUsers = EV.store.get('users', []);
        var referrer = allUsers.find(function(u){ return u.referralCode === user.referredBy; });
        if (referrer) {
          EV.tx.generate(referrer.id, {
            type: 'deposit',
            amount: 50,
            method: 'Referral Bonus',
            description: '$50 Referral Bonus — ' + user.firstName + ' ' + user.lastName + ' joined EuroFiducia',
            status: 'completed'
          });
          // Track referral count on referrer
          EV.auth.updateUser(referrer.id, {
            referralCount: (referrer.referralCount || 0) + 1,
            referralEarnings: (referrer.referralEarnings || 0) + 50
          });
          // Notify referrer
          EV.mail.send(referrer.email,
            'Referral Bonus Earned — $50 Credited!',
            'Dear ' + referrer.firstName + ',\n\nCongratulations! You earned a $50 referral bonus.\n\n' +
            user.firstName + ' ' + user.lastName + ' has successfully opened and verified their EuroFiducia account using your referral code (' + user.referredBy + ').\n\n' +
            '$50.00 has been credited to your EuroFiducia account balance.\n\n' +
            'Keep sharing your referral code to earn more!\n\nBest regards,\nThe EuroFiducia Team',
            {type:'referral_bonus', userId:referrer.id});
          if (referrer.smsOptIn && referrer.phone) {
            EV.mail.sendSMS(referrer.phone, 'EuroFiducia: You earned a $50 referral bonus! ' + user.firstName + ' ' + user.lastName + ' joined using your code. $50 credited to your balance.', {type:'referral_bonus', userId:referrer.id});
          }
        }
      }

      EV.mail.send(user.email,
        'Account Approved — Welcome to EuroFiducia!',
        'Dear '+user.firstName+' '+user.lastName+',\n\nGreat news! Your EuroFiducia account has been approved and is now fully active.\n\n'+'========================================\n'+'  YOUR OFFICIAL EUROFIDUCIA ACCOUNT DETAILS\n'+'========================================\n'+'  Account Number      : '+user.accountNumber+'\n'+'  Client / Member ID  : '+user.memberId+'\n'+'========================================\n\n'+'Please keep these identifiers safe. They appear on your dashboard, transaction receipts, and all official correspondence. Quote your Account Number when contacting support.\n\n'+'========================================\n'+'  $200 SIGN-UP BONUS — CREDITED TO YOUR ACCOUNT\n'+'========================================\n'+'  A $200.00 welcome bonus has been credited to your account balance! Use it toward your first investment.\n'+'========================================\n\n'+'You can now:\n• Make deposits via SEPA, card, open banking, or cryptocurrency\n• Invest in any of our portfolios and products\n• Request withdrawals to your verified bank account\n• Access all platform features\n• Refer friends and earn $50 per referral — find your referral code on your dashboard\n\nLog in to your dashboard to get started →\n\nWelcome aboard!\nThe EuroFiducia Team',
        {type:'account_approved', userId:user.id});
      if (user.smsOptIn && user.phone) {
        EV.mail.sendSMS(user.phone, 'EuroFiducia: Account approved! Acct No: '+user.accountNumber+' | Member ID: '+user.memberId+'. $200 sign-up bonus credited! You can now deposit, invest & refer friends for $50 each.', {type:'account_approved', userId:user.id});
      }
      EV.store.push('admin_notifications', {
        id: Date.now(), type:'account_approved', time: new Date().toISOString(),
        userId: user.id, userName: user.firstName+' '+user.lastName,
        text: 'Account approved: '+user.firstName+' '+user.lastName+' ('+user.email+') — Acct '+user.accountNumber,
        read: false
      });
    }
    return user;
  },
  resetPassword: function(email, newPassword) {
    var users = EV.store.get('users', []);
    var idx = users.findIndex(function(u){return u.email===email;});
    if (idx<0) return {ok:false, msg:'Email not found'};
    users[idx].password = newPassword;
    EV.store.set('users', users);
    // Notify user of password change
    EV.mail.send(email, 'Password Changed — EuroFiducia',
      'Dear '+users[idx].firstName+',\n\nYour EuroFiducia account password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.\n\nBest regards,\nThe EuroFiducia Security Team',
      {type:'password_change', userId:users[idx].id});
    // Notify admin
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'password_reset', time: new Date().toISOString(),
      userName: users[idx].firstName+' '+users[idx].lastName,
      text: 'Password reset by '+users[idx].email, read:false
    });
    return {ok:true};
  },
  resetAdminPassword: function(newPassword) {
    var admin = EV.store.get('admin', {email:'admin@eurofiducia.eu', password:'admin123'});
    admin.password = newPassword;
    EV.store.set('admin', admin);
    return {ok:true};
  }
};

// ===================== NOTIFICATIONS =====================
EV.notify = {
  trackVisit: function() {
    var visits = EV.store.get('visits', []);
    var visit = {
      id: Date.now(), time: new Date().toISOString(),
      ip: 'visitor-'+Math.random().toString(36).slice(2,8),
      page: window.location.pathname.split('/').pop() || 'index.html',
      lang: getCurrentLang()
    };
    visits.push(visit);
    if (visits.length > 500) visits = visits.slice(-500);
    EV.store.set('visits', visits);
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'visit', time: visit.time,
      text: 'New visitor on '+visit.page+' ('+visit.lang.toUpperCase()+')',
      read: false
    });
    // Email admin about visit (first visit per session only)
    if (!sessionStorage.getItem('ev_visit_logged')) {
      sessionStorage.setItem('ev_visit_logged','1');
      EV.mail.send('admin@eurofiducia.eu', 'New Website Visit',
        'A new visitor has arrived on the EuroFiducia platform.\n\nPage: '+visit.page+'\nLanguage: '+visit.lang.toUpperCase()+'\nTime: '+new Date().toLocaleString()+'\n\nThis is an automated notification.',
        {type:'admin_visit_alert'});
    }
  },
  deposit: function(userId, amount, method) {
    var user = EV.auth.currentUser() || EV.store.get('users',[]).find(function(u){return u.id===userId;});
    var userName = user ? user.firstName+' '+user.lastName : 'Unknown';
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'deposit', time: new Date().toISOString(),
      userId: userId, userName: userName,
      text: 'Deposit request: €'+amount+' via '+method+' by '+(user?user.email:''),
      read: false, amount: amount
    });
    // Email admin
    EV.mail.send('admin@eurofiducia.eu', 'Deposit Alert — €'+amount+' by '+userName,
      'A deposit has been initiated:\n\nUser: '+userName+'\nEmail: '+(user?user.email:'')+'\nAmount: €'+amount+'\nMethod: '+method+'\nTime: '+new Date().toLocaleString()+'\n\nReview in admin dashboard.',
      {type:'admin_deposit_alert'});
    // Notify user via email + dashboard
    if (user) {
      EV.mail.send(user.email, 'Deposit Received — €'+amount,
        'Dear '+user.firstName+',\n\nWe have received your deposit request of €'+amount+' via '+method+'.\n\nYour funds will be credited to your account within 1-2 business days. You will receive a transaction receipt once processing is complete.\n\nThank you for investing with EuroFiducia.\n\nThe EuroFiducia Team',
        {type:'deposit_confirmation', userId:user.id});
      if (user.smsOptIn && user.phone) {
        EV.mail.sendSMS(user.phone, 'EuroFiducia: Deposit of €'+amount+' received via '+method+'. Processing within 1-2 business days.', {type:'deposit_confirmation', userId:user.id});
      }
    }
  },
  withdraw: function(userId, amount) {
    var user = EV.auth.currentUser() || EV.store.get('users',[]).find(function(u){return u.id===userId;});
    var userName = user ? user.firstName+' '+user.lastName : 'Unknown';
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'withdraw', time: new Date().toISOString(),
      userId: userId, userName: userName,
      text: 'Withdrawal request: €'+amount+' by '+(user?user.email:''),
      read: false, amount: amount
    });
    // Email admin
    EV.mail.send('admin@eurofiducia.eu', 'Withdrawal Alert — €'+amount+' by '+userName,
      'A withdrawal has been requested:\n\nUser: '+userName+'\nEmail: '+(user?user.email:'')+'\nAmount: €'+amount+'\nTime: '+new Date().toLocaleString()+'\n\nReview and process in admin dashboard.',
      {type:'admin_withdrawal_alert'});
    // Notify user
    if (user) {
      EV.mail.send(user.email, 'Withdrawal Request Received — €'+amount,
        'Dear '+user.firstName+',\n\nWe have received your withdrawal request for €'+amount+'.\n\nYour withdrawal is now going through compliance checks and will be processed within 3-5 business days. Funds will be transferred to your verified bank account ('+user.iban+').\n\nYou will receive a confirmation receipt once the transfer is complete.\n\nThe EuroFiducia Team',
        {type:'withdrawal_confirmation', userId:user.id});
      if (user.smsOptIn && user.phone) {
        EV.mail.sendSMS(user.phone, 'EuroFiducia: Withdrawal of €'+amount+' received. Processing within 3-5 business days to your bank account.', {type:'withdrawal_confirmation', userId:user.id});
      }
    }
  },
  supportMessage: function(userId, userName, message, aiHandled) {
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'support', time: new Date().toISOString(),
      userId: userId, userName: userName,
      text: 'Support message from '+userName+': "'+message.substring(0,60)+(message.length>60?'...':'')+'" — '+(aiHandled?'AI handling':'Needs human reply'),
      read: false, aiHandled: aiHandled
    });
    // Email admin — notify that AI is responding OR escalation needed
    EV.mail.send('admin@eurofiducia.eu',
      aiHandled ? 'AI Support Active — '+userName : 'Support Escalation Needed — '+userName,
      aiHandled
        ? 'The AI support assistant is currently responding to a user query.\n\nUser: '+userName+'\nMessage: "'+message+'"\n\nThe AI is handling this question. You can join the conversation in the admin dashboard → Support Inbox if you wish to intervene.\n\nThis is an automated notification.'
        : 'A user question has been escalated to human support — the AI could not answer it.\n\nUser: '+userName+'\nMessage: "'+message+'"\n\nPlease log in to the admin dashboard → Support Inbox and reply to this user.\n\nThis requires your immediate attention.',
      {type: aiHandled?'admin_ai_alert':'admin_escalation_alert'});
  },
  // Generic activity notification — any user activity notifies admin + user
  activity: function(userId, activityType, description) {
    var user = EV.store.get('users',[]).find(function(u){return u.id===userId;});
    var userName = user ? user.firstName+' '+user.lastName : 'Unknown';
    // Admin notification
    EV.store.push('admin_notifications', {
      id: Date.now(), type:activityType, time: new Date().toISOString(),
      userId: userId, userName: userName,
      text: description, read:false
    });
    // Email admin
    EV.mail.send('admin@eurofiducia.eu', 'User Activity — '+activityType+' — '+userName,
      'User activity notification:\n\nUser: '+userName+'\nEmail: '+(user?user.email:'')+'\nActivity: '+activityType+'\nDetails: '+description+'\nTime: '+new Date().toLocaleString(),
      {type:'admin_activity_alert'});
  },
  loanFeeNotice: function(userId, breakdown) {
    var user = EV.store.get('users', []).find(function(u){return u.id===userId;}) || EV.auth.currentUser();
    if (!user) return;
    var b = breakdown;
    var reasonsText = EV.loanFee.cryptoReasons.map(function(r){
      return r.title + '\n' + r.body + '\n';
    }).join('\n');
    var subject = 'Loan Application Received — ' + b.loanType + ' — APR/TAEG Breakdown — EuroFiducia';
    var body = 'Dear ' + user.firstName + ',\n\n' +
      'We have received your loan application. Below is the complete breakdown of your loan terms, ' +
      'including the mandatory processing fee and the applicable APR/TAEG.\n\n' +
      '========================================\n' +
      'LOAN APPLICATION SUMMARY\n' +
      '========================================\n' +
      'Loan Type:           ' + b.loanType + '\n' +
      'Loan Amount:         €' + b.principal.toFixed(2) + '\n' +
      'Repayment Term:      ' + b.termMonths + ' months\n' +
      'Annual Interest Rate: ' + b.annualRatePct + '%\n' +
      'Total Interest:      €' + b.totalInterest.toFixed(2) + '\n' +
      'Mandatory Fee (5%):  €' + b.loanFee.toFixed(2) + '\n' +
      'Total Repayable:     €' + b.totalRepayable.toFixed(2) + '\n' +
      'Monthly Payment:     €' + b.monthlyPayment.toFixed(2) + '\n' +
      'Applicable APR/TAEG: ' + b.taeg.toFixed(2) + '%\n' +
      '========================================\n\n' +
      'APR/TAEG FORMULA:\n' +
      b.formulaText + '\n\n' +
      'IMPORTANT — MANDATORY PROCESSING FEE NOTICE:\n' +
      'If your loan is approved, a mandatory 5% processing fee of €' + b.loanFee.toFixed(2) + ' ' +
      'must be deposited before your loan funds can be disbursed. This fee is included in the APR/TAEG ' +
      'calculation shown above, in accordance with EU Consumer Credit Directive 2008/48/EC and Italian ' +
      'Legislative Decree 141/2010, which require all mandatory fees to be reflected in the effective annual rate.\n\n' +
      'The processing fee must be settled in cryptocurrency (Bitcoin or USDT). Below are the five reasons ' +
      'this fee is settled in cryptocurrency, along with the protections that apply to your payment:\n\n' +
      '========================================\n' +
      'WHY YOUR LOAN FEE IS SETTLED IN CRYPTOCURRENCY\n' +
      '========================================\n\n' +
      reasonsText + '\n' +
      '========================================\n' +
      'OUR ASSURANCE TO YOU\n' +
      '========================================\n' +
      '• Full Refund Guarantee: If your loan is not approved or cannot be disbursed, your fee is refunded in full within 48 hours.\n' +
      '• Segregated Escrow: Your fee is held in a protected, auditable escrow wallet separate from operating funds.\n' +
      '• Blockchain Proof: You receive a permanent transaction hash as legal proof of payment.\n' +
      '• Same-Day Disbursement: Crypto settlement enables same-day verification and release of your loan funds.\n\n' +
      'Your application is now under review. Our team will assess your application and notify you of the ' +
      'decision within 2-3 business days. If approved, you will receive a second email with the cryptocurrency ' +
      'wallet addresses for fee deposit and instructions to complete the process.\n\n' +
      'You can track your application status in your dashboard → Loans.\n\n' +
      'The EuroFiducia Loan Team\n' +
      'EuroFiducia Investment Platform | ACPR · AMF · CONSOB Regulated';
    EV.mail.send(user.email, subject, body, {type:'loan_fee_notice', userId:user.id});
    if (user.smsOptIn && user.phone) {
      EV.mail.sendSMS(user.phone, 'EuroFiducia: Loan application for ' + b.loanType + ' received. APR/TAEG: ' + b.taeg.toFixed(2) + '%. If approved, a 5% fee (€' + b.loanFee.toFixed(2) + ') must be deposited in crypto. Check your email for full details.', {type:'loan_fee_notice', userId:user.id});
    }
  },
  loanApproved: function(userId, appId, breakdown) {
    var user = EV.store.get('users', []).find(function(u){return u.id===userId;}) || EV.auth.currentUser();
    if (!user) return;
    var b = breakdown;
    var wallets = EV.store.get('admin_wallets', {});
    var btcAddr = (wallets.bitcoin && wallets.bitcoin.address) ? wallets.bitcoin.address : 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    var usdtAddr = (wallets.usdt && wallets.usdt.address) ? wallets.usdt.address : 'TQn9Y2khEsLJW1vFQXtcYbKHEfQkN7WxqE';
    var reasonsText = EV.loanFee.cryptoReasons.map(function(r){
      return r.title + '\n' + r.body + '\n';
    }).join('\n');
    var subject = '✅ LOAN APPROVED — ' + b.loanType + ' — Deposit Required — EuroFiducia';
    var body = 'Dear ' + user.firstName + ',\n\n' +
      'CONGRATULATIONS! Your loan application has been approved.\n\n' +
      '========================================\n' +
      'APPROVED LOAN SUMMARY\n' +
      '========================================\n' +
      'Application ID:      ' + appId + '\n' +
      'Loan Type:           ' + b.loanType + '\n' +
      'Loan Amount:         €' + b.principal.toFixed(2) + '\n' +
      'Repayment Term:      ' + b.termMonths + ' months\n' +
      'Annual Interest Rate: ' + b.annualRatePct + '%\n' +
      'Total Interest:      €' + b.totalInterest.toFixed(2) + '\n' +
      'Mandatory Fee (5%):  €' + b.loanFee.toFixed(2) + '\n' +
      'Total Repayable:     €' + b.totalRepayable.toFixed(2) + '\n' +
      'Monthly Payment:     €' + b.monthlyPayment.toFixed(2) + '\n' +
      'Applicable APR/TAEG: ' + b.taeg.toFixed(2) + '%\n' +
      '========================================\n\n' +
      'ACTION REQUIRED — DEPOSIT YOUR PROCESSING FEE\n\n' +
      'Before your loan funds of €' + b.principal.toFixed(2) + ' can be disbursed to your verified bank account, ' +
      'you must deposit the mandatory 5% processing fee of €' + b.loanFee.toFixed(2) + ' in cryptocurrency.\n\n' +
      'Send your fee payment to ONE of the following wallet addresses:\n\n' +
      'OPTION 1 — BITCOIN (BTC)\n' +
      'Network: Bitcoin (BTC)\n' +
      'Address: ' + btcAddr + '\n\n' +
      'OPTION 2 — USDT (Tether)\n' +
      'Network: TRC-20 (Tron)\n' +
      'Address: ' + usdtAddr + '\n\n' +
      'Send exactly €' + b.loanFee.toFixed(2) + ' equivalent in BTC or USDT to the address above. ' +
      'After sending, log in to your dashboard → Loans → click "I Have Paid the Fee" and enter your ' +
      'transaction hash. Your loan funds will be disbursed within 24 hours of fee verification.\n\n' +
      '========================================\n' +
      'WHY YOUR LOAN FEE IS SETTLED IN CRYPTOCURRENCY\n' +
      '========================================\n\n' +
      reasonsText + '\n' +
      '========================================\n' +
      'OUR ASSURANCE TO YOU\n' +
      '========================================\n' +
      '• Full Refund Guarantee: If your loan cannot be disbursed for any reason, your fee is refunded in full within 48 hours.\n' +
      '• Segregated Escrow: Your fee is held in a protected, auditable escrow wallet separate from operating funds.\n' +
      '• Blockchain Proof: You receive a permanent transaction hash as legal proof of payment.\n' +
      '• Same-Day Disbursement: Crypto settlement enables same-day verification and release of your loan funds.\n\n' +
      'Do not share your transaction hash with anyone except EuroFiducia support. Our team will never ask for your ' +
      'private keys, seed phrases, or wallet passwords.\n\n' +
      'The EuroFiducia Loan Team\n' +
      'EuroFiducia Investment Platform | ACPR · AMF · CONSOB Regulated';
    EV.mail.send(user.email, subject, body, {type:'loan_approved_fee', userId:user.id});
    if (user.smsOptIn && user.phone) {
      EV.mail.sendSMS(user.phone, 'EuroFiducia: Your ' + b.loanType + ' loan is APPROVED! Deposit the 5% fee (€' + b.loanFee.toFixed(2) + ') in crypto (BTC or USDT). Check email for wallet addresses.', {type:'loan_approved_fee', userId:user.id});
    }
  },
  loanRejected: function(userId, appId, loanType) {
    var user = EV.store.get('users', []).find(function(u){return u.id===userId;}) || EV.auth.currentUser();
    if (!user) return;
    var subject = 'Loan Application Update — ' + loanType + ' — EuroFiducia';
    var body = 'Dear ' + user.firstName + ',\n\n' +
      'Thank you for your loan application for ' + loanType + ' (Reference: ' + appId + ').\n\n' +
      'After a careful review of your application, we regret to inform you that we are unable to approve ' +
      'your loan request at this time. This decision was based on our internal credit assessment criteria.\n\n' +
      'IMPORTANT: No processing fee is required. Since your application was not approved, no fee has been ' +
      'charged and no payment is needed from you.\n\n' +
      'You may reapply after 90 days. If you believe this decision was made in error, or if your financial ' +
      'circumstances have changed, please contact our support team.\n\n' +
      'The EuroFiducia Loan Team\n' +
      'EuroFiducia Investment Platform | ACPR · AMF · CONSOB Regulated';
    EV.mail.send(user.email, subject, body, {type:'loan_rejected', userId:user.id});
    if (user.smsOptIn && user.phone) {
      EV.mail.sendSMS(user.phone, 'EuroFiducia: Your ' + loanType + ' loan application was not approved. No fee is required. Check email for details.', {type:'loan_rejected', userId:user.id});
    }
  },
  toast: function(title, msg, type) {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
    var icons = {success:'✅',danger:'❌',warning:'⚠️',info:'ℹ️'};
    var el = document.createElement('div');
    el.className = 'toast '+(type||'info');
    el.innerHTML = '<div class="toast-icon">'+(icons[type]||'ℹ️')+'</div><div class="toast-content"><h5>'+title+'</h5><p>'+msg+'</p></div>';
    wrap.appendChild(el);
    setTimeout(function(){ el.style.opacity='0'; el.style.transform='translateX(100%)'; setTimeout(function(){el.remove();},300); }, 4000);
  }
};

// ===================== LOAN FEE SYSTEM =====================
EV.loanFee = {
  rate: 0.05, // 5% mandatory processing fee
  cryptoReasons: [
    {
      title: '1. Regulatory AML/KYC Compliance Verification',
      body: 'Under EU Anti-Money Laundering Directives (AMLD5/AMLD6) and the Italian Decreto Legislativo 231/2007, every loan disbursement above EUR 1,000 requires verified source-of-funds and identity checks. Cryptocurrency settlement allows our compliance team to verify the fee payment against the blockchain ledger instantly, satisfying KYC/AML obligations without the 3-5 day hold that traditional SEPA or wire transfers impose during compliance review.'
    },
    {
      title: '2. Instant Fee Settlement & Same-Day Loan Disbursement',
      body: 'Traditional bank transfers take 1-3 business days to clear, delaying your loan disbursement. Cryptocurrency transactions confirm on the blockchain within minutes, allowing EuroFiducia to verify your fee payment the same day and release your loan funds immediately. This means you receive your approved loan amount faster than any conventional banking process allows.'
    },
    {
      title: '3. Cross-Border Processing Without Intermediary Holds',
      body: 'EuroFiducia operates across France, Italy, and the broader European Economic Area. International bank transfers between member states can be flagged, held, or delayed by correspondent banks for compliance reviews. Cryptocurrency bypasses the correspondent banking network entirely, ensuring your fee reaches our settlement wallet without intermediary holds, frozen funds, or unexpected return-to-sender delays.'
    },
    {
      title: '4. Segregated Fee Escrow & Fund Protection Guarantee',
      body: 'Your processing fee is deposited directly into a segregated escrow wallet, separate from EuroFiducia operating accounts. This means your fee is protected and ring-fenced: it cannot be used for company operations, and if your loan cannot be disbursed for any reason, the full fee is returned to you within 48 hours. The blockchain address serves as verifiable proof that your funds are held in escrow, not commingled.'
    },
    {
      title: '5. Blockchain Audit Trail for Legal & Tax Documentation',
      body: 'Every cryptocurrency transaction produces a permanent, immutable record on the blockchain with a unique transaction hash. This hash serves as legally admissible proof of payment for your tax records, loan documentation, and any future audit by Italian Agenzia delle Entrate or French DGFiP. Unlike bank statements that can be disputed or take weeks to issue, your blockchain transaction hash is instantly verifiable by any third party.'
    }
  ],
  calculate: function(loanType, amount, termMonths, annualRatePct) {
    var principal = parseFloat(amount);
    var rate = parseFloat(annualRatePct) / 100;
    var term = parseInt(termMonths, 10);
    var totalInterest = principal * rate * (term / 12);
    var fee = principal * this.rate;
    var totalRepayable = principal + totalInterest;
    var taeg = ((totalInterest + fee) / principal) * (12 / term) * 100;
    return {
      loanType: loanType,
      principal: principal,
      termMonths: term,
      annualRatePct: parseFloat(annualRatePct),
      totalInterest: totalInterest,
      loanFee: fee,
      loanFeePct: this.rate * 100,
      totalRepayable: totalRepayable,
      monthlyPayment: totalRepayable / term,
      taeg: taeg,
      formulaText: '€'+principal.toFixed(2)+' (amount) + '+term+' months (term) + €'+totalInterest.toFixed(2)+' (interest @ '+annualRatePct+'%) + €'+fee.toFixed(2)+' (5% mandatory fee) = '+taeg.toFixed(2)+'% APR/TAEG'
    };
  }
};

// ===================== AI SUPPORT =====================
EV.ai = {
  kb: {
    deposit: {
      en: "To deposit funds, go to your Dashboard → Deposit. The minimum first deposit is €100. We recommend cryptocurrency (BTC, ETH, USDT) for instant funding — confirmed in minutes with no bank verification needed. We also support SEPA bank transfer, card payments, and open banking (funds appear within 1-2 business days for SEPA).",
      fr: "Pour déposer des fonds, allez dans votre Tableau de bord → Dépôt. Le dépôt minimum est de 100 €. Nous recommandons la crypto-monnaie (BTC, ETH, USDT) pour un financement instantané — confirmé en minutes sans vérification bancaire. Nous acceptons aussi les virements SEPA, les paiements par carte et la banque ouverte (1-2 jours ouvrés pour SEPA).",
      it: "Per depositare fondi, vai su Dashboard → Deposito. Il deposito minimo è di €100. Consigliamo criptovalute (BTC, ETH, USDT) per un finanziamento istantaneo — confermato in minuti senza verifica bancaria. Accettiamo anche bonifico SEPA, carta e open banking (1-2 giorni lavorativi per SEPA).",
    },
    withdraw: {
      en: "To withdraw funds, go to Dashboard → Withdraw. Enter the amount and select your bank account. Withdrawals go through compliance checks and are processed within 3-5 business days.",
      fr: "Pour retirer des fonds, allez dans Tableau de bord → Retrait. Saisissez le montant et sélectionnez votre compte bancaire. Les retraits passent par des contrôles de conformité (3-5 jours ouvrés).",
      it: "Per prelevare, vai su Dashboard → Prelievo. Inserisci l'importo e seleziona il conto. I prelievi sono verificati per conformità (3-5 giorni lavorativi).",
    },
    investments: {
      en: "We offer stocks, ETFs, government bonds (French OAT & Italian BTP), corporate bonds, real estate funds (SCPI), ESG/sustainable investments, private equity, commodities, cryptoassets, retirement products (PER), and cash/savings (Livret A, LDDS).",
      fr: "Nous proposons des actions, des ETF, des obligations d'État (français et BTP italiens), des obligations d'entreprises, de l'immobilier, de l'ESG, du private equity, des matières premières, des cryptoactifs, des produits de retraite et de l'épargne.",
      it: "Offriamo azioni, ETF, BTP, obbligazioni corporate, immobiliare, ESG, private equity, materie prime, criptoasset, pensione e risparmio.",
    },
    loans: {
      en: "We offer a full range of loan options: personal loans, mortgages, auto loans, business loans, student loans, debt consolidation loans, home equity loans, bridge loans, equipment financing, revolving credit lines, green energy loans, and medical loans. Visit our Loans page or Dashboard → Loans to apply.",
      fr: "Nous proposons une gamme complète de prêts : personnel, hypothécaire, automobile, professionnel, étudiant, consolidation de dettes, et plus. Visitez notre page Prêts.",
      it: "Offriamo prestiti personali, mutui, auto, business, studenteschi, consolidamento debiti e altro. Visita la pagina Prestiti.",
    },
    password: {
      en: "To reset your password, click 'Sign In' then 'Forgot Password'. Enter your email and you'll receive reset instructions. You can also change it anytime in Dashboard → Settings.",
      fr: "Pour réinitialiser votre mot de passe, cliquez sur 'Connexion' puis 'Mot de passe oublié'. Saisissez votre e-mail pour recevoir les instructions.",
      it: "Per reimpostare la password, clicca 'Accedi' poi 'Password dimenticata'. Inserisci la email per ricevere le istruzioni.",
    },
    kyc: {
      en: "Identity verification (KYC) requires a government ID, selfie/liveness check, and address verification. Go to Dashboard → Settings to complete or check your verification status.",
      fr: "La vérification d'identité (KYC) nécessite une pièce d'identité, un selfie et un justificatif de domicile. Voir Tableau de bord → Paramètres.",
      it: "La verifica d'identità (KYC) richiede documento, selfie e prova di indirizzo. Vedi Dashboard → Impostazioni.",
    },
    fees: {
      en: "Our fees are transparent: management fees range from 0.45% to 1.45% depending on portfolio. No deposit fees for SEPA. See our Fees page for full details.",
      fr: "Nos frais sont transparents : 0,25 % de frais annuels, aucun frais de dépôt, 0,50 € par retrait SEPA. Les frais produits varient.",
      it: "Le nostre commissioni sono trasparenti: 0,25% annuale, nessun costo di deposito, 0,50€ per prelievo SEPA.",
    },
    account_status: {
      en: "New accounts start in 'pending' status while our compliance team verifies your identity and bank account. This typically takes 1-2 business days. You'll receive an email once approved.",
      fr: "Les nouveaux comptes sont en statut 'en attente' pendant la vérification. Comptez 1-2 jours ouvrés. Vous recevrez un e-mail une fois approuvé.",
      it: "I nuovi conti sono 'in sospeso' durante la verifica (1-2 giorni lavorativi). Riceverai un'email all'approvazione.",
    }
  },
  patterns: [
    {keys:['deposit','add money','fund','deposer','déposer','deposito','depositare','einzahl','إيداع','存款','депозит','जमा'], topic:'deposit'},
    {keys:['withdraw','cash out','take money','retirer','retrait','prelev','prelievo','auszahl','سحب','取款','вывод','निकासी'], topic:'withdraw'},
    {keys:['loan','borrow','credit','mortgage','prêt','prestito','mutuo','kredit','قرض','贷款','кредит','क़र्ज़'], topic:'loans'},
    {keys:['invest','product','stock','etf','bond','crypto','portfolio','investir','investire','investier','استثمار','投资','инвест','निवेश'], topic:'investments'},
    {keys:['password','reset','forgot','login','mot de passe','passwort','كلمة المرور','密码','пароль','पासवर्ड'], topic:'password'},
    {keys:['kyc','verify','identity','verification','identité','identità','identität','تحقق','验证','верифика','सत्यापन'], topic:'kyc'},
    {keys:['fee','cost','charge','frais','commission','gebühr','رسوم','费用','комисс','शुल्क'], topic:'fees'},
    {keys:['pending','status','approved','account status','en attente','in attesa','بانتظار','待定','ожида','लंबित'], topic:'account_status'},
  ],
  respond: function(message, lang) {
    lang = lang || getCurrentLang();
    var lower = message.toLowerCase();
    for (var i=0; i<this.patterns.length; i++) {
      var p = this.patterns[i];
      for (var j=0; j<p.keys.length; j++) {
        if (lower.indexOf(p.keys[j]) >= 0) {
          var resp = this.kb[p.topic];
          return {text: resp[lang]||resp.en, topic:p.topic, aiHandled:true};
        }
      }
    }
    return {text:null, topic:'escalate', aiHandled:false};
  },
  escalationMsg: {
    en: "I'd like to connect you with one of our human agents who can help with this specific question. They've been notified and will respond shortly. Is there anything else I can help with in the meantime?",
    fr: "Je vais vous mettre en relation avec l'un de nos conseillers. Il a été notifié et répondra rapidement. Puis-je vous aider sur autre chose en attendant ?",
    it: "Ti metto in contatto con un nostro operatore. È stato notificato e risponderà a breve. Posso aiutarti con altro nel frattempo?",
  }
};

// ===================== MESSAGING =====================
EV.msg = {
  adminSend: function(target, subject, body, opts) {
    opts = opts || {};
    var users = EV.store.get('users', []);
    var msgs = EV.store.get('admin_messages', []);
    var recipients = [];
    if (target==='all') {
      recipients = users;
    } else {
      // target can be a comma-separated list of user IDs
      var ids = target.split(',');
      recipients = users.filter(function(u){return ids.indexOf(u.id)>=0;});
    }
    recipients.forEach(function(user){
      // Personalize body with {name}
      var personalizedBody = body.replace(/{name}/g, user.firstName+' '+user.lastName);
      var personalizedSubject = subject.replace(/{name}/g, user.firstName);
      var msg = {
        id: 'M'+Date.now()+'-'+user.id,
        userId: user.id, userEmail: user.email,
        subject: personalizedSubject, body: personalizedBody,
        time: new Date().toISOString(),
        read: false, direction: 'admin-to-user',
        originalLang: 'en',
        template: opts.template || null,
        isMotivational: opts.isMotivational || false
      };
      msgs.push(msg);
      var umsgs = EV.store.get('user_messages_'+user.id, []);
      umsgs.push(msg);
      EV.store.set('user_messages_'+user.id, umsgs);
      // Send email
      EV.mail.send(user.email, personalizedSubject, personalizedBody,
        {type: opts.isMotivational?'motivational_email':'admin_message', userId:user.id, template:opts.template});
      // Send SMS if opted in
      if (user.smsOptIn && user.phone) {
        EV.mail.sendSMS(user.phone,
          'EuroFiducia: You have a new message — "'+personalizedSubject+'". Check your dashboard or email for details.',
          {type:'message_notification', userId:user.id});
      }
    });
    EV.store.set('admin_messages', msgs);
    // Notify admin of sent message
    EV.store.push('admin_notifications', {
      id: Date.now(), type:'message_sent', time:new Date().toISOString(),
      text: 'Message sent to '+recipients.length+' user(s): "'+subject+'"',
      read:false
    });
    return {ok:true, count: recipients.length};
  },
  userToSupport: function(userId, message) {
    var user = EV.auth.currentUser() || EV.store.get('users',[]).find(function(u){return u.id===userId;});
    var userName = user ? user.firstName+' '+user.lastName : 'Visitor';
    var userLang = user ? user.lang : getCurrentLang();
    var ticket = {
      id: 'T'+Date.now(), userId: userId, userName: userName,
      userEmail: user?user.email:'', userPhone: user?user.phone:'', lang: userLang,
      message: message, time: new Date().toISOString(),
      status: 'open', replies: [],
      aiHandled: false, escalated: false
    };
    var aiResp = EV.ai.respond(message, userLang);
    if (aiResp.aiHandled) {
      ticket.aiHandled = true;
      ticket.replies.push({from:'ai', text: aiResp.text, time: new Date().toISOString()});
      EV.notify.supportMessage(userId, userName, message, true);
    } else {
      ticket.escalated = true;
      ticket.replies.push({from:'ai', text: EV.ai.escalationMsg[userLang]||EV.ai.escalationMsg.en, time: new Date().toISOString()});
      EV.notify.supportMessage(userId, userName, message, false);
    }
    EV.store.push('support_tickets', ticket);
    var uh = EV.store.get('user_support_'+userId, []);
    uh.push(ticket);
    EV.store.set('user_support_'+userId, uh);
    // Email user confirmation that their message was received
    if (user) {
      EV.mail.send(user.email, 'Support Message Received — EuroFiducia',
        'Dear '+user.firstName+',\n\nWe have received your support message:\n\n"'+message+'"\n\n'+(aiResp.aiHandled?'Our AI assistant has provided an initial response. If you need further assistance, our team is ready to help.':'Your question has been escalated to our human support team. They have been notified and will respond shortly.')+'\n\nYou can track this conversation in your dashboard → Support.\n\nThe EuroFiducia Support Team',
        {type:'support_confirmation', userId:user.id});
    }
    return ticket;
  },
  adminReply: function(ticketId, reply) {
    var tickets = EV.store.get('support_tickets', []);
    var idx = tickets.findIndex(function(t){return t.id===ticketId;});
    if (idx>=0) {
      tickets[idx].replies.push({from:'admin', text:reply, time:new Date().toISOString()});
      tickets[idx].status = 'answered';
      EV.store.set('support_tickets', tickets);
      var t = tickets[idx];
      var uh = EV.store.get('user_support_'+t.userId, []);
      var uidx = uh.findIndex(function(x){return x.id===ticketId;});
      if (uidx>=0) { uh[uidx] = t; EV.store.set('user_support_'+t.userId, uh); }
      // Email the user the reply
      var user = EV.store.get('users',[]).find(function(u){return u.id===t.userId;});
      if (user) {
        EV.mail.send(user.email, 'Support Reply — EuroFiducia',
          'Dear '+user.firstName+',\n\nYou have received a reply from our support team regarding your message:\n\n"'+t.message+'"\n\nOur reply:\n"'+reply+'"\n\nYou can continue the conversation in your dashboard → Support.\n\nThe EuroFiducia Support Team',
          {type:'support_reply', userId:user.id});
        if (user.smsOptIn && user.phone) {
          EV.mail.sendSMS(user.phone, 'EuroFiducia: Support team has replied to your message. Check your dashboard or email.', {type:'support_reply', userId:user.id});
        }
      }
      return {ok:true};
    }
    return {ok:false};
  }
};

// ===================== TRANSACTIONS =====================
EV.tx = {
  generate: function(userId, opts) {
    var types = ['deposit','withdrawal','purchase','sale','dividend','interest','fee','loan_disbursement','loan_repayment','portfolio_investment','portfolio_rebalance'];
    var type = opts.type || types[Math.floor(Math.random()*types.length)];
    var amount = opts.amount || (Math.random()*5000+100);
    var date = opts.date || this.randomDate();
    var ref = 'EV-'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,6).toUpperCase();
    var _u = EV.store.get('users', []).find(function(x){return x.id===userId;}) || {};
    var tx = {
      id: ref, userId: userId, type: type,
      amount: parseFloat(amount.toFixed(2)), currency:'EUR',
      date: date, status: opts.status || 'completed',
      method: opts.method || (type==='deposit'?'SEPA Transfer':type==='withdrawal'?'Bank Transfer':type.indexOf('loan')>=0?'Bank Transfer':'Platform'),
      description: opts.description || this.descForType(type),
      reference: ref,
      accountNumber: _u.accountNumber || '',
      memberId: _u.memberId || '',
      receiptData: this.generateReceiptData(type, amount, date, ref, _u)
    };
    var txs = EV.store.get('user_tx_'+userId, []);
    txs.push(tx);
    txs.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    EV.store.set('user_tx_'+userId, txs);
    EV.store.push('all_transactions', tx);
    return tx;
  },
  generateBulk: function(userId, count, opts) {
    var results = [];
    for (var i=0; i<count; i++) {
      var o = Object.assign({}, opts);
      if (!opts.date) o.date = this.randomDate();
      if (!opts.amount) o.amount = Math.random()*5000+50;
      results.push(this.generate(userId, o));
    }
    return results;
  },
  randomDate: function() {
    var now = new Date();
    var past = new Date(now.getFullYear()-3, 0, 1);
    var diff = now - past;
    var rand = Math.random()*diff;
    return new Date(past.getTime()+rand).toISOString();
  },
  descForType: function(type) {
    var descs = {
      deposit:['SEPA Credit Transfer In','Bank Deposit','Funds Received via Card','Open Banking Deposit','Wire Transfer Received'],
      withdrawal:['Withdrawal to Bank Account','SEPA Transfer Out','Funds Withdrawn','Bank Transfer Out'],
      purchase: EV.catalog.products.map(function(p){return 'Purchase: '+p;}),
      sale: EV.catalog.products.map(function(p){return 'Sale: '+p;}),
      dividend:['Dividend Payment: European Equities','Dividend Payment: Real Estate Fund','Quarterly Dividend Distribution','Dividend: European Dividend Fund','Dividend: CAC 40 Companies','Dividend: FTSE MIB Companies'],
      interest:['Interest Payment: Fixed Income','Bond Coupon Payment: BTP Italia','Bond Coupon: French OAT','Savings Interest Credit: Livret A','Interest: LDDS Savings','Coupon: Green Bond Fund'],
      fee:['Platform Management Fee','Transaction Fee','Withdrawal Processing Fee','Annual Custody Fee','Portfolio Rebalancing Fee'],
      loan_disbursement: EV.catalog.loanTypes.map(function(l){return 'Loan Disbursement: '+l;}),
      loan_repayment: EV.catalog.loanTypes.map(function(l){return 'Loan Repayment: '+l;}),
      portfolio_investment: EV.catalog.portfolios.map(function(p){return 'Investment: '+p;}),
      portfolio_rebalance: EV.catalog.portfolios.map(function(p){return 'Rebalance: '+p;})
    };
    var arr = descs[type]||['Platform Transaction'];
    return arr[Math.floor(Math.random()*arr.length)];
  },
  generateReceiptData: function(type, amount, date, ref, user) {
    user = user || {};
    return {
      institution: 'EUROFIDUCIA INVESTMENT PLATFORM',
      institutionSub: 'Regulated European Investment Services',
      reference: ref,
      type: type.charAt(0).toUpperCase()+type.slice(1).replace(/_/g,' '),
      amount: parseFloat(amount.toFixed(2)),
      currency: 'EUR',
      date: date,
      status: 'COMPLETED',
      accountHolder: '',
      accountNumber: user.accountNumber || ('EV-'+new Date(date).getFullYear()+'-'+Math.floor(Math.random()*90000000+10000000)),
      memberId: user.memberId || '',
      iban: user.iban || this.genIBAN(),
      bic: user.bic || ('EURVFRPP'+Math.floor(Math.random()*900+100)),
      processingCode: 'PC'+Math.random().toString(36).slice(2,10).toUpperCase(),
      authCode: Math.floor(Math.random()*900000+100000).toString(),
      settlementDate: date,
      timestamp: new Date(date).toLocaleString('en-GB'),
    };
  },
  genIBAN: function() {
    var cc = ['FR','IT','DE','ES','PT'];
    var c = cc[Math.floor(Math.random()*cc.length)];
    var num = '';
    for (var i=0;i<22;i++) num+=Math.floor(Math.random()*10);
    return c+num;
  }
};

// ===================== CRYPTOCURRENCY WALLETS =====================
// Admin-configurable deposit wallets. Stored in EV.store under 'crypto_wallets'
// so they persist across devices/redeploys via the sync layer.
// Users see these whenever they choose Cryptocurrency as a deposit method.
EV.crypto = {
  defaults: [
    { id: 'W_BTC', coin: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin (BTC)', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', note: 'Send BTC to this address. 1 confirmation required.' },
    { id: 'W_ETH', coin: 'Ethereum', symbol: 'ETH', network: 'ERC-20', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', note: 'Send ETH to this address on the Ethereum mainnet.' },
    { id: 'W_USDT', coin: 'Tether', symbol: 'USDT', network: 'ERC-20 / TRC-20', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', note: 'Send USDT (ERC-20) to this address. TRC-20 also accepted.' }
  ],
  getAll: function() {
    var stored = EV.store.get('crypto_wallets', null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      // Seed defaults on first access
      EV.store.set('crypto_wallets', this.defaults);
      return this.defaults;
    }
    return stored;
  },
  save: function(wallets) {
    EV.store.set('crypto_wallets', wallets);
    return wallets;
  },
  add: function(wallet) {
    var wallets = this.getAll();
    if (!wallet.id) wallet.id = 'W_' + Date.now().toString(36);
    wallets.push(wallet);
    this.save(wallets);
    return wallet;
  },
  update: function(id, updates) {
    var wallets = this.getAll();
    var idx = wallets.findIndex(function(w){return w.id === id;});
    if (idx >= 0) { wallets[idx] = Object.assign(wallets[idx], updates); this.save(wallets); return wallets[idx]; }
    return null;
  },
  remove: function(id) {
    var wallets = this.getAll().filter(function(w){return w.id !== id;});
    this.save(wallets);
    return wallets;
  }
};

// ===================== COUNTRY-SPECIFIC DEPOSIT METHODS =====================
// Each supported country gets its own visible set of deposit methods shown on
// the user's Deposit page. Methods include cryptocurrency (always available,
// gas fee covered by EuroFiducia), SEPA / local bank transfer with country-specific
// beneficiary instructions, card payment, open banking / instant payment rails,
// and (where relevant) local mobile/retail cash options. Admin can edit the bank
// beneficiary details from the dashboard and the edits persist via EV.store.
EV.depositMethods = {
  // Default bank beneficiary + per-country local payment details. Editable.
  _defaultsBank: {
    beneficiary: 'EUROFIDUCIA SAS',
    bankName: 'BNP Paribas \u2014 EuroFiducia Client Account',
    iban: 'FR76 3000 4028 3700 0123 4567 890',
    bic: 'BNPAFRPP',
    referencePrefix: 'EV-DEP'
  },
  // Helper: get the (editable) bank beneficiary block.
  getBank: function() {
    return EV.store.get('deposit_bank_details', null) || this._defaultsBank;
  },
  saveBank: function(bank) {
    EV.store.set('deposit_bank_details', bank);
    return bank;
  },
  resetBank: function() {
    EV.store.set('deposit_bank_details', null);
    return this._defaultsBank;
  },
  // Master method catalog. Each entry: {id,icon,label,desc,fields,note,kind}
  // kind: 'crypto' | 'bank' | 'card' | 'openbanking' | 'local'
  _methodCatalog: {
    crypto: {
      id:'crypto', icon:'\ud83d\udcb0', label:'Cryptocurrency', kind:'crypto',
      desc:'Instant funding \u2014 confirmed in minutes. The GAS FEE IS ON US. No bank verification needed. Recommended for your first deposit.',
      note:'Send the matching coin to the address shown. We cover all network fees.'
    },
    sepa: {
      id:'sepa', icon:'\ud83c\udfeb', label:'SEPA Bank Transfer', kind:'bank',
      desc:'Standard SEPA credit transfer in euros. Funds arrive within 1\u20132 business days. Free for the user; EuroFiducia covers intermediary charges.',
      note:'Use your unique reference so we can match your deposit automatically.'
    },
    card: {
      id:'card', icon:'\ud83d\udcb3', label:'Card Payment', kind:'card',
      desc:'Instant funding with Visa or Mastercard. Funds credited within minutes.',
      note:'A 3-D Secure verification may be required by your bank.'
    },
    openbanking: {
      id:'openbanking', icon:'\ud83d\udd17', label:'Open Banking / Instant', kind:'openbanking',
      desc:'Pay directly from your bank app via open banking. Instant settlement, no card details shared.',
      note:'Available for most European banks.'
    }
  },
  // Per-country local payment rails (in addition to crypto + SEPA + card).
  _countryLocal: {
    FR: [
      { id:'fr_inst', icon:'\u26a1', label:'Instant Payment (SEPA Inst)', kind:'openbanking',
        desc:'French SEPA Instant transfer \u2014 funds credited in under 10 seconds, 24/7.',
        note:'Supported by Cr\u00e9dit Agricole, BNP Paribas, Soci\u00e9t\u00e9 G\u00e9n\u00e9rale, La Banque Postale and others.' },
      { id:'fr_livret', icon:'\ud83d\udcb5', label:'Livret / LDDS Transfer', kind:'bank',
        desc:'Transfer from your Livret A or LDDS savings account to your EuroFiducia account.',
        note:'Regulated savings withdrawals may take 1\u20132 business days.' }
    ],
    IT: [
      { id:'it_bonifico', icon:'\ud83c\udfeb', label:'Bonifico Immediato (SCT Inst)', kind:'openbanking',
        desc:'Italian instant bank transfer (SCT Inst) \u2014 funds credited within seconds.',
        note:'Supported by UniCredit, Intesa Sanpaolo, BancPosta and others.' },
      { id:'it_postagiro', icon:'\ud83d\udcc7', label:'Bollettino / Postagiro', kind:'local',
        desc:'Pay via Poste Italiane (Postagiro or postal bulletin). Available nationwide.',
        note:'Allow 1\u20133 business days for postal settlement.' }
    ],
    DE: [
      { id:'de_ueberweisung', icon:'\u26a1', label:'Echtzeit\u00fcberweisung (SCT Inst)', kind:'openbanking',
        desc:'German real-time instant transfer \u2014 funds credited within seconds.',
        note:'Supported by Sparkassen, Volksbanken, Deutsche Bank, Commerzbank and others.' },
      { id:'de_giropay', icon:'\ud83d\udd17', label:'giropay', kind:'openbanking',
        desc:'Pay directly from your German online banking via giropay. Instant.',
        note:'No card required \u2014 authorise in your banking app.' }
    ],
    ES: [
      { id:'es_bizum', icon:'\ud83d\udcf1', label:'Bizum', kind:'local',
        desc:'Instant P2P payment via Bizum from your Spanish bank app.',
        note:'Bizum transfers are instant and free for the user.' },
      { id:'es_inst', icon:'\u26a1', label:'Transferencia Instant\u00e1nea (SCT Inst)', kind:'openbanking',
        desc:'Spanish instant SEPA transfer \u2014 funds credited within seconds.',
        note:'Supported by BBVA, Santander, CaixaBank, Sabadell and others.' }
    ],
    PT: [
      { id:'pt_mb', icon:'\ud83d\udcb3', label:'MB WAY', kind:'local',
        desc:'Instant payment via MB WAY from your Portuguese bank app or card.',
        note:'MB WAY transfers are instant and widely available in Portugal.' },
      { id:'pt_inst', icon:'\u26a1', label:'Transfer\u00eancia Instant\u00e2nea (SCT Inst)', kind:'openbanking',
        desc:'Portuguese instant SEPA transfer \u2014 funds credited within seconds.',
        note:'Supported by Novobanco, BCP, BPI, Caixa Geral and others.' }
    ],
    BE: [
      { id:'be_inst', icon:'\u26a1', label:'Instant Bank Transfer (SCT Inst)', kind:'openbanking',
        desc:'Belgian instant SEPA transfer \u2014 funds credited within seconds.',
        note:'Supported by KBC, Belfius, ING Belgium, BNP Paribas Fortis and others.' }
    ],
    NL: [
      { id:'nl_ideal', icon:'\ud83d\udd17', label:'iDEAL', kind:'openbanking',
        desc:'Pay instantly via iDEAL from your Dutch bank. The most popular online payment method in the Netherlands.',
        note:'Supported by ABN AMRO, ING, Rabobank, SNS and others. Instant.' }
    ],
    other: [
      { id:'intl_swift', icon:'\ud83c\udf10', label:'International Wire (SWIFT)', kind:'bank',
        desc:'International wire transfer in EUR or your local currency.',
        note:'SWIFT transfers may take 2\u20135 business days. EuroFiducia covers receiving fees.' }
    ]
  },
  // Build the full list of deposit methods for a given country code.
  // Order: crypto first (recommended), then SEPA, then country-local rails,
  // then card and open banking.
  forCountry: function(country) {
    country = country || 'other';
    var bank = this.getBank();
    var local = this._countryLocal[country] || this._countryLocal['other'];
    var methods = [];
    // Crypto first
    methods.push(this._enrich(this._methodCatalog.crypto, bank));
    // SEPA (bank) \u2014 only meaningful for SEPA countries
    if (country !== 'other') {
      methods.push(this._enrich(this._methodCatalog.sepa, bank));
    }
    // Country-local rails
    local.forEach(function(m){ methods.push(this._enrich(m, bank)); }, this);
    // Card + open banking
    methods.push(this._enrich(this._methodCatalog.card, bank));
    methods.push(this._enrich(this._methodCatalog.openbanking, bank));
    // De-duplicate by id
    var seen = {}; var out = [];
    methods.forEach(function(m){ if(!seen[m.id]){ seen[m.id]=1; out.push(m); } });
    return out;
  },
  // Attach bank beneficiary details (iban/bic/beneficiary/reference) to a method.
  _enrich: function(method, bank) {
    var m = Object.assign({}, method);
    if (m.kind === 'bank' || m.kind === 'openbanking' || m.kind === 'local') {
      m.beneficiary = bank.beneficiary;
      m.bankName = bank.bankName;
      m.iban = bank.iban;
      m.bic = bank.bic;
      m.reference = bank.referencePrefix + '-{accountNumber}';
    }
    return m;
  }
};

// ===================== INVESTMENT PLANS (TERM-BASED ROI) =====================
// Term-based investment plans. Users pick a plan, enter an amount, and the
// platform creates an investment with a maturity date and projected ROI.
// Fast plans (24h / 48h) start from a minimum of $200. Longer plans offer
// higher ROI in exchange for a longer lock-up. Admin can edit ROI/min amounts
// and the edits persist via EV.store under 'edited_invest_plans'.
// roiPct is the RETURN (profit) as a percentage of principal for the full term.
EV._investPlansDefaults = [
  { id:'fast24',  name:'24-Hour Fast Plan',   icon:'\u26a1',  termHours:24,    roiPct:15,   minAmount:200,  category:'fast',     badge:'FAST',  desc:'Lightning-fast 24-hour plan. Principal + 15% ROI credited at maturity. Minimum $200.' },
  { id:'fast48',  name:'48-Hour Fast Plan',   icon:'\u23f1',  termHours:48,    roiPct:25,   minAmount:200,  category:'fast',     badge:'FAST',  desc:'48-hour fast plan. Principal + 25% ROI credited at maturity. Minimum $200.' },
  { id:'weekly',  name:'Weekly Plan',         icon:'\ud83d\uddd3', termHours:168,    roiPct:45,   minAmount:100,  category:'short',    badge:'7 DAYS',desc:'7-day plan. Principal + 45% ROI at maturity. Reinvest weekly to compound.' },
  { id:'monthly', name:'Monthly Plan',        icon:'\ud83d\udcc5', termHours:720,    roiPct:90,   minAmount:100,  category:'medium',   badge:'30 DAYS',desc:'30-day plan. Principal + 90% ROI at maturity. A balance of speed and growth.' },
  { id:'quarter', name:'Quarterly Plan',      icon:'\ud83c\udfa9', termHours:2160,   roiPct:180,  minAmount:100,  category:'medium',   badge:'90 DAYS',desc:'90-day plan. Principal + 180% ROI at maturity. Enhanced returns for patience.' },
  { id:'yearly',  name:'Yearly Plan',         icon:'\ud83c\udf89', termHours:8760,   roiPct:420,  minAmount:100,  category:'long',     badge:'365 DAYS',desc:'365-day plan. Our highest ROI \u2014 principal + 420% at maturity. For long-term wealth.' }
];

EV.investPlans = {
  // Return effective list (edited overrides merged over defaults).
  getAll: function() {
    var edited = EV.store.get('edited_invest_plans', {});
    return EV._investPlansDefaults.map(function(p){
      return edited[p.id] ? Object.assign({}, p, edited[p.id]) : p;
    });
  },
  getOne: function(id) {
    return this.getAll().find(function(p){ return p.id === id; }) || null;
  },
  edit: function(id, changes) {
    var edited = EV.store.get('edited_invest_plans', {});
    edited[id] = Object.assign({}, edited[id] || {}, changes);
    EV.store.set('edited_invest_plans', edited);
    return this.getOne(id);
  },
  reset: function(id) {
    var edited = EV.store.get('edited_invest_plans', {});
    delete edited[id];
    EV.store.set('edited_invest_plans', edited);
    return this.getOne(id);
  },
  resetAll: function() {
    EV.store.set('edited_invest_plans', {});
    return this.getAll();
  },
  // Validate an investment amount against a plan's minimum.
  validateAmount: function(plan, amount) {
    var amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return { ok:false, msg:'Please enter a valid amount.' };
    if (amt < plan.minAmount) {
      return { ok:false, msg:'The minimum for the ' + plan.name + ' is $' + plan.minAmount + '. Please enter at least $' + plan.minAmount + '.' };
    }
    return { ok:true, amount: amt };
  },
  // Create an investment record + maturity schedule for a user.
  // Returns the created investment object.
  create: function(userId, planId, amount, opts) {
    opts = opts || {};
    var plan = this.getOne(planId);
    if (!plan) return null;
    var v = this.validateAmount(plan, amount);
    if (!v.ok) return { error: v.msg };
    var amt = v.amount;
    var roi = amt * (plan.roiPct / 100);
    var now = new Date();
    var maturity = new Date(now.getTime() + plan.termHours * 3600 * 1000);
    var inv = {
      id: 'INV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase(),
      userId: userId,
      planId: plan.id,
      planName: plan.name,
      category: plan.category,
      principal: parseFloat(amt.toFixed(2)),
      roiPct: plan.roiPct,
      roiAmount: parseFloat(roi.toFixed(2)),
      totalReturn: parseFloat((amt + roi).toFixed(2)),
      startDate: now.toISOString(),
      maturityDate: maturity.toISOString(),
      status: 'active',
      source: opts.source || 'dashboard'
    };
    var list = EV.store.get('user_investments_' + userId, []);
    list.push(inv);
    EV.store.set('user_investments_' + userId, list);
    // Record a purchase-type transaction so it shows in Transactions + receipts.
    EV.tx.generate(userId, {
      type: 'purchase',
      amount: amt,
      method: 'Platform',
      date: now.toISOString(),
      description: 'Investment: ' + plan.name
    });
    return inv;
  },
  // List a user's investments (newest first).
  listForUser: function(userId) {
    var list = EV.store.get('user_investments_' + userId, []);
    return list.slice().sort(function(a,b){ return new Date(b.startDate) - new Date(a.startDate); });
  },
  // Compute progress percentage for an active investment.
  progress: function(inv) {
    var now = Date.now();
    var start = new Date(inv.startDate).getTime();
    var end = new Date(inv.maturityDate).getTime();
    if (now >= end) return 100;
    return Math.max(0, Math.min(100, Math.round((now - start) / (end - start) * 100)));
  }
};

// ===================== UTILITIES =====================
EV.util = {
  formatDate: function(iso) {
    return new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  },
  formatDateTime: function(iso) {
    return new Date(iso).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  },
  formatMoney: function(amt) {
    return '€'+Number(amt).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
  },
  timeAgo: function(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    var mins = Math.floor(diff/60000);
    if (mins<1) return 'just now';
    if (mins<60) return mins+'m ago';
    var hrs = Math.floor(mins/60);
    if (hrs<24) return hrs+'h ago';
    var days = Math.floor(hrs/24);
    return days+'d ago';
  },
  genId: function(prefix) { return (prefix||'ID')+Date.now().toString(36)+Math.random().toString(36).slice(2,5); },
  // Generate a unique EuroFiducia account number: EV-YYYY-XXXXXXXX (8 digits)
  genAccountNumber: function() {
    var year = new Date().getFullYear();
    var num = '';
    for (var i=0;i<8;i++) num += Math.floor(Math.random()*10);
    return 'EV-'+year+'-'+num;
  },
  // Generate a shorter Client/Member ID: EV-CL-XXXXX (5 digits)
  genMemberId: function() {
    var num = Math.floor(Math.random()*90000+10000);
    return 'EV-CL-'+num;
  },
  // Generate a unique referral code: EV-REF-XXXXXX (6 alphanumeric)
  genReferralCode: function() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i=0;i<6;i++) code += chars[Math.floor(Math.random()*chars.length)];
    return 'EV-'+code;
  }
};

// ===================== INIT =====================
EV.init = function() {
  EV.notify.trackVisit();
  if (typeof applyTranslations === 'function') applyTranslations();
  EV.buildLangDropdown();
};

EV.buildLangDropdown = function() {
  var btns = document.querySelectorAll('.lang-btn');
  btns.forEach(function(btn){
    btn.onclick = function(e) {
      e.stopPropagation();
      var dd = btn.parentElement.querySelector('.lang-dropdown');
      if (dd) dd.classList.toggle('open');
    };
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.lang-dropdown.open').forEach(function(d){d.classList.remove('open');});
  });
  document.querySelectorAll('.lang-dropdown').forEach(function(dd){
    if (dd.children.length === 0) {
      LANGS.forEach(function(l){
        var opt = document.createElement('div');
        opt.className = 'lang-option';
        opt.innerHTML = '<span>'+l.flag+'</span><span>'+l.name+'</span>';
        opt.onclick = function(e) {
          e.stopPropagation();
          setCurrentLang(l.code);
          dd.classList.remove('open');
          applyTranslations(l.code);
        };
        dd.appendChild(opt);
      });
    }
  });
};

if (document.readyState !== 'loading') EV.init();
else document.addEventListener('DOMContentLoaded', EV.init);
