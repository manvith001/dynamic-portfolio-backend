import yahooFinance from 'yahoo-finance2';
import pLimit from 'p-limit'
import cache from '../cache/cache.js';



const fetchCmpValue = async (stockData) => {

    try {
        console.log("Fetching CMP values for stock data inside yahooService.js:");
        const stockCmpData = [];

        const limit = pLimit(5);

        const tasks = stockData.map(item =>
            limit(async () => {
                try {
                    let symbol;
                    let search;
                    let sector;

                    if (item.stockCode && /^[A-Za-z]+$/.test(item.stockCode)) {
                        search = await yahooFinance.search(item.stockCode);
                        const nseQuote = search.quotes.find(
                            q =>
                                q.exchange === 'NSI' &&
                                q.exchDisp === 'NSE' &&
                                q.symbol?.endsWith('.NS') &&
                                q.symbol?.indexOf('-') === -1 && 
                                (q.longname || q.sector)
                        );
                        symbol = nseQuote?.symbol || item.stockCode.toUpperCase() + '.NS';
                        sector = nseQuote?.sector
                    } else {
                        search = await yahooFinance.search(item.stockName);
                        const bseQuote = search.quotes.find(q => q.exchange === 'BSE' && q.exchDisp === 'Bombay');
                        symbol = bseQuote?.symbol || item.stockName.toUpperCase().replace(/\s+/g, '') + '.BO';
                        sector = bseQuote?.sector
                    }


                    const cacheKey = `yahoo:stock:${symbol}`;
                    const cached = cache.get(cacheKey);
                    if (cached) {
                        console.log(`Serving from cache: ${cacheKey}`);
                        return cached;
                    } else {
                        console.log(`Fetched fresh data: ${cacheKey}`);
                    }

                    const quote = await yahooFinance.quote(symbol);

                    const result = {
                        stockName: item.stockName,
                        stockCodeExcel: item.stockCode,
                        stockSymbol: symbol,
                        stockSector: sector,
                        stockCmp: quote.regularMarketPrice,
                        stockMarketCap: quote.marketCap,
                        stockVolume: quote.regularMarketVolume,
                        stockCurrency: quote.currency,
                        stockPurchasePrice: item.stockPurchasePrice,
                        stockQty: item.stockQty,
                        stockInvestment: item.stockInvestment,
                    };
                    cache.set(cacheKey, result,600);
                    return result;
                } catch (err) {
                    console.warn(`Failed to fetch data for ${item.stockName}:`, err.message);
                    return null; // skip errored items
                }
            })
        );

        const results = await Promise.all(tasks);
        return results.filter(Boolean); // remove null results
    } catch (error) {
        console.error("Error fetching CMP values:", error);
        throw error;
    }
};
const a = [
    { stockName: 'HDFC Bank', stockCode: 'HDFCBANK' },
    { stockName: 'Bajaj Finance', stockCode: 'BAJFINANCE' },
    { stockName: 'ICICI Bank', stockCode: '532174' },
    { stockName: 'Bajaj Housing', stockCode: '544252' },
    { stockName: 'Savani Financials', stockCode: '511577' }
];

//   fetchCmpValue(a)
export { fetchCmpValue };




