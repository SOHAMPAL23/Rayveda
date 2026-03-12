# Rayeva AI System: Premium Sustainability Engine

**Status:** ✅ Production Ready  
**Runtime:** Node.js (Vercel Serverless)  
**Database:** Neon (PostgreSQL)  
**AI Model:** OpenAI GPT-4o-mini  

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Installation & Setup](#installation--setup)
8. [Deployment](#deployment)

---

## Project Overview

**Rayeva AI System** is a sophisticated backend engine designed for eco-conscious commerce platforms. It automates the complex task of product categorization and environmental impact reporting using state-of-the-art Generative AI. 

Built with **PostgreSQL (Neon)** for reliability and **OpenAI** for intelligence, Rayeva provides a seamless bridge between commerce and sustainability.

---

## Key Features

*   🏷️ **AI Auto-Categorization**: Generates standardized categories, subcategories, SEO tags, and sustainability filters from raw product descriptions.
*   🌍 **AI Impact Reporting**: Calculates quantifiable environmental metrics (plastic saved, carbon avoided) and generates compelling impact narratives.
*   📜 **Unified Interaction Logging**: Every AI request and response is logged in detail for observability, auditing, and fine-tuning.
*   🛡️ **Strict JSON Output**: Leveraging OpenAI's `json_object` format to guarantee 100% parseable structured data.
*   🔄 **Resilient Design**: Built-in retry logic and local "logic fallbacks" ensure the system stays operational even if AI quota is reached.
*   🎨 **Interactive Dashboard**: A premium glassmorphism frontend for real-time testing and visualization of AI results.

---

## Tech Stack

### Backend & AI
- **Node.js 18+** & **Express.js**
- **OpenAI SDK**: GPT-4o-mini Integration
- **Joi**: Strict data validation for AI outputs

### Data Persistance
- **Neon DB**: Serverless PostgreSQL
- **pg (node-postgres)**: Direct SQL connection management
- **Connection Pooling**: Optimized for serverless environments

### Frontend (Dashboard)
- **Vanilla JS/HTML/CSS**: Maximum performance & compatibility
- **Glassmorphism UI**: High-end modern aesthetic
- **Lucide Icons**: Crisp vector iconography

---

## System Architecture

The project follows a clean **Controller-Service-Library** pattern, separating AI reasoning from core business logic:

```bash
Rayveda/
├── api/          # Express Routes (Controller Layer)
├── services/     # Business Logic (Orchestration Layer)
├── lib/          # AI Clients & Prompt Engineering
├── config/       # Database & Security Configuration
├── public/       # Premium UI Dashboard (Frontend)
└── utils/        # Mathematical Calculators & Error Handlers
```

---

## Database Schema

Rayeva uses a normalized PostgreSQL schema optimized for speed and auditing:

### 1. `ai_category_reports`
Stores processed product taxonomy.
- `id`: Unique Identifier
- `product_name`: Original name
- `category`: AI-assigned primary category
- `tags`: Generated SEO keywords (Array)
- `sustainability_filters`: Eco-verified filters (Array)

### 2. `ai_impact_reports`
Stores quantifiable environmental savings.
- `id`: Unique Identifier
- `plastic_saved_grams`: Weight of plastic prevented
- `carbon_avoided_kg`: CO2 emissions saved
- `impact_statement`: AI-generated narrative

### 3. `ai_interaction_logs`
Centralized auditing for AI quality.
- `module_name`: Categorization or Impact
- `prompt_content`: Exact text sent to AI
- `response_content`: Raw JSON returned by AI
- `processing_time_ms`: Performance metric

---

## API Documentation

### 1. AI Categorizer
`POST /api/category`  
Analyze product features and generate eco-taxonomy.

**Request:**
```json
{
  "product_name": "Bamboo Straw Set",
  "description": "100% natural organic bamboo straws with cleaning brush."
}
```

### 2. AI Impact Report
`POST /api/impact`  
Calculate environmental benefits of a specific purchase.

**Request:**
```json
{
  "product": "Stainless Steel Bottle",
  "quantity": 25
}
```

### 3. Health Check
`GET /api/health`  
Monitor system status and database connectivity.

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- Neon DB Project (PostgreSQL)
- OpenAI API Key

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/rayeva-ai-system
npm install
```

### 2. Configure Environments
Create a `.env` file based on `.env.example`:
```env
NEON_DB_URL=postgresql://user:pass@ep-host.aws.neon.tech/neondb?sslmode=verify-full
OPENAI_API_KEY=sk-proj-xxxx
PORT=3000
```

### 3. Initialize & Run
```bash
npm run dev
```
*The database tables will be automatically initialized on the first run.*

---

## Deployment

### Vercel (Recommended)
This project is pre-configured for **Vercel Serverless Functions**.

1.  Login to Vercel and import your repository.
2.  Set `NEON_DB_URL` and `OPENAI_API_KEY` in **Environment Variables**.
3.  Deploy!

**Vercel Config Highlights:**
- `vercel.json` routes all traffic through `index.js`.
- Express serves the `public/` directory for the frontend.
- Database connections use a singleton pool to prevent connection leaks.

---

Built with ❤️ for a Sustainable Future.