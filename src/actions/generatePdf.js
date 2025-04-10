"use server";

import { join } from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function generatePdf(prices) {
  try {
    const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            padding: 40px;
            font-size: 14px;
            color: #1f2937;
            background-color: #ffffff;
          }
    
          header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
          }
    
          header img {
            height: 60px;
          }
    
          header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            text-transform: uppercase;
          }
    
          .invoice-date {
            text-align: right;
            margin-top: -20px;
            font-size: 14px;
            color: #6b7280;
          }
    
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
            border:1px solid gray;
          }
    
          thead {
            background-color: #f3f4f6;
          }
    
          th, td {
            border: 1px solid #e5e7eb;
            padding: 12px 16px;
            text-align: left;
          }
    
          th {
            font-weight: 600;
            color: #374151;
          }
    
          td {
            color: #4b5563;
          }
    
          .right {
            text-align: right;
          }
    
          .payable-to {
            margin-top: 40px;
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
          }
    
          .summary {
            float: right;
            margin-top: 40px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            max-width: 300px;
          }
    
          .summary div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
    
          .summary .total {
            font-size: 18px;
            font-weight: 700;
            background-color: #1f2937;
            color: #ffffff;
            padding: 10px;
            border-radius: 6px;
            justify-content: center;
            margin-top: 10px;
          }
    
          footer {
            clear: both;
            margin-top: 80px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Quote</h1>
          <img src="https://dummyimage.com/140x50/1f2937/ffffff&text=Borcelle+Auto" alt="Borcelle Auto Logo" />
        </header>
    
        <div class="invoice-date">${new Date().toLocaleDateString()}</div>
    
        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Details</th>
              <th class="right">Cost (€)</th>
            </tr>
          </thead>
          <tbody>
            ${prices
              .filter((item) => !item.isTotal)
              .map((item) => {
                const name = item.name || "";
                const info = Array.isArray(item.info)
                  ? item.info.join(", ")
                  : item.info !== undefined
                  ? item.info
                  : "";
                const cost = item.cost ? item.cost.toLocaleString() : "";
                return `
                  <tr>
                    <td>${name}</td>
                    <td>${info}</td>
                    <td class="right">${cost}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
    
        <div class="summary">
          <div><span>Sub Total</span><span>€ ${prices
            .filter((p) => !p.isTotal)
            .reduce((sum, item) => sum + (item.cost || 0), 0)
            .toLocaleString()}</span></div>
       
          <div class="total">Grand Total: € ${prices
            .find((p) => p.isTotal)
            ?.cost.toLocaleString()}</div>
        </div>
      </body>
    </html>
    `;

    const fileName = `quote-${uuidv4()}.pdf`;
    const filePath = join(process.cwd(), "public", fileName);
    const publicUrl = `/` + fileName;
    chromium.setGraphicsMode = false;
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();
    await writeFile(filePath, pdf);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
