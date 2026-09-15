# EuroFiducia Feature Enhancement TODO

## Current Session Tasks

### Task 1: Remove admin login details from login page
- [x] Remove the "Demo Login" section from login.html that shows admin credentials (admin@eurofiducia.eu / admin123)

### Task 2: $200 sign-up bonus after account approval
- [x] Generate referral codes (genReferralCode utility added)
- [x] Add $200 bonus transaction when admin approves account (in EV.auth.approveAccount)
- [x] Update approval email to mention the $200 bonus
- [x] Update approval SMS to mention the $200 bonus
- [x] Add $200 bonus messaging to landing page (index.html)

### Task 3: $50 per referral system
- [x] Store referralCode + referredBy on user object in EV.auth.register
- [x] Add referral code input field to registration form (register.html)
- [x] Auto-fill referral code from URL param (?ref=EV-XXXXXX)
- [x] When a new user with referredBy code is approved, credit $50 to the referrer
- [x] Send email + SMS notification to referrer when referral bonus is credited
- [x] Add referral info to user dashboard (show referral code + count + earnings + link)
- [x] Add $50 referral messaging to landing page (index.html)

### Deploy & Push
- [x] Redeploy to Railway with all changes
- [x] Push to GitHub with new token
- [x] Verify all changes live on production site
