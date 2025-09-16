# Lectura - Note-Sharing App for Students

Lectura is a mobile-first, progressive web app (PWA) designed to help students share and manage their study notes. It allows users to upload notes in various formats (images, PDF, DOCX), categorize them by course, and share them with others. The app also includes a powerful CGPA calculator to help students track their academic progress.

## Features

- **Secure Authentication:** Users can sign up and log in using email and password. The backend uses JWTs stored in HttpOnly cookies for secure sessions.
- **Note Management:** Upload, view, and manage notes. Notes can be public or private.
- **File Support:** Supports JPG, PNG, PDF, and DOCX file formats.
- **In-Browser Preview:** Preview images and PDFs directly in the browser.
- **Advanced Search:** Search for notes by title, course code, or tags.
- **CGPA Calculator:** A comprehensive tool to calculate semester and cumulative GPA on a 5.0 scale, with support for retake courses.
- **Responsive & Mobile-First:** The UI is designed to work beautifully on both mobile devices and desktops.
- **PWA Ready:** Install the app on your device for a native-like experience and offline access to the app shell.
- **Admin Panel:** A basic dashboard for administrators to manage users and content.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, Recharts
- **Backend:** Node.js, Express, Sequelize (MySQL), JWT, Multer
- **Database:** MySQL

---

## Local Development Setup

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- A running MySQL database instance

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lectura
```

### 2. Backend Setup

The backend server runs on port 8080 by default.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env
```

**Configure Environment Variables:**

Open the `.env` file and update the database credentials (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`) to match your local MySQL setup.

**Run Database Migrations:**

You need a MySQL database created with the name you specified in `.env`. Then, run the migrations to create all the necessary tables.

```bash
# The sequelize-cli might have issues with npx in some environments.
# If this command fails, you may need to run the local executable:
# ./node_modules/.bin/sequelize-cli db:migrate
npx sequelize-cli db:migrate
```

**Run Database Seeders (Optional):**

To populate the database with an admin user and sample data:

```bash
npx sequelize-cli db:seed:all
```
*   **Admin Credentials:** `admin@lectura.app` / `password123`

**Start the Backend Server:**

```bash
# For development with auto-reloading
npm run dev
```

### 3. Frontend Setup

The frontend development server runs on port 5173 by default.

```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install
```

**Configure Environment Variables:**

The frontend connects to the backend at `http://localhost:8080/api` by default. If your backend is running on a different port, you can create a `.env.local` file in the `frontend` directory and set the `VITE_API_BASE_URL` variable.

**Start the Frontend Server:**

```bash
# For development with auto-reloading
npm run dev
```

### 4. Accessing the Application

-   **Frontend:** `http://localhost:5173`
-   **Backend API:** `http://localhost:8080`

---

## Running Tests

To run the backend unit tests:

```bash
cd backend
npm test
```

## Project Structure

```
/lectura
  /backend
    /migrations
    /seeders
    /src
      /controllers
      /middlewares
      /models
      /routes
      /utils
    .sequelizerc
    app.js
  /frontend
    /public
    /src
      /components
      /context
      /layouts
      /pages
      /services
    vite.config.js
  README.md
  ...
```
