



const calculateTotal=async(stockData)=>{


    try {
        console.log("Stock Data in claculateTotal:");
        const totalInvestment = stockData.reduce((acc, item) => {
            return acc + (item.stockPurchasePrice * item.stockQty);
          }, 0);
        
      
        
        const task=stockData.map(item=>{
            const Investment=item.stockPurchasePrice * item.stockQty
            const presentValue=item.stockCmp * item.stockQty
            const gainLoss=presentValue-Investment
            const gainLossPercent=Investment !=0 ?(gainLoss / Investment ) *100 :null
            const PortfolioPercent = totalInvestment !== 0 ? (Investment / totalInvestment) * 100 : 0;

            return {
                ...item,
                Investment: Investment,
                PresentValue: presentValue,
                GainLoss: gainLoss,
                GainLossPercent: gainLossPercent !== null ? parseFloat(gainLossPercent.toFixed(2)) : null,
                PortfolioPercent: parseFloat(PortfolioPercent.toFixed(2)),
            };
        });

        return task;
    } catch (error) {
        console.error("Error in calculateToal:", error);
        throw error;
    }
}

const sectorMap = {
    "HDFC Bank": "FinancialSector",
    "Bajaj Finance": "FinancialSector",
    "ICICI Bank": "FinancialSector",
    "Bajaj Housing": "FinancialSector",
    "Savani Financials": "FinancialSector",
  
    "Affle India": "TechSector",
    "LTI Mindtree": "TechSector",
    "KPIT Tech": "TechSector",
    "Tata Tech": "TechSector",
    "BLS E-Services": "TechSector",
    "Tanla": "TechSector",
    "Infy": "TechSector",
    "Happiest Mind": "TechSector",

    "Easemytrip": "Consumer", 
    "Dmart": "Consumer",
    "Tata Consumer": "Consumer",
    "Pidilite": "Consumer",
  
    "Tata Power": "Power",
    "KPI Green": "Power",
    "Suzlon": "Power",
    "Gensol": "Power",
  
    "Hariom Pipe": "PipeSector",
    "Astral": "PipeSector",
    "Polycab": "PipeSector",
  
    "Clean Science": "Others",
    "Deepak Nitrite": "Others",
    "Fine Organic": "Others",
    "Gravita": "Others",
    "SBI Life Insurance Company": "Others"
  };

const groupBySector = async (stockData) => {
    try {
        const groupedStock = {};

        stockData.map(item => {
            const stockName = item.stockName?.trim();
            const sector = sectorMap[stockName] || "others";
            if (!groupedStock[sector]) {
                groupedStock[sector] = [];
            }
            groupedStock[sector].push({
                ...item,
                stockGroupedSector: sector
            });
        });
        console.log("Grouped Stock Data:", groupedStock);
        return groupedStock;
    } catch (error) {
        console.error("Error in groupBySector:", error);
        throw error;
    }
}
const calculatePortfolioTotals = async (data) => {
  let totalPortfolioValue = 0;
  let totalGainLoss = 0;
  let totalStocks = data.length;

  data.forEach(stock => {
    totalPortfolioValue += stock.PresentValue || 0;
    totalGainLoss += stock.GainLoss || 0;
  });

  console.log("Total Portfolio Value:", totalPortfolioValue);
  console.log("Total Gain/Loss:", totalGainLoss);
  console.log("Total Stocks:", totalStocks);

  return {
    totalPortfolioValue,
    totalGainLoss,
    totalStocks,
  };
};



export{ calculateTotal,groupBySector,calculatePortfolioTotals}



