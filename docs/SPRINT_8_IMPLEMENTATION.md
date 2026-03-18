# MIDAS Sprint 8 Implementation Prompt

You are implementing Sprint 8 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 8.

---

# Sprint 8 Goal

Implement the Trust System.

At the end of Sprint 8 the system must allow:
- verification submission
- verification document handling metadata
- ratings after completed deals
- trust score storage/display
- dispute opening

---

# Required Data Model Scope

Implement migrations and models for:
- verifications
- verification_documents
- ratings
- trust_scores
- disputes
- fraud_flags (optional in this sprint if time allows)

---

# Backend Requirements

Location:
apps/api

Implement:
- trust module
- submit verification endpoint
- attach verification document endpoint
- list/get verifications endpoint
- create rating endpoint
- get ratings endpoint
- trust score read endpoint
- create dispute endpoint
- dispute detail/list endpoint

Validate:
- ratings only after completed deal
- one rating per direction per deal

---

# Frontend Requirements

Location:
apps/web

Implement:
- verification center
- ratings page
- trust summary panel
- dispute create/view pages

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- ratings summary
- verification status view
- dispute shell

---

# Bot Requirements

Location:
apps/bot

Send notifications for:
- verification approved/rejected
- rating received
- dispute opened/updated

---

# Testing Requirements

Add tests for:
- verification submission
- ratings constraints
- dispute creation

---

# Expected Result

At the end of Sprint 8:
- verification and ratings work
- trust layer exists
- disputes can be opened

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
