<div align="center">

<img src="./public/verisearch-logo.png" alt="VeriSearch AI Logo" width="220" />

# VeriSearch AI — Frontend Client

**An intelligent, high-fidelity research dashboard and evidence verification interface.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646C9A?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)

</div>

---

## 📌 Overview

The **VeriSearch AI Frontend** is a modern single-page application (SPA) designed to provide users with an intuitive, deep-dive interface for autonomous research investigations. It communicates with the VeriSearch AI FastAPI backend to execute automated web searches, extract claims, perform fact verification, audit contradictory evidence, and visualize confidence metrics.

---

## ✨ Features

- 🔍 **Interactive Research Studio**: Submit natural-language research questions with real-time verification processing feedback.
- 📊 **Dynamic Evidence Alignment Matrix**: Interactive breakdown of extracted atomic claims classified as:
  - `SUPPORTED` (empirical consensus)
  - `PARTIALLY SUPPORTED` (mixed evidence / minor caveats)
  - `CONTRADICTED` (refuted claims)
  - `UNVERIFIED` (insufficient evidence)
- ⚖️ **Contradiction & Conflict Explorer**: Highlights conflicting assertions across independent sources with explanatory context.
- 🌐 **Source Credibility & Authority Explorer**: Inspect domain reputation, freshness, relevance score, and source snippets.
- 📈 **Confidence Gauge**: Visual breakdown calculated from 6 weighted metrics (quality, relevance, agreement, freshness, coverage, and claim certainty).
- 📑 **Comprehensive Synthesis Reports**: Formatted executive summaries and structured markdown dossiers.
- 💾 **Session History & Bookmarking**: Save research dossiers, view past queries, and filter historical sessions.
- 🔐 **Authentication System**: Secure session-based login, signup, and profile management.
- 📤 **One-Click Export**: Download reports as Markdown or print/export directly to PDF.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | [React 19](https://react.dev/) |
| **Build Tool & Dev Server** | [Vite 8](https://vitejs.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Styling & Design System**| [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## 📂 Project Structure

```text
frontend/
├── public/                     # Static brand assets, favicons, and SVG logos
│   ├── verisearch-logo.png
│   ├── verisearch-icon.png
│   └── ...
├── src/
│   ├── assets/                 # Component-level static media assets
│   ├── auth/                   # Authentication context, provider & useAuth hook
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   └── useAuth.js
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Badges, loaders, alerts, modals
│   │   ├── layout/             # AppLayout, Navbar, Sidebar, Footer
│   │   ├── research/           # Evidence alignment matrix, verdict badges, reports
│   │   └── ui/                 # Design system buttons, inputs, cards
│   ├── data/                   # Default schemas and seed data
│   ├── hooks/                  # Custom React hooks (theme, copy, export)
│   ├── pages/                  # Page routes
│   │   ├── Dashboard.jsx       # Overview metrics & quick research launcher
│   │   ├── Research.jsx        # Active investigation input & execution
│   │   ├── Results.jsx         # Full verification report & evidence analysis
│   │   ├── History.jsx         # Search and browse past investigations
│   │   ├── SavedResearch.jsx   # Pinned/bookmarked reports
│   │   ├── Sources.jsx         # Aggregated source directory & credibility index
│   │   ├── Settings.jsx        # User and platform settings
│   │   ├── Profile.jsx         # Researcher account profile
│   │   ├── Home.jsx            # Landing / marketing page
│   │   ├── HowItWorks.jsx      # Explanation of multi-agent pipeline
│   │   ├── Features.jsx        # Detailed feature breakdown
│   │   ├── Login.jsx           # Account sign-in
│   │   └── Signup.jsx          # New account registration
│   ├── services/               # API clients (`api.js`, endpoints)
│   ├── utils/                  # Text formatting, date parsing, helpers
│   ├── App.jsx                 # Routing configuration & route guards
│   ├── main.jsx                # Application DOM entry point
│   └── index.css               # Global Tailwind CSS definitions
├── .env                        # Local frontend environment variables
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node.js 20+ recommended)
- **npm**: `v9.0.0` or higher

### 1. Installation

From within the `autonomous-research-agent/frontend` directory:

```bash
npm install
```

### 2. Environment Configuration

Verify or create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
```

> **Note:** The backend should be running on `http://localhost:8000` to process live research queries.

### 3. Running Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:5173
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local development server with Vite HMR at `localhost:5173`. |
| `npm run build` | Bundles and minifies the production-ready application into `dist/`. |
| `npm run preview` | Locally serves the production build from `dist/` to preview performance. |
| `npm run lint` | Runs `oxlint` to perform high-speed static code quality checks. |

---

## 🗺️ Application Routing

The frontend utilizes **React Router v7** with route-based state management:

### Public Routes
- `/` — Root gateway (redirects to `/app/dashboard` if authenticated, otherwise `/login`)
- `/login` — User authentication portal
- `/signup` — Account registration
- `/home` — Product landing & overview
- `/how-it-works` — Explanation of evidence retrieval and agent reasoning
- `/features` — Feature showcase & trust tools

### Protected Dashboard Routes (`/app/*`)
- `/app/dashboard` — Platform overview, recent investigations, and quick research
- `/app/research` — Launch new autonomous fact-checking query
- `/app/results/:id` — Deep-dive evidence report, claims matrix, and synthesis
- `/app/history` — Paginated history of prior investigations
- `/app/saved` — Pinned and saved research items
- `/app/sources` — Source directory with credibility classifications
- `/app/settings` — API keys & application configuration
- `/app/profile` — Researcher profile settings & account details

---

## 🔗 Backend Connectivity

The frontend connects to the FastAPI backend service via Axios:

- **Research Ingestion**: `POST /api/research`
- **Report Retrieval**: `GET /api/research/:id`
- **History Exploration**: `GET /api/research?page=:page&limit=:limit`
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/signup`, `GET /api/auth/me`, `POST /api/auth/logout`
- **Health Check**: `GET /api/health`

---

## 📄 License

This frontend is part of the [VeriSearch AI](../../README.md) project and is licensed under the MIT License.
