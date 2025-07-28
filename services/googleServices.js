import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import pLimit from 'p-limit';
import pThrottle from 'p-throttle';
import cache from '../cache/cache.js';

console.log('pThrottle:', pThrottle, 'typeof:', typeof pThrottle);
console.log('Args:', 5, 1000);
const limit = pLimit(3);

// 👇 throttle: max 5 calls per second
const throttle = pThrottle({
  limit: 5,
  interval: 1000
});
const sleep =(ms)=>new Promise(resolve=>setTimeout(resolve,ms))



const fetchData = async (url, retries = 3, delay = 1000) => {
    const userAgent = new UserAgent().toString();

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await axios.get(url, {
                headers: { 'User-Agent': userAgent }
            });
            return res;
        } catch (err) {
        
            console.error(`Attempt ${attempt} failed for ${url}:`, err.message);
            if (attempt === retries) {
                throw err;
            }
            await sleep(delay);
            delay *= 2;
        }
    }
};

const getGoogleData = async (stockData) => {
    try {console.log("Stock Data in getGoogleData:")
        const tasks = stockData.map((item) => 
            limit(throttle(async()=>{
                const cacheKey = `google:stock:${item.stockCodeExcel}`;
                const cached = cache.get(cacheKey);
               if (cached) {
                        console.log(` Serving from cache: ${cacheKey}`);
                        return cached;
                    } else {
                        console.log(` Fetched fresh data: ${cacheKey}`);
                    }
                const isNSE = item.stockCodeExcel && /^[A-Za-z]+$/.test(item.stockCodeExcel);
                const url = isNSE
                    ? `https://www.google.com/finance/quote/${item.stockCodeExcel}:NSE`
                    : `https://www.google.com/finance/quote/${item.stockCodeExcel}:BOM`;

                const res = await fetchData(url)
                const $ = cheerio.load(res.data);

                let peRatio = null;
                $(".gyFHrc").each((_, el) => {
                    const label = $(el).find(".mfs7Fc").text().trim();
                    if (label === "P/E ratio") {
                        peRatio = parseFloat($(el).find(".P6K39c").text().trim());
                    }
                });

                const priceText = $('.YMlKec.fxKbKc').first().text().trim();
                const cleanedSharePrice = parseFloat(priceText.replace(/[₹,]/g, ''));
                const eps = peRatio && cleanedSharePrice ? (cleanedSharePrice / peRatio) : null;

                const result = {
                    stockName: item.stockName,
                    stockCodeExcel: item.stockCodeExcel,
                    stockSymbol: item.stockSymbol,
                    stockCmp: item.stockCmp,
                    stockMarketCap: item.stockMarketCap,
                    stockVolume: item.stockVolume,
                    stockCurrency: item.stockCurrency,
                    stockPeratio: peRatio,
                    stockSector:item.stockSector,
                    stockSharePrice: cleanedSharePrice,
                    stockEps: eps,
                    stockPurchasePrice: item.stockPurchasePrice,
                    stockQty: item.stockQty,
                    stockInvestment: item.stockInvestment
                };
                cache.set(cacheKey, result,600);
                return result;
            })))

        const results=await Promise.all(tasks)
        
        
        return results;
    } catch (error) {
        console.error("Error fetching Google Finance data:", error);
        throw error;
    }
};

const a= [
    {
      stockName: 'Tata Power',
      stockCodeExcel: '500400',
      stockSymbol: 'TATAPOWER.BO',
      stockCmp: 2008,
      stockMarketCap: 15407604826112,
      stockVolume: 1091176,
      stockCurrency: 'INR'
    },
    {
      stockName: 'Bajaj Finance',
      stockCodeExcel: 'BAJFINANCE',
      stockSymbol: 'BAJFINANCE.NS',
      stockCmp: 911.9,
      stockMarketCap: 5665078640640,
      stockVolume: 9442839,
      stockCurrency: 'INR'
    },
    {
      stockName: 'ICICI Bank',
      stockCodeExcel: '532174',
      stockSymbol: 'ICICIBANK.BO',
      stockCmp: 1484.45,
      stockMarketCap: 10593747599360,
      stockVolume: 19380,
      stockCurrency: 'INR'
    },
    {
      stockName: 'Bajaj Housing',
      stockCodeExcel: '544252',
      stockSymbol: 'BAJAJHFL.BO',
      stockCmp: 117.95,
      stockMarketCap: 982798303232,
      stockVolume: 98888,
      stockCurrency: 'INR'
    },
    {
      stockName: 'Savani Financials',
      stockCodeExcel: '511577',
      stockSymbol: 'SAVFI.BO',
      stockCmp: 20.99,
      stockMarketCap: 671680000,
      stockVolume: 1,
      stockCurrency: 'INR'
    }
  ]
// getGoogleData(a)

export { getGoogleData };