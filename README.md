# CareerConnect - Job & Internship Portal

A full-stack Job & Internship Portal built with Next.js, FastAPI, and MySQL.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, SQLAlchemy, Pydantic
- **Database:** MySQL (managed via MySQL Workbench)
- **Auth:** JWT (jose) + bcrypt password hashing

## Prerequisites

- Python 3.9+
- Node.js 18+
- MySQL 8.0+
- MySQL Workbench

## Setup Instructions

### 1. Database Setup

Open MySQL Workbench and run the SQL script:

```sql
SOURCE database/setup.sql;
```

Or copy-paste the contents of `database/setup.sql` into MySQL Workbench and execute it.

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Edit .env with your MySQL credentials
# DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/careerconnect

# Start the server
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: http://localhost:3000

## Project Structure

```
CareerConnect/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, DB, Security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routes/        # API endpoints
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app
│   ├── uploads/           # File uploads
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   └── lib/           # API client
│   ├── package.json
│   └── tailwind.config.js
├── database/
│   └── setup.sql          # MySQL schema
└── README.md
```

## Features

### Students
- Register/Login with JWT authentication
- Create and update professional profile
- Upload/manage resumes (PDF, DOC, DOCX)
- Browse, search, and filter jobs
- Apply to jobs with cover letter
- Track application status
- Save/unsave jobs
- View interview details
- Receive notifications

### Companies
- Register/Login with JWT authentication
- Create and update company profile
- Create/edit/delete job posts
- Manage job status (Draft/Active/Closed)
- View and manage applicants
- Update application statuses
- Schedule interviews
- View analytics dashboard

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/student | Register student |
| POST | /api/auth/register/company | Register company |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/jobs | List jobs |
| POST | /api/jobs | Create job |
| GET | /api/jobs/{id} | Get job details |
| POST | /api/applications | Apply to job |
| PATCH | /api/applications/{id}/status | Update status |
| POST | /api/interviews | Schedule interview |
| GET | /api/notifications | Get notifications |
