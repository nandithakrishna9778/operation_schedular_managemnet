# 🏥 Operation Scheduler For Hospital Management

> A dynamic, real-time web-based operating-room scheduling system that replaces static timetables with an intelligent, Firebase-powered platform for hospitals.

---

##  Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Technology Stack](#3-technology-stack)
4. [System Modules](#4-system-modules)
5. [Features](#5-features)
6. [Project Structure](#6-project-structure)
7. [Database Schema](#7-database-schema)
8. [Firebase Security Rules](#8-firebase-security-rules)
9. [Setup & Installation](#9-setup--installation)
10. [Deployment](#10-deployment)
11. [Workflow & Execution](#11-workflow--execution)
12. [Logging Strategy](#12-logging-strategy)
13. [Optimisation Strategies](#13-optimisation-strategies)
14. [Test Cases](#14-test-cases)
15. [Contributing](#15-contributing)
16. [License](#16-license)

---

## 1. Project Overview

The **Operation Scheduler** is a web-based application that solves the logistical challenges hospitals face when assigning doctors to operating rooms (OTs). Traditional static schedules demand constant manual adjustments whenever room availability, doctor working hours, preferences, or OT capabilities change.

This system transforms that static timetable into a **dynamic, real-time model** that integrates multiple hospital scenarios based on live data. Every surgery is automatically paired with an assigned operating room and a confirmed operation time through the built-in booking mechanism.

### Key Capabilities

- Dynamic OT schedule creation and management
- Real-time additions, cancellations, postponements, and emergency re-scheduling
- Full procedure tracking — from pre-operative notes through to post-operative reports
- Role-based access for Admins and Users
- Complete audit logging of every system action

---

## 2. Problem Statement

Surgical scheduling is influenced by multiple variables simultaneously:

| Variable | Challenge |
|---|---|
| Room Availability | OTs may be occupied or under maintenance |
| Doctor Working Hours | Weekly hour limits must be respected |
| Doctor Preferences | Surgeons have specialised OT requirements |
| OT Capabilities | Not every room supports every procedure type |

Administrators currently rely on a **static timetable** with manual adjustments. This project replaces that model with a workable dynamic system that integrates multiple scheduling scenarios within the hospital, driven by specific hospital data.

Each scheduled procedure must capture:

- Date and time of surgery
- Operating Theater (OT) ID
- Type of anesthesia and name of the anesthesiologist
- Primary surgeon (and assistant surgeon, if applicable)
- Nurses assigned to the procedure
- Pre- and post-operative event tracking
- Attached surgical reports (patient surgery charts, operative reports)
- Remarks from operating room doctors
- Unique drugs, instruments, and materials required

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5 | Page structure and semantic markup |
| Frontend | CSS3 | Styling, layout, and responsive design |
| Frontend | JavaScript (ES6+) | Client-side logic and UI interactivity |
| Backend / Database | Firebase Authentication | User sign-up, login, and session management |
| Backend / Database | Cloud Firestore | Real-time NoSQL database |
| Hosting | Firebase Hosting | CDN-backed static site deployment |
| Logging | Custom JS Logger | Action logging to console and Firestore |
| Version Control | Git / GitHub | Source code management |

---

## 4. System Modules

The application is split into two primary user-facing modules plus shared infrastructure.

### 4.1 Admin Module

| Function | Description |
|---|---|
| Login | Secure credential-based authentication |
| Manage Doctor Details | Add, update, and remove doctor records |
| Manage Patient Details | Full CRUD for patient information |
| Post Operation Schedule Details | Create, edit, and finalise OT schedules |

### 4.2 User Module

| Function | Description |
|---|---|
| Register | Create a new user account |
| Login | Access the system with registered credentials |
| View Doctor Details | Browse all available doctors and their specialisations |
| View Surgical Information | Inspect current and upcoming OT schedules |

### 4.3 Shared Infrastructure Modules

| Module | File | Responsibility |
|---|---|---|
| Firebase Config | `config.js` | Initialises Firebase app, Auth, and Firestore |
| Logger | `logger.js` | Logs every action at INFO / WARN / ERROR / DEBUG level |
| Auth Service | `auth.js` | Handles registration, login, logout, role checks |
| Admin Service | `admin.js` | All admin CRUD operations and dashboard stats |
| User Service | `user.js` | Read-only access to doctors and schedules |

---

## 5. Features

### 5.1 Admin Features

-  Secure login with role verification
-  Add, update, and delete doctor records (name, specialisation, contact, working hours)
-  Add, update, and delete patient records (name, DOB, medical ID)
-  Create a full OT schedule — assign surgeon, assistant, anesthesiologist, nurses, OT room, date/time
-  Specify required drugs, instruments, and materials per procedure
-  Add pre-operative and post-operative notes
-  Attach surgical reports and operative transcriptions
-  Add doctor remarks to any schedule
-  Cancel or postpone a schedule (status updates automatically)
-  Mark a schedule as completed after surgery
-  View historical and upcoming OT schedules
-  Dashboard with statistics — total doctors, patients, active/completed/cancelled schedules

### 5.2 User Features

-  Register for a new account
-  Secure login
-  Browse all doctors and their specialisations
-  View current and upcoming OT schedules
-  Read-only access — no write permissions

---

## 6. Project Structure

```
operation-scheduler/
│
├── public/                          # All client-side files
│   ├── index.html                   # Landing / home page
│   ├── admin.html                   # Admin dashboard
│   ├── user.html                    # User dashboard
│   │
│   ├── css/
│   │   └── styles.css               # Global stylesheet (responsive)
│   │
│   └── js/
│       ├── config.js                # Firebase project configuration
│       ├── logger.js                # Logging utility (INFO/WARN/ERROR/DEBUG)
│       ├── auth.js                  # Authentication service
│       ├── admin.js                 # Admin CRUD & dashboard logic
│       └── user.js                  # User read-only logic
│
├── firebase.json                    # Firebase hosting + Firestore config
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Composite index definitions
├── package.json                     # NPM metadata & scripts
├── .gitignore                       # Files excluded from Git
└── README.md                        # This file
```

### JavaScript Module Breakdown

```
config.js   →  Initialises Firebase. Exports auth & db references.
logger.js   →  Singleton Logger class. Writes to console + Firestore 'logs'.
auth.js     →  AuthService class. register() / login() / logout() / hasRole().
admin.js    →  AdminService class. Doctor / Patient / Schedule CRUD + stats.
user.js     →  UserService class. Read-only getDoctors() / getSchedules().
```

---

## 7. Database Schema

All data is stored in **Cloud Firestore**. The database is organised into five collections.

### 7.1 `users`

| Field | Type | Description |
|---|---|---|
| `uid` | string | Unique ID (matches Firebase Auth UID) |
| `email` | string | Registered email |
| `name` | string | Full name |
| `role` | string | `admin` or `user` |
| `createdAt` | timestamp | Account creation time |

### 7.2 `doctors`

| Field | Type | Description |
|---|---|---|
| `doctorId` | string | Unique doctor identifier |
| `name` | string | Full name |
| `specialisation` | string | Medical specialisation |
| `email` | string | Contact email |
| `phone` | string | Contact phone |
| `workingHours` | object | Weekly availability map (e.g. `{ monday: "09:00–17:00" }`) |
| `createdAt` | timestamp | Record creation time |

### 7.3 `patients`

| Field | Type | Description |
|---|---|---|
| `patientId` | string | Unique patient identifier |
| `name` | string | Full name |
| `dob` | string | Date of birth (`YYYY-MM-DD`) |
| `contact` | string | Phone or email |
| `medicalID` | string | Hospital medical record number |
| `createdAt` | timestamp | Record creation time |

### 7.4 `schedules`

This is the core collection. Each document represents one planned or completed operation.

| Field | Type | Description |
|---|---|---|
| `scheduleId` | string | Auto-generated schedule ID |
| `date` | string | Surgery date (`YYYY-MM-DD`) |
| `time` | string | Surgery time (`HH:MM`) |
| `otId` | string | Operating Theater ID |
| `patientId` | string | FK → patients |
| `primarySurgeon` | string | FK → doctors |
| `assistantSurgeon` | string | FK → doctors (nullable) |
| `anesthesiologist` | string | Name of the anesthesiologist |
| `anesthesiaType` | string | `General`, `Local`, or `Regional` |
| `nurses` | array | Names of assigned nurses |
| `purpose` | string | Reason or procedure type |
| `materials` | array | Required drugs, instruments, and materials |
| `preOpNotes` | string | Pre-operative notes |
| `postOpNotes` | string | Post-operative notes |
| `reports` | array | Attached report file URLs or references |
| `remarks` | string | OT doctor remarks |
| `status` | string | `scheduled`, `completed`, `cancelled`, or `postponed` |
| `createdAt` | timestamp | Record creation time |

### 7.5 `logs`

| Field | Type | Description |
|---|---|---|
| `logId` | string | Auto-generated log ID |
| `level` | string | `INFO`, `WARN`, `ERROR`, or `DEBUG` |
| `message` | string | Human-readable description |
| `data` | object | Contextual payload |
| `userId` | string | ID of the acting user (if authenticated) |
| `timestamp` | string | ISO-8601 timestamp |

---

## 8. Firebase Security Rules

Access is enforced server-side through Firestore security rules.

| Collection | Admin | User | Unauthenticated |
|---|---|---|---|
| `users` | Read / Write | Read (own document only) |  None |
| `doctors` | Full CRUD | Read only |  None |
| `patients` | Full CRUD | Read only |  None |
| `schedules` | Full CRUD | Read only |  None |
| `logs` | Read only |  None |  None |

Rules are defined in `firestore.rules` and deployed with:

```bash
firebase deploy --only firestore:rules
```

---

## 9. Setup & Installation

### 9.1 Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | v14+ | https://nodejs.org |
| Firebase CLI | Latest | `npm install -g firebase-tools` |
| Git | Any | https://git-scm.com |
| Firebase Account | — | https://console.firebase.google.com |

### 9.2 Step-by-Step

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd operation-scheduler

# 2. Log in to Firebase
firebase login

# 3. Initialise Firebase in the project (choose Firestore + Hosting)
firebase init
# → Public directory: public
# → Single-page app: No
```

**In the Firebase Console:**

1. **Authentication** → Sign-in method → Enable **Email / Password**
2. **Firestore Database** → Create database (production mode, choose a region)
3. **Project Settings** → Your Apps → Add **Web App** → copy the `firebaseConfig` object
4. Paste the config into `public/js/config.js`

**Create the first Admin user:**

1. Firebase Console → Authentication → **Add User** (email + password)
2. Copy the generated **UID**
3. Firestore → `users` collection → Add document with that UID as the document ID
4. Set fields: `uid`, `email`, `name`, `role: "admin"`, `createdAt`

```bash
# 5. Deploy security rules
firebase deploy --only firestore:rules

# 6. Deploy indexes
firebase deploy --only firestore:indexes
```

---

## 10. Deployment

### 10.1 Local Development Server

```bash
firebase serve
# → Open http://localhost:5000
```

### 10.2 Production Deployment

```bash
# Deploy everything (hosting + rules + indexes)
firebase deploy

# Or deploy individually:
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

After deployment Firebase prints your live URL:

```
✔  Deploy complete!
   Hosting URL: https://your-project-id.web.app
```

### 10.3 Post-Deployment Checklist

- [ ] Change the default admin password immediately
- [ ] Verify security rules are active (try accessing data without login)
- [ ] Set up a Firebase **budget alert** to avoid unexpected charges
- [ ] Enable Firebase **App Check** (optional, recommended for production)
- [ ] Configure **Firestore backups** (Firebase Console → Firestore → Backups)

---

## 11. Workflow & Execution

### 11.1 Admin Workflow

```
Login
  │
  ├─► Doctor Management ──► Add / Edit / Delete doctors
  │
  ├─► Patient Management ──► Add / Edit / Delete patients
  │
  ├─► Schedule Management
  │     │
  │     ├─► Create Schedule
  │     │     ├─ Select patient
  │     │     ├─ Assign primary surgeon (+ optional assistant)
  │     │     ├─ Set date, time, and OT ID
  │     │     ├─ Choose anesthesia type + anesthesiologist
  │     │     ├─ List nurses
  │     │     ├─ Specify required materials
  │     │     └─ Add pre-op notes
  │     │
  │     ├─► Update Schedule ──► Edit any field; attach reports; add remarks
  │     ├─► Cancel / Postpone ──► Status updates automatically
  │     └─► Complete Schedule ──► Add post-op notes + final reports
  │
  └─► Dashboard ──► View live statistics
```

### 11.2 User Workflow

```
Register ──► Login
               │
               ├─► View Doctors ──► Browse names & specialisations
               └─► View Schedules ──► See current & upcoming OT schedules
```

---

## 12. Logging Strategy

Every action performed by the application is logged automatically through `logger.js`.

### Log Levels

| Level | When It Is Used |
|---|---|
| `INFO` | Successful operations — login, CRUD completions, page views |
| `WARN` | Non-critical issues — duplicate record attempts, unusual inputs |
| `ERROR` | Failures — authentication errors, database write failures, exceptions |
| `DEBUG` | Developer diagnostics — intermediate values, query details |

### Log Entry Structure

```javascript
{
  level:     "INFO",                // Severity
  message:   "Doctor added",       // Human-readable description
  data:      { doctorId: "..." },  // Contextual payload
  userId:   "abc123",             // Acting user (if authenticated)
  timestamp: "2026-02-01T10:30:00Z"
}
```

### Where Logs Are Stored

| Destination | Purpose |
|---|---|
| Browser Console | Instant feedback during development |
| Firestore `logs` collection | Persistent audit trail; queryable by admins |
| Exportable as JSON | Offline analysis via `logger.downloadLogs()` |

---

## 13. Optimisation Strategies

### 13.1 Code Level

- **Modular service classes** — each file owns a single responsibility (Auth, Admin, User, Logger)
- **Consistent async/await with try-catch** — every Firestore call is wrapped; no unhandled rejections
- **Batch DOM updates** — data is rendered via template literals in a single innerHTML pass
- **Input validation before writes** — invalid data is caught client-side before hitting Firestore

### 13.2 Architecture Level

- **Serverless Firebase backend** — zero server maintenance; auto-scales with traffic
- **CDN-hosted frontend** — Firebase Hosting delivers static files from the nearest edge location globally
- **Composite Firestore indexes** — complex queries (e.g. schedules filtered by status + date) run efficiently
- **Data denormalisation** — schedule documents store surgeon and patient names alongside their IDs, avoiding extra reads at render time

### 13.3 Database Level

- **Indexed composite queries** on `schedules` (status + date, doctorId + date)
- **Server-side security rules** — unauthorised reads are blocked before data leaves Firestore
- **Structured logs collection** with an indexed `timestamp` field for fast range queries

---

## 14. Test Cases

| # | Test Case | Module | Expected Result |
|---|---|---|---|
| 1 | Admin login with valid credentials | Auth | Dashboard loads successfully |
| 2 | Admin login with wrong password | Auth | Error message is displayed |
| 3 | User registration with all fields | Auth | Account created; login works |
| 4 | User registration with missing email | Auth | Validation error is shown |
| 5 | Add a new doctor (all fields filled) | Admin | Doctor appears in the list |
| 6 | Update a doctor's specialisation | Admin | Change is saved and visible |
| 7 | Delete a doctor record | Admin | Doctor is removed from the list |
| 8 | Add a new patient record | Admin | Patient is saved successfully |
| 9 | Create a full OT schedule | Admin | Status = `scheduled` |
| 10 | Cancel an existing schedule | Admin | Status changes to `cancelled` |
| 11 | Postpone a schedule | Admin | Status changes to `postponed` |
| 12 | Complete a schedule with post-op notes | Admin | Status = `completed`; notes saved |
| 13 | User views the doctor list | User | All doctors are displayed |
| 14 | User views current OT schedules | User | Schedules render correctly |
| 15 | Unauthenticated access to admin page | Security | Redirected to login |
| 16 | User tries to write to `doctors` | Security | Write is denied by rules |
| 17 | Verify all actions produce log entries | Logging | Logs appear in Firestore & console |
| 18 | Resize browser to mobile width | UI/UX | Layout adapts without overflow |

---

## 15. Contributing

1. **Fork** the repository on GitHub
2. Create a feature branch

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit

   ```bash
   git add .
   git commit -m "feat: short description of your change"
   ```

4. Push to your fork

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a **Pull Request** against the `main` branch

### Coding Standards

- Use `const` / `let` — never `var`
- Always `await` Firestore calls inside `try / catch`
- Log every significant action with `logger.info()` or `logger.error()`
- Keep each service class focused on one domain (Auth, Admin, User)

---

## 16. License

This project is for education purpose

---

> **📌 Quick reminder** — keep this repository **public** on GitHub so reviewers can inspect the code at any time.
