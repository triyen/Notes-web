"""# Notes Web Application 📝

A full-stack, responsive web application designed to manage personal notes and custom categories. Built with a modern architecture that completely decouples a React frontend from a robust Spring Boot REST API, leveraging secure cloud infrastructure and database persistence.

## 🚀 Live Demo
* **Frontend (Vercel):** notes-jz27bc1ym-francisco-note-app.vercel.app
* **Backend API (Render):** https://notes-web-ykfv.onrender.com

---

## 🔒 Security & Authentication
The application features a secure user authentication system built with **Spring Security**. 
* **Password Hashing:** Passwords are encrypted before database persistence using the industry-standard **BCrypt** algorithm.
* **CORS Policy:** Cross-Origin Resource Sharing is explicitly configured on the backend to allow secure communication with the frontend hosted on Vercel.
* **Dynamic Signup:** Users can dynamically register a new account from the user interface, which immediately safely hashes and stores their credentials in the cloud database.

### 🔑 Evaluator Access (Default Credentials)
A database seeder automatically initializes a secure administrator user on startup for testing purposes:
* **Username:** `admin`
* **Password:** `admin123`

---

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite environment)
* **Axios** (Asynchronous HTTP requests)
* **CSS3** (Responsive application layout)

### Backend
* **Java 21** & **Spring Boot 3.x**
* **Spring Data JPA** (Object-Relational Mapping)
* **Spring Security** (Authentication and BCrypt password encoding)
* **Maven** (Dependency and project lifecycle management)
* **Docker** (Containerization for seamless deployment)

### Database & Cloud Infrastructure
* **PostgreSQL:** Cloud database hosted via Neon.tech.
* **Render:** Backend REST API deployed within a multi-stage Docker container.
* **Vercel:** Optimized production hosting for the React single-page application.

---

## 📂 Project Structure

This repository is structured as a monorepo for easier management and evaluation:
Salida de código
Code executed successfully!
```text
├── frontend/                 # React frontend web application
│   ├── src/
│   │   ├── services/api.js   # Production API configurations
│   │   └── App.jsx           # Application views and logic
└── notes-app/                # Spring Boot REST API backend
    ├── src/main/java/...     # Java packages (Controllers, Models, Repositories, Config)
    ├── src/main/resources/   # Environment properties (application.properties)
    └── Dockerfile            # Production multi-stage Docker build script

⚙️ Local Setup Guide
If you wish to run this project locally, ensure you have Node.js (v18+), Java JDK 21, and Maven installed.

1. Clone the repository
Bash
git clone [https://github.com/triyen/Notes-web.git](https://github.com/triyen/Notes-web.git)
cd Notes-web
2. Run the Backend (Spring Boot)
Open a terminal inside the notes-app folder:

Bash
cd notes-app
./mvnw spring-boot:run
The server will boot locally at http://localhost:8080.

3. Run the Frontend (React)
Open a separate terminal inside the frontend folder:

Bash
cd frontend
npm install
npm run dev
The web application will be accessible at http://localhost:5173.

Developed as an advanced programming university project. 🎓"""
