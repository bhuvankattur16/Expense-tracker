# WealthTrack — Personal Wealth & Expense Tracker (React)

WealthTrack is a modern, client-side web application designed to help you manage your personal finances. This version has been migrated from vanilla JavaScript to React for better state management and component-driven architecture.

## 🚀 Tech Stack

- **React (Vite)**: Chosen for its efficient state management and component reusability. Vite ensures a near-instant developer experience with HMR.
- **Chart.js & react-chartjs-2**: Selected for its rich visualization capabilities, used for generating dynamic pie and bar charts for financial data.
- **Lucide React**: Provides a comprehensive set of clean, consistent icons.
- **IndexedDB**: A robust, transactional database in the browser, providing a high-performance "offline-first" storage solution for your transactions.
- **Vanilla CSS**: Used to maintain full control over the "premium" dark finance aesthetic, featuring custom animations and glassmorphism.

### Why this stack?
Migrating to **React** allows for a more scalable codebase where UI state (transactions, filters, modal visibility) is managed in a declarative way. **IndexedDB** is used to ensure user data persists across sessions without requiring a backend server, keeping the project's "client-side only" philosophy intact.

## 🛠️ Setup Instructions

To run this project locally, follow these steps:

1.  **Clone/Download** the repository.
2.  **Open a terminal** in the project's root directory.
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
5.  **Access the app**: Open the URL displayed in your terminal (usually `http://localhost:5173`).

## ⚖️ Trade-offs & Improvements

### Trade-offs Taken
-   **Client-Side Persistence (IndexedDB)**: While this provides excellent privacy and works offline, data is tied to a specific browser/device. A future improvement would be adding an optional cloud-sync feature.
-   **Vanilla CSS vs. Tailwind**: I chose Vanilla CSS to achieve a very specific "premium" aesthetic that matches the original design tokens perfectly. While Tailwind would be faster to iterate on, custom CSS gives more control over complex animations and unique styling patterns.
-   **Manual Transaction Input**: The current app relies purely on manual entry. Integration with bank APIs or CSV imports would be an obvious next step.

### Future Improvements
-   **Budgeting Goals**: Allow users to set targets for different categories and track progress visually.
-   **Export functionality**: Enable exporting financial data to JSON or CSV formats.
-   **Progressive Web App (PWA)**: Make the application installable on mobile devices for a native app feel.
