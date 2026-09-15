#!/usr/bin/env python3
# Splice new templates + manager into app.js after the existing emailTemplates array.
import io

APP = '/workspace/eurofiducia/assets/js/app.js'

with io.open(APP, 'r', encoding='utf-8') as f:
    src = f.read()

# The existing array closes with the 'verify' template entry + '];'.
# Find the marker end of the verify template block closing '];\n'
marker_end = "The EuroFiducia Compliance Team'\n  }\n];\n"
idx = src.find(marker_end)
if idx == -1:
    raise SystemExit("marker not found")

new_block = r'''The EuroFiducia Compliance Team'
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
'''

src = src.replace(marker_end, new_block, 1)

with io.open(APP, 'w', encoding='utf-8') as f:
    f.write(src)

print("OK - inserted new templates + manager")
print("New length:", len(src))
