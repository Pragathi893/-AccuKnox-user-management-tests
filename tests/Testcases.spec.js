const { test, expect } = require('@playwright/test');
const { AdminPage } = require('../pages/AdminPage');
const { LoginPage } = require('../pages/LoginPage');

// Test data
const adminCredentials = { username: 'Admin', password: 'admin123' };
const testUser = {
  original: {
    name: 'John Michael Smith', username: 'testuser001', password: 'Test@1234', role: 'Admin', status: 'Enabled'
  },
  updated: {
    name: 'David Robert Williams', username: 'updateduser001', role: 'ESS', status: 'Disabled'
  }
};

test.describe('Admin Module Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(adminCredentials.username, adminCredentials.password);
  });

  test('TC01 - Navigate to Admin Module', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await expect(adminPage.pageTitle).toBeVisible();
  });

  test('TC02 - Add a New User', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await adminPage.addUser(testUser.original);
    await expect(adminPage.toastSuccess).toHaveText(/successfully/i);
  });

  test('TC03 - Search for the Newly Created User', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await adminPage.searchUser(testUser.original);
    await expect(adminPage.resultUsername).toHaveText(testUser.original.username);
  });

  test('TC04 - Edit User Details', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await adminPage.editUser(testUser.original.username, testUser.updated);
    await expect(adminPage.toastSuccess).toHaveText(/updated successfully/i);
  });

  test('TC05 - Validate Updated Details', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await adminPage.searchUser(testUser.updated);
    await expect(adminPage.resultUsername).toHaveText(testUser.updated.username);
    await expect(adminPage.resultRole).toHaveText(testUser.updated.role);
    await expect(adminPage.resultStatus).toHaveText(testUser.updated.status);
  });

  test('TC06 - Delete the User', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await adminPage.deleteUser(testUser.updated.username);
    await expect(adminPage.toastSuccess).toHaveText(/successfully deleted/i);
  });

  test('TC07 - Verify Deleted User Cannot Be Found', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdmin();
    await adminPage.searchUser({ username: testUser.updated.username });
    await expect(adminPage.noRecordsFound).toBeVisible();
  });
});

--

// Sample: playwright-admin-tests/pages/AdminPage.js

class AdminPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h6:has-text("System Users")');
    this.toastSuccess = page.locator('.oxd-toast--success');
    this.resultUsername = page.locator('.oxd-table-cell:has-text("updateduser001")');
    this.resultRole = page.locator('td:nth-child(3)');
    this.resultStatus = page.locator('td:nth-child(5)');
    this.noRecordsFound = page.locator('text=No Records Found');
  }

  async navigateToAdmin() {
    await this.page.click('span:has-text("Admin")');
    await this.page.waitForSelector('h6:has-text("System Users")');
  }

  async addUser(user) {
    await this.page.click('button:has-text("Add")');
    await this.page.selectOption('select[name="userRole"]', user.role);
    await this.page.fill('input[name="employeeName"]', user.name);
    await this.page.selectOption('select[name="status"]', user.status);
    await this.page.fill('input[name="username"]', user.username);
    await this.page.fill('input[name="password"]', user.password);
    await this.page.fill('input[name="confirmPassword"]', user.password);
    await this.page.click('button:has-text("Save")');
  }

  async searchUser(user) {
    await this.page.fill('input[name="username"]', user.username);
    if (user.role) await this.page.selectOption('select[name="userRole"]', user.role);
    if (user.status) await this.page.selectOption('select[name="status"]', user.status);
    await this.page.click('button:has-text("Search")');
  }

  async editUser(existingUsername, newUserData) {
    await this.searchUser({ username: existingUsername });
    await this.page.click('i.bi-pencil-fill');
    await this.page.selectOption('select[name="userRole"]', newUserData.role);
    await this.page.fill('input[name="employeeName"]', newUserData.name);
    await this.page.selectOption('select[name="status"]', newUserData.status);
    await this.page.fill('input[name="username"]', newUserData.username);
    await this.page.click('button:has-text("Save")');
  }

  async deleteUser(username) {
    await this.searchUser({ username });
    await this.page.click('input[type="checkbox"]');
    await this.page.click('button:has-text("Delete")');
    await this.page.click('button:has-text("Yes, Delete")');
  }
}

module.exports = { AdminPage };

// Sample: playwright-admin-tests/pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button:has-text("Login")');
    await this.page.waitForSelector('h6:has-text("Dashboard")');
  }
}

module.exports = { LoginPage };
