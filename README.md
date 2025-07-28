# 📊 Dynamic Portfolio Backend

A Node.js + Express backend service to power the Dynamic Portfolio Dashboard. It fetches real-time stock data from Yahoo Finance and Google Finance, calculates investment metrics, and serves clean API responses for frontend use.

---

## 🔧 Tech Stack

- **Node.js**
- **Express.js**
- **Yahoo Finance (npm yahoo-finance2)**
- **Google Finance Scraping (axios + cheerio)**
- **NodeCache** for in-memory caching
- **p-limit + p-throttle** for throttled parallel requests

---

## 🚀 Features

- Fetches stock data from both Yahoo & Google
- Calculates CMP, P/E, EPS, investment value, gain/loss
- Handles NSE & BSE symbols intelligently
- Caches results for faster repeat access
- Exposes clean REST API for frontend

---

## 📁 Project Structure
dynamic-portfolio-backend/
│
├── controllers/ # Business logic
│ └── portfolio.js
│
├── services/ # Yahoo/Google scraping logic
│ ├── googleService.js
│ └── yahooService.js
│
├── utils/ # Helper functions
│ └── calculate.js
│
├── cache/ # NodeCache setup
│ └── cache.js
│
├── routes/ # Express routes
│ └── portfolioRoutes.js
│
├── index.js # App entry point
└── package.json

 ⚙️ Setup Instructions (Local)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/dynamic-portfolio-backend.git
cd dynamic-portfolio-backend

3. Run the server
bash
Copy
Edit
npm run dev
Visit: http://localhost:8000/api/portfolio

