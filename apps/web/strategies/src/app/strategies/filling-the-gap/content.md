---
title: Filling the Gap
---

Gaps in stocks occur when today's trading high is below yesterday's trading low, or today's trading low is above yesterday's trading high.

Many technical analysts claim that most gaps eventually get filled.

On the following page, we are going to examine whether that claim is true.

It is important to note that we are examining the claim on US stocks with high liquidity (many buyers and sellers, heavy trading volume, and prices that usually do not jump sharply on each trade)—specifically S&P 500 stocks and stocks that used to be in the S&P 500.

## What is a Gap

we will start by understanding what a gap is...

### High/Low, Open/Close

Let's define a few concepts that we need to know about stocks to understand what a gap is.

Open - is the price of the stock when trading opened.
Close - is the price of the stock when trading closed.
High - The highest price that the stock reached during the day of trading.
Low - The lowest price that the stock reached during the day of trading.

### Candlestick

To help us understand the concepts of High/Low, Open/Close and in the process improve our ability to read certain graphs properly, we can examine the [Candlestick chart](https://en.wikipedia.org/wiki/Candlestick_chart).
A candlestick chart is made from candlesticks that look like the following:

![White candlestick: close above open](/strategies/filling-the-gap/candle-white.svg)
![Black candlestick: close below open](/strategies/filling-the-gap/candle-black.svg)

The color of the candlestick denotes whether the stock went up or down.
Usually white signifies a stock going up and black signifies a stock going down, but in many graphs you can control the color or the colors might be different than black and white (green and red are also common to signify up or down).
The line signifies the high and low, and the bottom and top of the square tell us the open and close. If the square is white, the bottom is the open and the top is the close. If the square is black, the top is the open and the bottom is the close.

A single candlestick does not necessarily correlate to a single day. That is usually the default, but in most graph applications you can set a candlestick to represent less than a day (such as one hour or one minute) or more than one day. If a candlestick represents a different time period, the same rules apply. For example, if a candlestick represents one week, the top of the line signifies the high the stock reached during that week, the bottom of the line represents the low the stock reached, and the top and bottom of the rectangle tell us the open and close (we can tell which is which by the color of the candlestick).

### So what is a gap

It's easier to understand what a gap is by examining a candlestick graph and looking at a gap in that graph:

![Candlestick chart with a gap marked by a circle](/strategies/filling-the-gap/gap-chart.svg)

The image shows a gap in the stock price—a range of prices that the stock simply skipped, where there was no trading in that price range.
Practically, it usually does not happen in the middle of a trading day (during the day there will usually be trades across different price levels, even when something major happens), but when there is a halt in trading, like between the end of one day and the beginning of the next. Under normal conditions, if trading opens and closes in an orderly way, there would not be any gaps. Those gaps happen when something occurred during that halt window.
For example, after the end of a trading day there was some sort of geopolitical event that influenced a stock directly. This might affect the opening price of the stock on the next day and cause a gap.
Essentially, when we need to find a gap, we can examine the high and low between two adjacent candlesticks that have a halt in trading between them. If there is a jump between those two candlesticks and a range that is not covered by either candlestick's high or low, then we have a gap.

## Types of gaps

Gap can be classified according to the reason why they happened.
Let's try to understand.

### Common Gap

Common gaps are the most frequent type of gap. They are usually pretty small and are not caused by a major event. They can happen when there is a minor mismatch between buyers and sellers overnight, rather than a big new story. Trading volume on these gaps is usually average, with nothing unusual about it. They often show up within a consolidation range—the stock has been moving sideways for a while, trading back and forth between similar highs and lows over many days instead of trending clearly up or down. Common gaps do not signal a strong market trend. You will often read that they are typical in low-liquidity markets; that is not the focus of our research, but on S&P 500 stocks they still appear as small gaps during those sideways periods.

![Schematic example of a common gap in a consolidation range](/strategies/filling-the-gap/gap-common.svg)

### Breakaway Gap

A breakaway gap signals the start of a new trend. It often happens after a consolidation phase, when the stock gaps above or below the levels where it had been trading sideways and breaks out of that range. It points to a shift in market dynamics and the potential for a strong trend. Breakaway gaps usually come with well above-average trading volume and are often tied to a meaningful catalyst, such as earnings, major company news, or a clear change in outlook—not a minor overnight imbalance.

![Schematic example of a breakaway gap](/strategies/filling-the-gap/gap-breakaway.svg)

### Runaway / Measuring Gap

A runaway gap—also called a measuring or continuation gap—shows up in the middle of a strong trend that is already underway, often after a significant price move. It suggests the trend is accelerating, not ending. These gaps often come with higher-than-normal trading volume, as more participants join the move. Technical analysts sometimes call it a measuring gap because they claim it may appear roughly halfway through the trend; the distance from the start of the move to the gap is then used as a rough guide for how much price might still have left to go. We have not checked that halfway rule in our research yet. Continuation gaps are rare compared with common gaps.

![Schematic example of a runaway gap in an uptrend](/strategies/filling-the-gap/gap-runaway.svg)

### Exhaustion Gap

An exhaustion gap forms after a long and sharp price move, often near the end of a trend and right before a reversal. It can be hard to tell apart from a runaway gap at the time; traders usually only know it was exhaustion in hindsight, after price turns. It may appear late in a trend that already had continuation gaps, but that is not always the case. Technical analysts often claim that exhaustion gaps are filled shortly after they open; we have not checked that claim in our research yet.

![Schematic example of an exhaustion gap before a reversal](/strategies/filling-the-gap/gap-exhaustion.svg)

## Filling the gap

Closing a gap—or filling the gap—means that on one or more later days, the candlesticks trade back into the empty range that was left between two sessions. The gap is closed when their highs and lows overlap that whole skipped band, the same way we use highs and lows to define the gap in the first place—not when the closing price lands on one exact level at the end of the day. That can take a single candlestick or many. There is no fixed schedule: a gap can fill the next session, a month later, a year later, or even ten years later—or it can still be open on the last day of our data and, in principle, never fill at all.

## Securities API

Gap queries use a numeric **`securityId`**. To look up that id from a ticker and exchange—or to browse which S&P 500 and former constituent names we cover—use the Securities API. It reads from the same `securities` table that **`daily_bars.security_id`** references.

**Authentication:** same free registration and Bearer token as the Gaps API.

**Endpoint:** `GET /api/v1/security`  
**Response:** JSON, **camelCase** property names (for example `assetType` maps to `asset_type` in the database).

### Query parameters

| Parameter | Description |
|-----------|-------------|
| `id` | Primary key (`securities.id`). Optional; use for a direct lookup when you already know the id. |
| `ticker` | Ticker symbol (e.g. `AAPL`). Pair with `exchange` for a unique match. |
| `exchange` | Exchange code (e.g. `NASDAQ`). Required when filtering by `ticker` alone would be ambiguous. |
| `isActive` | `true` or `false` — whether the security is still treated as active in our catalog. |
| `assetType` | Asset class (default listing is `equity`). |
| `limit`, `cursor` | Pagination (exact limits documented at launch). |

The list is scoped to **S&P 500 constituents and former constituents** included in our gap research (same universe as the Gaps API).

### Fields on each security object

- **`id`** — use this value as **`securityId`** on `GET /api/v1/gap`.
- **`ticker`**, **`exchange`** — unique together in our database.
- **`name`** — company or instrument name when available.
- **`currency`** — quote currency (typically `USD`).
- **`assetType`** — e.g. `equity`.
- **`isActive`** — catalog flag.
- **`createdAt`** — ISO 8601 timestamp when the row was added.

### Example: resolve ticker to id

```http
GET /api/v1/security?ticker=AAPL&exchange=NASDAQ
Authorization: Bearer <token>
```

```json
{
  "data": [
    {
      "id": 42,
      "ticker": "AAPL",
      "exchange": "NASDAQ",
      "name": "Apple Inc.",
      "currency": "USD",
      "assetType": "equity",
      "isActive": true,
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  ],
  "meta": { "count": 1 }
}
```

Pass `"id": 42` as **`securityId=42`** on gap requests.

### Example: fetch by id

```http
GET /api/v1/security?id=42
Authorization: Bearer <token>
```

### Example: list active equities (paginated)

```http
GET /api/v1/security?isActive=true&assetType=equity&limit=100
Authorization: Bearer <token>
```

---

## Gaps API

The Gaps API exposes overnight gaps detected on **S&P 500 stocks and former S&P 500 constituents** in our database. Each gap is tied to a security the same way daily bars are: a **`security_id`** column in the database (foreign key to `securities`). Use the [Securities API](#securities-api) above to resolve **`securityId`**. Daily OHLC bars for that id are scanned so a gap is recorded only when the **high and low** of two adjacent **trading days** leave an empty band between sessions—the same definition used in this article, not a move from prior close to next open alone.

**Authentication:** create a free account and use your API token on every request (`Authorization: Bearer <token>`).

**Endpoint:** `GET /api/v1/gap`  
**Response:** JSON. Property and query names use **camelCase** (for example `securityId` in the response maps to `security_id` in the database).

### Query parameters

| Parameter | Description |
|-----------|-------------|
| `securityId` | Numeric id of the security (same as `securities.id` and `daily_bars.security_id`). Optional; omit to search across the S&P universe. Resolve from ticker via `GET /api/v1/security`. |
| `gapType` | One of `common`, `breakaway`, `runaway`, `exhaustion`, or `unknown`. |
| `isClosed` | `true` or `false` — whether the skipped band has been fully overlapped by later sessions’ highs and lows. |
| `minSize` | Minimum gap size in **price units** (width of the empty band). |
| `maxSize` | Maximum gap size in price units. |
| `minSizePct` | Minimum gap size as a percent of the prior session’s close. |
| `maxSizePct` | Maximum gap size as a percent of the prior session’s close. |
| `gapFrom`, `gapTo` | Date range (ISO `YYYY-MM-DD`) on the **gap session** — the trading day where the gap appears. |
| `closingFrom`, `closingTo` | Date range on **closing started on** — the first session whose range begins to overlap the gap zone. Omit gaps that never started to close by using filters that exclude nulls implicitly, or combine with `isClosed`. |
| `limit`, `cursor` | Pagination (exact limits documented at launch). |

### Fields on each gap object

Every row includes **`securityId`** and may embed a **`security`** object (same id) with `ticker`, `exchange`, `name`, `assetType`, and related fields so you do not need a second lookup for display. Gap-specific fields include:

- **`direction`** — `up` or `down`.
- **`gapType`** — classifier output (`common`, `breakaway`, `runaway`, `exhaustion`, or `unknown`).
- **`priorSessionDate`**, **`gapSessionDate`** — the two sessions that bound the overnight gap.
- **`gapLow`**, **`gapHigh`** — bottom and top of the skipped price band.
- **`size`**, **`sizePct`** — band width in dollars and as a percent of the prior close.
- **`isClosed`** — whether the full band has been overlapped by later candlesticks (possibly over many days).
- **`closingStartedOn`** — first date the fill process starts; `null` if price has never traded back into the gap zone.
- **`closedOn`** — first date the entire band is covered; `null` while the gap is still open.

### Example: gaps for one stock in a date range

```http
GET /api/v1/gap?securityId=42&gapFrom=2024-01-01&gapTo=2024-12-31
Authorization: Bearer <token>
```

```json
{
  "data": [
    {
      "id": "gap_8f3a2c1d",
      "securityId": 42,
      "security": {
        "id": 42,
        "ticker": "AAPL",
        "exchange": "NASDAQ",
        "name": "Apple Inc.",
        "currency": "USD",
        "assetType": "equity"
      },
      "direction": "up",
      "gapType": "common",
      "priorSessionDate": "2024-01-08",
      "gapSessionDate": "2024-01-09",
      "gapLow": 184.5,
      "gapHigh": 186.2,
      "size": 1.7,
      "sizePct": 0.92,
      "isClosed": true,
      "closingStartedOn": "2024-01-12",
      "closedOn": "2024-01-15"
    }
  ],
  "meta": { "count": 1 }
}
```

### Example: only open common gaps above a minimum size

```http
GET /api/v1/gap?gapType=common&isClosed=false&minSize=1.0&gapFrom=2020-01-01
Authorization: Bearer <token>
```

Use this to list gaps that are still open as of our latest bar data and are at least one dollar wide (illustrative threshold).

### Example: closed breakaway gaps that started filling in Q2 2024

```http
GET /api/v1/gap?gapType=breakaway&isClosed=true&closingFrom=2024-04-01&closingTo=2024-06-30
Authorization: Bearer <token>
```

`closingFrom` and `closingTo` restrict results by **`closingStartedOn`**, not by the day the gap fully closed (`closedOn`). Add `gapFrom` / `gapTo` if you also want to limit when the gap originally formed.

### Example: small gaps as a percentage of price

```http
GET /api/v1/gap?maxSizePct=0.5&isClosed=true
Authorization: Bearer <token>
```

Returns gaps whose empty band is at most 0.5% of the prior session’s close and that have fully closed.

Field names and pagination details may change slightly before the APIs go live; the behavior above matches what we intend to ship.

