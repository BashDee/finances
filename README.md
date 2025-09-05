# Finance Manager

A simple and intuitive application to manage your personal finances and budgets, built with Vue.js and TypeScript.

## Features

*   **Budget Management**: Create, view, edit, and delete budgets.
*   **Categorization**: Assign categories to your budgets for better organization.
*   **Periodic Budgets**: Set budgets on a weekly, monthly, or yearly basis.
*   **Interactive UI**: A clean and responsive user interface for easy management.

## Tech Stack

### Frontend

*   **[Vue.js](https://vuejs.org/)**: The progressive JavaScript framework.
*   **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling.
*   **[TypeScript](https://www.typescriptlang.org/)**: Superset of JavaScript that adds static types.
*   **[Pinia](https://pinia.vuejs.org/)**: The intuitive store for Vue.js.
*   **[Font Awesome](https://fontawesome.com/)**: For icons.

### Backend

This project requires a separate backend service. The frontend is configured to communicate with a backend API running at `http://localhost:8000/api/v1`.

## Prerequisites

*   Node.js (v18.x or higher is recommended)
*   npm or yarn

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/BashDee/finances.git
    cd finances
    ```

2.  Install the frontend dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

## Environment Variables

Before running the application, you need to set up the environment variables.

1.  Create a `.env` file in the root of the project.
2.  Add the following variable, pointing to your backend API:

    ```properties
    VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```

## Usage

To run the frontend development server:

```bash
npm run dev
```

The application will be available at the local address provided by Vite (e.g., `http://localhost:5173`).

## Backend API

This frontend application is designed to work with a backend API. Make sure your backend server is running and accessible at the URL specified in your `.env` file. The required endpoints are:

*   `GET /api/v1/budget/items`: To fetch all budget items.
*   `POST /api/v1/budget`: To create a new budget item.
*   `PUT /api/v1/budget/{id}`: To update an existing budget item.
*   `DELETE /api/v1/budget/{id}`: To delete a budget item.
