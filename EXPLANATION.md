# FinSight - Project Explanation

## Introduction

FinSight is a personal finance dashboard. It is made to help users track their income, expenses, and remaining balance.

Many people spend money every day, but they do not clearly know where their money is going. This project solves that problem by showing all financial details in a simple dashboard.

## Problem

Managing money manually is not easy. A user may forget daily expenses or may not understand which category is taking more money.

For example, a user may spend on food, shopping, travel, bills, or health. If these records are not tracked properly, it becomes hard to understand spending habits.

So, FinSight helps users record their money details and view useful summaries.

## Objective

The main objective of this project is to build a simple and secure finance dashboard where users can:

* Register and login
* Add income
* Add expenses
* View total income
* View total expense
* View remaining balance
* Understand category-wise spending
* Get useful spending alerts
* Filter and manage transactions

## Technologies Used

## React

React is used to build the frontend of the website. It helps in creating pages like landing page, login page, register page, and dashboard page.

## TypeScript

TypeScript is used to write safer code. It helps reduce mistakes while building the project.

## Firebase Authentication

Firebase Authentication is used for login, registration, forgot password, and user session management.

## Cloud Firestore

Cloud Firestore is used to store users and transactions. Each user's data is stored separately.

## Recharts

Recharts is used to display the expense bar graph. This makes the spending data easier to understand.

## CSS

CSS is used to design the pages and make the dashboard look clean and responsive.

## Main Modules

## Screenshots

### Landing Page

This is the first page of the application. It introduces the FinSight dashboard and guides the user to login or register.

![Landing Page](./screenshots/landing_page1.png)
![Landing Page](./screenshots/landing_page2.png)
![Landing Page](./screenshots/landing_page3.png)

### Login Page

This page allows existing users to login using email and password.

![Login Page](./screenshots/login_page.png)

### Register Page

This page allows new users to create an account.

![Register Page](./screenshots/register_page.png)

### Dashboard Page

This is the main page where the user can add income, add expenses, view balance, check the expense chart, and read smart insights.

![Dashboard Page](./screenshots/dashboard1.png)
![Dashboard Page](./screenshots/dashboard2.png)
![Dashboard Page](./screenshots/dashboard3.png)

### Forgot Password

This popup allows users to request a password reset link using their registered email.

![Forgot Password Popup](./screenshots/forgot_password.png)

## Income and Expense Categories

In this project, income and expense categories are separated.

For income, the categories are:

* Salary
* Freelance
* Other

For expenses, the categories are:

* Food
* Travel
* Shopping
* Bills
* Education
* Health
* Other

This makes the form more clear. For example, Food should come under expense, not income.

## Dashboard Summary

The dashboard shows these main values:

* Total Income
* Total Expense
* Net Balance
* Top Spending Category

The balance is calculated like this:

```text
Total Balance = Total Income - Total Expense
```

This helps the user quickly understand how much money is remaining.

## Expense Bar Graph

The dashboard shows a bar graph for expenses. It displays how much money is spent in each category.

This helps the user easily find the category where they are spending more.

## Smart Insights

The smart insight section gives useful alerts based on the user's data.

For example:

```text
Your expenses crossed your income.
```

```text
Food is using a high part of your income.
```

```text
Only a small amount of income is remaining.
```

```text
You saved a good percentage of your income.
```

These alerts help users understand their money habits better.

## Transaction History

Every added transaction is shown in the history section.

Each transaction shows:

* Type
* Category
* Date
* Note
* Amount

Income is shown as a positive amount. Expense is shown as a negative amount.

## Filtering

Users can filter transactions by:

* Category
* Start date
* End date

This helps the user check specific records easily.

## Delete Transaction

If the user adds a wrong transaction, they can delete it. After deleting, the dashboard values update again.

## Database Design

The project mainly uses two Firestore collections.

## users Collection

This collection stores user information.

Example:

```js
{
  name: "User Name",
  email: "user@example.com",
  createdAt: timestamp
}
```

## transactions Collection

This collection stores income and expense data.

Example:

```js
{
  userId: "firebase-user-id",
  amount: 1800,
  category: "Shopping",
  type: "expense",
  date: "2026-06-13",
  note: "Bought clothes",
  createdAt: timestamp
}
```

The `userId` is important because it connects each transaction to the correct user.

## Security

Firestore security rules are used to protect user data.

A logged-in user can only access their own transactions. One user cannot see or change another user's financial data.

## User Flow

The flow of the project is simple:

1. User opens the website
2. User registers or logs in
3. User goes to the dashboard
4. User adds income and expenses
5. Dashboard shows income, expenses, and balance
6. Bar graph shows category-wise spending
7. Smart insight gives useful alerts
8. User can filter or delete transactions

## Why This Project Is Useful

FinSight is useful because it helps users understand their spending clearly. It is simple to use and gives useful information instead of only showing numbers.

The project is also useful for learning because it includes:

* React frontend
* TypeScript
* Firebase Authentication
* Firestore database
* Data visualization
* Protected user data
* Form validation
* Responsive UI

## Challenges Faced

Some challenges faced in this project were:

* Connecting Firebase with React
* Storing each user's transactions separately
* Showing the user's name on the dashboard
* Creating separate categories for income and expenses
* Designing a clean dashboard
* Creating useful smart insights
* Adding forgot password and remember me options

## Future Improvements

This project can be improved by adding:

* Monthly income and expense summary
* Budget limit for each category
* Download transactions as PDF or Excel
* Dark mode
* Monthly savings goal
* Notifications for high spending
* More advanced financial suggestions

## Conclusion

FinSight is a simple and useful personal finance dashboard. It helps users track income, expenses, balance, and spending habits.

It gives a clean view of money data and also provides smart alerts to help users improve savings and control unnecessary expenses.
