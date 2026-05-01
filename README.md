# Playwright Test Automation POC

A Playwright + TypeScript end-to-end test automation project covering three independent test scenarios across different demo web applications.

---

## Project Structure

```
POC/
├── src/
│   ├── pom/                          # Page Object Models
│   │   ├── surveysPage.ts            # Survey Questions page actions
│   │   ├── webTablePage.ts           # Web Table page actions
│   │   └── Book-Shop-Pages/
│   │       ├── registerPage.ts
│   │       ├── booksPage.ts
│   │       ├── cartPage.ts
│   │       ├── checkoutPage.ts
│   │       └── orderDetailsPage.ts
│   ├── tests/                        # Test specs
│   │   ├── task1.spec.ts             # Survey Questions test
│   │   ├── task2_WebTable.spec.ts    # Web Table verification test
│   │   └── task3.spec.ts            # Book Shop E2E test
│   └── test-fixtures/
│       └── testFixtures.ts           # Custom Playwright fixtures
├── reports/
│   └── html/                         # HTML test reports (auto-generated)
├── test-results/                     # Screenshots, videos, traces (auto-generated)
├── .env                              # Environment variables (not committed in CI)
├── playwright.config.ts
├── package.json
└── package-lock.json
```

---

## Test Scenarios

### Task 1 — Survey Questions
**URL:** QuestionPro survey (`TASK1_URL`)

Automates a 6-question survey end-to-end:
- Single radio button selection
- Multiple free-text answers
- Unique dropdown selections
- Drag-and-drop items into fruits/vegetables categories
- Matrix radio button selections
- Asserts the completion message on the final screen

### Task 2 — Web Table Verification
**URL:** Applitools demo app (`TASK2_URL`)

Verifies transaction rows in a web table:
- Asserts a row with full details (status, date, category, amount)
- Asserts a row with a single field (status only)

### Task 3 — Book Shop E2E Purchase
**URL:** Tricentis Demo Web Shop (`TASK3_URL`)

Full purchase flow from registration to order confirmation:
1. Register a random new user
2. Browse books, sort by price (high to low), switch to list view
3. Add *Health Book* to cart
4. Handle terms popup, verify cart item and price
5. Complete checkout with billing address, shipping, and payment (Cash on Delivery)
6. Assert order success message and capture the order number
7. Navigate to order history and verify order details (book name, total, quantity)

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v8 or later
- **Google Chrome** installed (the project runs tests on the Chrome channel)

---

## Setup

**1. Clone the repository and navigate to the project folder:**

```bash
cd POC
```

**2. Install dependencies:**

```bash
npm ci
```

**3. Install Playwright browsers:**

```bash
npx playwright install chrome --with-deps
```

**4. Configure environment variables:**

Create a `.env` file in the `POC/` directory (copy from the example below):

```env
TASK1_URL=http://www.questionpro.com/t/AK7ptZqw5N
TASK2_URL=https://demo.applitools.com/app.html#
TASK3_URL=https://demowebshop.tricentis.com/
```

---

## Running Tests

**Run all tests:**

```bash
npx playwright test
```

**Run a specific test file:**

```bash
npx playwright test src/tests/task1.spec.ts
npx playwright test src/tests/task2_WebTable.spec.ts
npx playwright test src/tests/task3.spec.ts
```

**Run in headed mode (visible browser):**

```bash
npx playwright test --headed
```

**Run with Playwright UI mode:**

```bash
npx playwright test --ui
```

**View the HTML report after a run:**

```bash
npx playwright show-report reports/html
```

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| Test directory | `./src/tests` |
| Timeout per test | 90 seconds |
| Browser | Google Chrome |
| Parallel execution | Yes (4 workers in CI) |
| Retries | 2 in CI, 1 locally |
| Screenshots | On (every test) |
| Video | Retained on failure |
| Trace | On first retry |
| Report output | `reports/html/` |

---

## CI/CD — GitHub Actions

The workflow file is located at `.github/workflows/playwright.yml`. It runs automatically on every push and pull request to `main`/`master`, and can also be triggered manually.

### Required GitHub Secrets

Add these in your repository under **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `TASK1_URL` | QuestionPro survey URL |
| `TASK2_URL` | Applitools demo app URL |
| `TASK3_URL` | Tricentis demo shop URL |

### Artifacts uploaded after each run

- **`playwright-html-report`** — full HTML report (retained for 14 days, uploaded on every run)
- **`playwright-test-results`** — screenshots, videos, and traces (retained for 7 days, uploaded only on failure)

---

## Tech Stack

| Tool | Version |
|---|---|
| [Playwright](https://playwright.dev/) | ^1.55.1 |
| TypeScript / `@types/node` | ^24.6.2 |
| dotenv | ^17.2.3 |
| Node.js | 20 (CI) |
