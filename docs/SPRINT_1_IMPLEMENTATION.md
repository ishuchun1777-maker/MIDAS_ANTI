# MIDAS Sprint 1 Implementation Prompt

You are the lead engineering agent responsible for implementing the MIDAS platform.

Before writing any code:

1. Read all documentation inside `/docs`
2. Read all rules inside `/agents`
3. Validate repository structure

You must follow:

- modular monolith architecture
- repository structure
- API contract rules
- security rules
- definition of done

Do NOT simplify features.

Do NOT remove fields defined in the data model.

---

# Sprint 1 Goal

Create the platform foundation.

At the end of Sprint 1 the system must have:

- working backend
- working web dashboard shell
- working telegram mini app shell
- working telegram bot
- authentication system
- role system
- company system
- profile system

---

# Repository Structure Validation

Ensure the repository follows:

apps/
- api
- web
- miniapp
- bot

packages/
- ui
- types
- utils

docs/
agents/

If structure is missing create it.

---

# Backend Implementation

Location:

apps/api

Use:

FastAPI
PostgreSQL / Supabase
Alembic migrations

Create base modular structure:

app/
modules/
core/
schemas/
models/
services/
routers/

---

# Core Backend Setup

Implement:

1. FastAPI app initialization
2. environment config
3. database connection
4. alembic migrations
5. base error handling
6. logging system

---

# Authentication System

Implement:

- login
- telegram login
- token authentication

Entities:

User  
UserRole  

Endpoints:

POST /auth/login  
POST /auth/telegram  
GET /users/me  

---

# Role System

Roles:

buyer  
seller  
specialist  
agency  
admin  

Users may have multiple roles.

---

# Company System

Entities:

Company  
CompanyMember  

Endpoints:

POST /companies  
GET /companies/me  
POST /companies/{id}/members  

---

# Profile System

Implement:

BuyerProfile  
SellerProfile  
SpecialistProfile  

Endpoints:

POST /profiles/buyer  
POST /profiles/seller  
POST /profiles/specialist  

GET /profiles/me  

---

# Web Platform

Location:

apps/web

Use:

React
Vite
Tailwind
shadcn/ui

Create:

Dashboard layout

Sidebar navigation

Routes:

/dashboard  
/discovery  
/campaigns  
/inventory  
/offers  
/deals  
/messages  
/profile  

Follow:

docs/DESIGN_SYSTEM.md  
docs/UX_PRINCIPLES.md  
docs/UI_COMPONENT_MAP.md  
docs/SCREEN_MAP.md  

---

# Telegram Mini App

Location:

apps/miniapp

Implement:

Telegram WebApp initialization

Basic routes:

dashboard  
discovery  
offers  
deals  
chat  
profile  

Must follow same design system.

---

# Telegram Bot

Location:

apps/bot

Use:

aiogram

Commands:

/start

The bot must:

send notifications  
open mini app  

Bot must NOT contain business logic.

---

# Shared Packages

Create:

packages/types  
shared type definitions

packages/utils  
shared helper functions

packages/ui  
shared UI components

---

# Database Tables for Sprint 1

Implement migrations for:

users  
user_roles  
companies  
company_members  
buyer_profiles  
seller_profiles  
specialist_profiles  

---

# Testing

Add basic tests for:

authentication  
company creation  
profile creation  

---

# Expected Result

At the end of Sprint 1 the system must run locally with:

Backend:

localhost:8000

API docs:

/docs

Web:

localhost:5173

MiniApp:

working shell

Bot:

responds to /start

---

# Output Requirements

Return:

1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks