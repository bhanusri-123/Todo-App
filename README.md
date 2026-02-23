# Taskery — Full-Stack Todo Application

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![H2](https://img.shields.io/badge/H2-In--Memory_DB-blue?style=for-the-badge&logo=databricks&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> A full-stack Todo application built with **Spring Boot** (backend REST API) and **React** (frontend UI), using an **H2 in-memory database** with JPA/Hibernate.

---

## 🎬 Demo

> Open `todo-app-demo.html` in any browser to watch an animated walkthrough of the app — no setup required.

The demo showcases:
- ✅ Adding a new task with live typing animation
- ✅ Marking a task as complete with checkbox animation
- ✅ Filtering tasks (All / In Progress / Completed)
- ✅ Deleting a task with slide-out animation
- ✅ Live stats and progress ring updating in real time

---

## 📸 Features

| Feature | Description |
|---|---|
| ➕ Add Task | Create todos with a title (required) and optional description |
| ✅ Complete/Undo | Toggle completion status with animated checkbox |
| ✏️ Inline Edit | Edit title and description directly on the card |
| 🗑️ Delete | Remove todos with smooth slide-out animation |
| 🔍 Filter | Filter by All / In Progress / Completed |
| 📊 Live Stats | Total, active count and progress ring update in real time |
| 🔔 Toasts | Success/error notifications on every action |
| 📱 Responsive | Collapses gracefully to single column on mobile |

---

## 🏗️ Project Structure

```
todo-app/
├── backend/                          
│   ├── src/main/java/com/todo/app/
│   │   ├── TodoApplication.java      
│   │   ├── controller/
│   │   │   └── TodoController.java   
│   │   ├── service/
│   │   │   └── TodoService.java     
│   │   ├── repository/
│   │   │   └── TodoRepository.java   
│   │   ├── model/
│   │   │   └── Todo.java             
│   │   ├── dto/
│   │   │   └── TodoDto.java          
│   │   └── exception/
│   │       ├── ResourceNotFoundException.java
│   │       └── GlobalExceptionHandler.java
│   ├── src/main/resources/
│   │   └── application.properties    
│   └── pom.xml                       
│
├── frontend/                         
│   ├── src/
│   │   ├── main.jsx                 
│   │   └── App.jsx                   
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── todo-app-demo.html                
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

| Tool | Version | Download |
|---|---|---|
| Java | 17+ | https://adoptium.net |
| Node.js | 18+ | https://nodejs.org |
| Maven | 3.8+ | https://maven.apache.org |

Verify installations:
```bash
java -version
node -v
mvn -version
```

---

### ▶️ Run the Backend

```bash
cd backend
mvn spring-boot:run
```

✅ Server starts at **http://localhost:8080**

On first run, Maven will download dependencies (~2-3 minutes). You'll see:
```
Started TodoApplication in X.XXX seconds
```

> **H2 Console** (browse the database): http://localhost:8080/h2-console
> - JDBC URL: `jdbc:h2:mem:tododb`
> - Username: `sa` | Password: *(leave blank)*

---

### ▶️ Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ App opens at **http://localhost:3000**

---

### 🔌 Connect Frontend to Backend

In `frontend/src/App.jsx`, change:
```js
const USE_MOCK = true;
```
to:
```js
const USE_MOCK = false;
```
Save — Vite hot-reloads instantly, no restart needed.

---

## 📡 REST API Reference

Base URL: `http://localhost:8080/api/todos`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/todos` | Create a new todo |
| `GET` | `/api/todos` | Get all todos |
| `GET` | `/api/todos?completed=true` | Filter by completed status |
| `GET` | `/api/todos?completed=false` | Filter by active status |
| `GET` | `/api/todos/{id}` | Get a single todo by ID |
| `PUT` | `/api/todos/{id}` | Update title / description / completed |
| `DELETE` | `/api/todos/{id}` | Delete a todo |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.2 | Application framework |
| Spring Data JPA | Database ORM |
| Hibernate 6 | JPA implementation |
| H2 Database | In-memory database |
| Lombok | Boilerplate reduction |
| Spring Validation | Request validation (`@NotBlank`) |
| Maven | Dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Hooks (useState, useEffect, useCallback) | State management |
| Fetch API | HTTP requests to backend |
| Playfair Display + Cabinet Grotesk | Typography |
