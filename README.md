HRMS – Employee & Team Management System

A simple Human Resource Management System with:

- Backend: Node.js, Express, Sequelize ORM, PostgreSQL (Neon)

- Frontend: React (class components)

- Authentication: JWT-based login

- Features:

  - Manage Employees (Create, Edit, Delete)

  - Manage Teams (Create, Edit, Delete)

  - Assign / Unassign Employees to Teams

  - View teams for each employee

  - Logs stored for audit purposes

📁 Project Structure

HRMS/
├── backend/
│ ├── node_modules/
│ ├── package.json
│ ├── package-lock.json
│ ├── .env
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── authController.js
│ │ │ ├── employeeController.js
│ │ │ └── teamController.js
│ │ ├── middlewares/
│ │ │ └── authMiddleware.js
│ │ ├── models/
│ │ │ ├── employee.js
│ │ │ ├── employeeTeam.js
│ │ │ ├── index.js
│ │ │ ├── log.js
│ │ │ ├── organisation.js
│ │ │ ├── team.js
│ │ │ └── user.js
│ │ ├── routes/
│ │ │ ├── auth.js
│ │ │ ├── employees.js
│ │ │ └── teams.js
│ │ ├── db.js
│ │ ├── index.js
│ │ ├── seed.js
│ │ └── seedData.js
│ └── README.md (optional)

└── frontend/
├── node_modules/
├── public/
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── src/
├── components/
│ ├── EmployeeForm.js
│ └── TeamForm.js
├── pages/
│ ├── Dashboard.js
│ ├── Employees.js
│ ├── Login.js
│ ├── RegisterOrg.js
│ └── Teams.js
├── App.js
├── App.css
├── App.test.js
├── index.js
├── index.css
├── logo.svg
├── reportWebVitals.js
└── setupTests.js

📘 3. Folder-by-Folder Explanation

🔙 Backend

src/controllers/

- authController.js → Login,Create Org, JWT creation

- employeeController.js → Employee CRUD, list, detail, employeeTeams

- teamController.js → Team CRUD, assign/unassign employees

src/middlewares/

- authMiddleware.js → Verify JWT, attach user to request

src/models/

- user.js → Users table

- organisation.js → Company record

- employee.js → Employees table

- team.js → Teams table

- employeeTeam.js → Many-to-many join table

- log.js → Logs audit actions

- index.js → All associations defined

src/routes/

- auth.js → POST /login, POST /register-org

- employees.js → /employees CRUD

- teams.js → /teams CRUD + assign/unassign

Other files:

- db.js → Sequelize database connection

- seed.js → Create sample data

- .env → Secrets (DATABASE_URL, JWT_SECRET)

🎨 Frontend

src/components/

- EmployeeForm.js → Create/Edit employee

- TeamForm.js → Create/Edit team

src/pages/

- Login.js → Login page

- RegisterOrg.js → Register Organisation

- Dashboard.js → Overview

- Employees.js → Employee list + Edit + Delete

- Teams.js → Team list + Edit + Delete

Other files:

- App.js → Routing

- index.js → React entry point

- App.css / index.css → Styling

🚀 Backend Setup

1️⃣ Install Dependencies

    - cd hrms/backend
    - npm install

2️⃣ Create .env File

    - Inside backend/.env:

        PORT=5000

        # Use your exact Neon connection string
        DATABASE_URL=postgresql://USER:PASSWORD@NEON_HOST/neondb?sslmode=require&channel_binding=require

        JWT_SECRET=your_jwt_secret_here

    ⚠️ Get your correct URL from Neon Dashboard → Connection Details → Node.js connection string.

3️⃣ Sequelize Database Setup

        Backend uses Sequelize with SSL enabled for Neon.

        db.js automatically reads .env and connects to the database.

        Tables created:

           - users

           - employees

           - teams

           - employee_teams

           - organisations

           - logs

4️⃣ Start Backend Server

        bash: npm run start

        If successful you will see:

            👉 DATABASE_URL from env: ...
            ✅ Connected to PostgreSQL via Sequelize
            🚀 Server running at http://localhost:5000

💻 Frontend Setup

1️⃣ Install dependencies

    - cd hrms/frontend
    - npm install

2️⃣ Start frontend

    - npm start

    The app runs at: http://localhost:3000

✨ Features & API Flow

🔐 Authentication

Login API: POST /api/login
body: {
"email": "admin@example.com",
"password": "password"
}

👥 Employees Module

Endpoints:

       - GET /api/employees — list all employees

       - POST /api/employees — create employee

       - PUT /api/employees/:id — update employee

       - DELETE /api/employees/:id — delete employee

       - GET /api/employees/:id/teams — get teams for employee

UI Features:

       - Add / Edit employee using <EmployeeForm />

       - Delete employee

       - View assigned teams

       - Assign or remove teams from employee

👨‍👩‍👧 Teams Module

Endpoints:

       - GET /api/teams — list all teams (includes employeeCount)

       - POST /api/teams — create team

       - PUT /api/teams/:id — update team

       - DELETE /api/teams/:id — delete team

       - POST /api/teams/:teamId/assign

       - DELETE /api/teams/:teamId/unassign

UI Features:

       - Add / Edit team using <TeamForm />

       - Delete team

       - View how many employees belong to each team

🗄️ Database Schema (ER Diagram)

erDiagram

    ORGANISATIONS {
      int id PK
      string name
      timestamp created_at
    }

    USERS {
      int id PK
      int organisation_id FK
      string email
      string password_hash
      string name
      timestamp created_at
    }

    EMPLOYEES {
      int id PK
      int organisation_id FK
      string first_name
      string last_name
      string email
      string phone
      timestamp created_at
    }

    TEAMS {
      int id PK
      int organisation_id FK
      string name
      string description
      timestamp created_at
    }

    EMPLOYEE_TEAMS {
      int id PK
      int employee_id FK
      int team_id FK
      timestamp assigned_at
    }

    LOGS {
      int id PK
      int organisation_id FK
      int user_id FK
      string action
      jsonb meta
      timestamp timestamp
    }

    ORGANISATIONS ||--o{ USERS : "has many"
    ORGANISATIONS ||--o{ EMPLOYEES : "has many"
    ORGANISATIONS ||--o{ TEAMS : "has many"
    ORGANISATIONS ||--o{ LOGS : "has many"

    USERS ||--o{ LOGS : "writes"

    EMPLOYEES }o--o{ TEAMS : "many-to-many"
    EMPLOYEES ||--o{ EMPLOYEE_TEAMS : ""
    TEAMS ||--o{ EMPLOYEE_TEAMS : ""
