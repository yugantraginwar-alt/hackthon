"""
Synthetic and curated dataset of Indian UPI and banking SMS/WhatsApp messages.
Clearly labeled as synthetic/demo dataset for hackathon prototype.
"""

DATASET = [
    # SAFE (Normal transactions, OTP requests initiated by user, salary credit, grocery bill, utility payment)
    {"text": "Dear Customer, your A/c ending 4589 is credited with Rs 45,000.00 on 01-Sep-2026 by NEFT. Bal: Rs 52,140.75 - State Bank of India", "label": "SAFE"},
    {"text": "Paid Rs 120.00 to Chai Point via PhonePe UPI. UPI Ref: 423985729104. Money debited from SBI A/c XX8921.", "label": "SAFE"},
    {"text": "Your electricity bill of Rs 1,450 for consumer no. 982341 is due on 15-Sep. Pay online at billdesk.com/bescom or via official app.", "label": "SAFE"},
    {"text": "Sent Rs 500 to Rahul Sharma (rahul@okaxis) successfully. Updated balance in HDFC Bank A/c: Rs 14,200.50.", "label": "SAFE"},
    {"text": "Your order on Amazon has been shipped. Track your delivery at https://amazon.in/orders/track. Thank you for shopping.", "label": "SAFE"},
    {"text": "Dear SBI User, your OTP for login to SBI YONO is 492810. Valid for 5 mins. Do not share OTP with anyone.", "label": "SAFE"},
    {"text": "Hi Mom, I just reached home safely. Will call you in a bit.", "label": "SAFE"},
    {"text": "Swiggy order #92834 has been delivered. Enjoy your meal! Rate your delivery partner on the Swiggy app.", "label": "SAFE"},
    {"text": "Your monthly SIP of Rs 5,000 in HDFC Mutual Fund has been executed successfully. Folio no: 8492048.", "label": "SAFE"},
    {"text": "Recharge of Rs 299 on your Jio number 9876543210 was successful. Validity: 28 days.", "label": "SAFE"},

    # FAKE_KYC
    {"text": "Dear Customer, Your SBI YONO Account KYC has expired. Your UPI service will be blocked today. Update PAN immediately at https://sbi-kyc-update.online", "label": "FAKE_KYC"},
    {"text": "URGENT: Your HDFC Bank net banking KYC documents are unverified. Complete e-KYC within 24 hours to avoid permanent deactivation: http://hdfc-verify-kyc.top", "label": "FAKE_KYC"},
    {"text": "Dear user your Paytm KYC is pending and wallet will be suspended. Please verify your Aadhaar and PAN immediately through this link: bit.ly/paytm-kyc-fix", "label": "FAKE_KYC"},
    {"text": "Your ICICI Bank account is on hold due to missing KYC documents. Click here to verify your account credentials immediately or visit nearest branch: http://icici-portal-kyc.in", "label": "FAKE_KYC"},
    {"text": "Attention Customer: Your Axis UPI ID will be deactivated by midnight due to pending biometric KYC. Click to re-verify now: http://axis-kyc-renewal.site", "label": "FAKE_KYC"},

    # REFUND_SCAM
    {"text": "Congratulations! You have received a cashback refund of Rs 3,500 on Google Pay. Click here to accept your refund directly into your bank account: https://gpay-refunds.xyz", "label": "REFUND_SCAM"},
    {"text": "PhonePe Reward: You have won Rs 4,999 scratch card bonus! Click here to claim your cashback to any UPI linked account immediately: http://phonepe-rewards.live", "label": "REFUND_SCAM"},
    {"text": "Your Flipkart refund of Rs 2,499 for cancelled order has been processed. Scan the QR code or approve the collect request on Paytm to receive payment.", "label": "REFUND_SCAM"},
    {"text": "IRCTC Ticket cancellation refund of Rs 1,840 is pending approval. Enter your UPI PIN on the attached link to accept your refund money.", "label": "REFUND_SCAM"},
    {"text": "Paytm Cashback Alert: Rs 1,999 has been credited to your rewards pool. Tap here to transfer instantly to your bank: http://paytm-cashback-instant.net", "label": "REFUND_SCAM"},

    # PHISHING
    {"text": "Security Alert: Suspicious login detected from IP 192.168.1.1 on your bank account. If not you, secure your account immediately at http://secure-bank-login.com", "label": "PHISHING"},
    {"text": "Dear user, income tax refund of Rs 14,800 has been approved for AY 2025-26. Submit your bank details and netbanking password to claim: http://incometax-efiling-refund.vip", "label": "PHISHING"},
    {"text": "Your Netflix membership renewal failed. Update your card number, CVV and netbanking details to continue streaming: http://netflix-billing-update.cc", "label": "PHISHING"},
    {"text": "Dear User, Rs 25,000 lottery credited to your mobile number. Click the official link to submit your personal details and bank account: http://lucky-draw-winner.biz", "label": "PHISHING"},
    {"text": "Speed challan unpaid warning from Parivahan Cyber Cell: Pay fine of Rs 1,000 immediately or vehicle RC will be blacklisted: http://echallan-parivahan-pay.me", "label": "PHISHING"},

    # IMPERSONATION
    {"text": "I am Inspector Sharma from Delhi Cyber Crime Cell. A case has been registered against your mobile number. Contact immediately on 9811223344 or pay fine to avoid arrest.", "label": "IMPERSONATION"},
    {"text": "RBI Notification: As per Reserve Bank directive, all dormant UPI handles must pay clearance fee of Rs 500. Transfer to official UPI: rbi.regulatory@gov.scam", "label": "IMPERSONATION"},
    {"text": "Hello, this is SBI Fraud Prevention Department Manager. We noticed unusual transaction of Rs 85,000. Provide your account verification code to stop this debit.", "label": "IMPERSONATION"},
    {"text": "Customs officer Mumbai Airport: A parcel in your name from UK containing gold and foreign currency is detained. Transfer clearance duty of Rs 35,000 to release.", "label": "IMPERSONATION"},
    {"text": "Electricity Department Officer: Power supply to your premises will be disconnected at 9 PM tonight due to unpaid bill. Call officer immediately at 9123456789.", "label": "IMPERSONATION"},

    # QR_SCAM
    {"text": "Please scan this QR code on your Google Pay or PhonePe to receive Rs 2,500 advance payment for the OLX item.", "label": "QR_SCAM"},
    {"text": "To claim your lucky scratch card reward of Rs 5,000, scan this UPI QR code in any UPI payment app and enter your PIN to receive money.", "label": "QR_SCAM"},
    {"text": "Army officer buyer on OLX: I am sending this QR code. Once you scan it and enter your UPI PIN, Rs 15,000 will be instantly credited to your account.", "label": "QR_SCAM"},
    {"text": "Refund assistance: Scan the merchant QR sent on WhatsApp to reverse the failed transaction back to your savings account.", "label": "QR_SCAM"},
    {"text": "Scan QR to receive Rs 1,000 government subsidy directly to your Aadhaar linked bank account.", "label": "QR_SCAM"},

    # FAKE_SUPPORT
    {"text": "Facing issues with Google Pay or PhonePe transaction? Contact 24x7 Customer Support toll-free helpline number 9876501234 for instant resolution.", "label": "FAKE_SUPPORT"},
    {"text": "Paytm helpline: Your recent failed payment of Rs 4,000 is stuck. Connect with our senior customer care executive at 8877665544 for immediate refund.", "label": "FAKE_SUPPORT"},
    {"text": "Amazon Delivery support: Your address is incomplete. Contact customer care desk on WhatsApp at 919876543210 to reschedule delivery.", "label": "FAKE_SUPPORT"},
    {"text": "SBI Customer Care official helpline: Call +91-7654321098 immediately to unblock your netbanking or reset your transaction password.", "label": "FAKE_SUPPORT"},
    {"text": "Zomato refund support executive available on WhatsApp. Message us on 9812345678 with your order ID to claim instant refund.", "label": "FAKE_SUPPORT"},

    # PAYMENT_REQUEST
    {"text": "Payment Request: Ramesh Verma has requested Rs 3,500 from you on Google Pay for 'Room Rent'. Click to approve payment.", "label": "PAYMENT_REQUEST"},
    {"text": "Dear customer, pay Rs 99 courier handling charge immediately via UPI to receive your pending parcel at your doorstep.", "label": "PAYMENT_REQUEST"},
    {"text": "Urgent transfer: Please send Rs 10,000 to hospital emergency UPI ID medical.emergency@okhdfcbank right now, friend in ICU.", "label": "PAYMENT_REQUEST"},
    {"text": "Job recruitment fee: Pay Rs 1,500 registration charge via UPI to confirm your interview slot at TCS / Infosys.", "label": "PAYMENT_REQUEST"},
    {"text": "Telegram work from home: Earn Rs 3000 daily by rating YouTube videos. Pay initial security deposit of Rs 2,000 to activate account.", "label": "PAYMENT_REQUEST"},

    # OTP_SCAM
    {"text": "Bank Alert: Enter your 6-digit OTP here to verify your identity and cancel unauthorized debit of Rs 49,999: http://sbi-otp-auth.com", "label": "OTP_SCAM"},
    {"text": "PhonePe customer desk: We are sending an OTP to reverse your failed transaction. Share the 6 digit verification code with the executive on call.", "label": "OTP_SCAM"},
    {"text": "To receive your Rs 5,000 lottery cash prize, enter your UPI PIN and OTP in the confirmation form.", "label": "OTP_SCAM"},
    {"text": "Aadhaar e-KYC alert: Please forward the 6-digit Aadhaar OTP received on your mobile to this WhatsApp number to complete verification.", "label": "OTP_SCAM"},
    {"text": "Never share your UPI PIN or OTP with anyone. Bank executives will never ask for PIN. (If received asking to input pin to receive money, do not proceed)", "label": "OTP_SCAM"},

    # OTHER
    {"text": "Click here to download the latest gaming app and get 100 free spins today!", "label": "OTHER"},
    {"text": "Subscribe to our daily news briefing for only Rs 10 per month. Cancel anytime.", "label": "OTHER"},
    {"text": "Reminder: Your dental appointment is scheduled for tomorrow at 4:30 PM with Dr. Mehta.", "label": "OTHER"},
    {"text": "Flash sale ending in 2 hours! 50% discount on all men's footwear at official Myntra app.", "label": "OTHER"},
    {"text": "Weather forecast for Mumbai: Light to moderate rain expected today. High 31C, Low 26C.", "label": "OTHER"},
]
