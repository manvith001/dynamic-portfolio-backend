import xlsx from "xlsx";
import fs from "fs";


const workbook = xlsx.readFile("../data/Data.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];


const data = xlsx.utils.sheet_to_json(sheet, {
  defval: "",         
  raw: true,          
  range: 1            
});

fs.writeFileSync("../data/portfolio.json", JSON.stringify(data, null, 2));
console.log("JSON converted using 2nd row as headers");
