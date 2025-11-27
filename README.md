📚 PROJECT-GJ — Django + React (Vite) Full Stack App
This repository contains a full-stack web application built with:
Backend: Django + Django REST Framework + Token Authentication
Frontend: React + Vite
Database: PostgreSQL

The app uses Django as an API backend only, with React handling all frontend UI.

🚀 Features Implemented So Far
Backend
Token-based authentication
User registration (/api/signup/)
User login (/api/login/)
CORS enabled for frontend
Admin panel for user management
API endpoints return JSON only (no HTML templates)

Frontend
Vite + React app
Login page
Signup page
Shared CSS styling
Token + user stored in localStorage
React Router for navigation

📦 Technology Stack
Backend
Python 3
Django
Django REST Framework (DRF)
django-cors-headers

Frontend
Node.js + npm
React
Vite
react-router-dom

⚙️ 2. Quick Start Guide (Backend + Frontend)
🔧 Backend Setup (Django)
1️⃣ Create / activate virtual environment
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
2️⃣ Install dependencies
pip install -r requirements.txt
3️⃣ Run migrations
python manage.py migrate
4️⃣ Start backend server
python manage.py runserver

Backend runs at:
👉 http://127.0.0.1:8000

🎨 Frontend Setup (Vite + React)
Project Structure
frontend/
  src/
    LoginSignUp/
      LoginPage.jsx
      SignupPage.jsx
      LoginSignUp.css
    App.jsx
    main.jsx

LoginSignUp/ → All authentication-related UI
auth.css → Shared styles for the Login + Signup pages
App.jsx → Defines routes using React Router
main.jsx → Application entry point

New features should be organized by feature folders, for example:
src/
  Dashboard/
    Dashboard.jsx
  Components/
    Navbar.jsx
    ProtectedRoute.jsx

Working on the frontend
Prerequisites:
Node.js + npm installed
node -v
npm -v

Continue if so:
1️⃣ Go to the frontend folder
cd frontend
2️⃣ Install dependencies
npm install
3️⃣ Start development server
npm run dev

Frontend runs at:
👉 http://localhost:5173

🔗 Important API Routes
PURPOSE	METHOD	ROUTE
Signup	POST	/api/signup/
Login	POST	/api/login/
Test Token	GET	/api/test-token/ (requires Authorization: Token <token>)
Ping	GET	/api/ping/
🏗️ 3. Folder Structure Diagram
PROJECT-GJ/
│
├── frontend/                      # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── LoginSignUp/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── auth.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                        # Django API app
│   ├── asgi.py
│   ├── serializers.py
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   └── wsgi.py
│
├── study_session/                 # Django project folder
│   ├── migrations/
│   │   └── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── .gitignore
├── manage.py
├── README.md                      # Root readme
├── requirements.txt
└── test.rest