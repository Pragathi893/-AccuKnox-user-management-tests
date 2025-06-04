
# OrangeHRM demo testing

This project automates end-to-end test scenarios for the Admin Module of orangeHRM demo.

URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login




## Installation

Install dependencies

```bash
 npm install
```
Install Playwright browsers
```bash
 npx playwright install
```

(Optional) Open Playwright Test UI
```bash
 npx playwright test --ui  
```

Start the server
```bash
  npm run start
```

## Running Tests

To run tests, run the following command

```bash
  npx playwright test --workers1
```




## Tech Stack



**Server:** Node  v24.1.0

**Testing tool:** playwright  1.52.0



