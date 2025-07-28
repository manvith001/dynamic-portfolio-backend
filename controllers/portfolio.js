
const { default: portfolio } = await import('../data/portfolio.json', {
    with: {
        type: 'json'
    },
});

import { getGoogleData } from '../services/googleServices.js';
import { fetchCmpValue } from '../services/yahooService.js';
import { calculateTotal, groupBySector, calculatePortfolioTotals } from '../utils/calculate.js';




const portfolioData = async (req, res) => {
    try {

        const stockData = portfolio
            .filter(item => item.No)
            .map(item => ({
                stockName: item.Particulars,
                stockCode: item['NSE/BSE'],
                stockPurchasePrice: item['Purchase Price'],
                stockQty: item.Qty,
                stockInvestment: item.Investment
            }));

        const cmpValue = await fetchCmpValue(stockData);
        const dataFromGfiance = await getGoogleData(cmpValue);


        const finalData = await calculateTotal(dataFromGfiance);
        const updatedStockData = await groupBySector(finalData);
        


        const total = await calculatePortfolioTotals(finalData);

        return res.status(200).json({
            success: true,
            message: "Portfolio data fetched successfully",
            total: total,
            data: updatedStockData,
            error: null
        });

    } catch (error) {
        console.error("Error processing portfolio data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
            error: "Internal server error"
        });
    }
};




export { portfolioData };