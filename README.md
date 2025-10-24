# 戰略雷達 Starter Kit

這個包包含：
- `Code.gs`：Google Apps Script，將 Google Sheet 的 `Radar` 分頁輸出為 `data.json`。
- `index.html`：前端儀表板（已內建「國強街 IRR 線」迷你卡 + fallback sample）。
- `Radar_template.csv`：`Radar` 分頁樣板（key/value 兩欄）。

## A. 部署 Apps Script（data.json）
1. 在你的 Google 試算表建立分頁 `Radar`，再把 `Radar_template.csv` 匯入（或手動貼上）。
2. 開啟「擴充功能 → Apps Script」，新建專案，把本包的 `Code.gs` 原樣貼上。
3. **部署**：選單「部署 → 新增部署 → 類型：網路應用程式」，執行身分選你自己，存取權選「任何知道連結的人」。複製部署網址（即 `data.json` 端點）。

## B. 啟用前端
1. 用文字編輯器開啟 `index.html`，把裡面 `const DATA_URL = 'https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxx/exec';` 換成你的部署網址。
2. 直接用瀏覽器開啟 `index.html` 就能看到；或丟到 GitHub Pages / Cloudflare Pages 上線。
3. 點「更新資料」按鈕會呼叫你的 `data.json`，若失敗會使用內建 sample。

## C. 在 Google Sheet 內計算（XLOOKUP/QUERY 範例）
- DTI：
```
=TEXT( XLOOKUP("本月合計",貸款明細!A:A,貸款明細!E:E) / XLOOKUP("實領",薪資!A:A,薪資!B:B), "0%" )
```
- 現金池月數：
```
=ROUND( XLOOKUP("可動用現金",資產表!A:A,資產表!B:B) / XLOOKUP("家庭月支出",收支彙總!A:A,收支彙總!B:B), 1 ) & " 個月"
```

## D. IRR 卡的參數說明
- `purchasePrice`：買價（元）
- `renoCost`：裝修成本（元）
- `holdMonths`：持有月數
- `monthlyHoldCost`：每月持有成本（管理費、房貸利息、稅費…）
- `feeRate`：成交時的總費率（代銷+仲介+稅費估比）
- `targetIRR`：目標年化 IRR（預設 0.12 => 12%）

IRR 計算採月度現金流，最後一月的售價扣費後淨流入，同時仍計入當月持有成本。用牛頓法近似並以二分搜尋反解目標售價。

## E. 注意
- Apps Script Web App 端點會有快取，`index.html` 以 `cache: 'no-store'` 要求不快取，但若你看到延遲，多按一次「更新資料」。
- 之後你要新增更多 `Radar` 鍵名，只要在 `Code.gs` 擴充映射或用 `flat` 直接讀取自定鍵即可。
