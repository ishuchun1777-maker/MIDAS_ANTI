# MIDAS Sprint 4 Implementation Prompt

You are implementing Sprint 4 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 4.

---

# Sprint 4 Goal

Implement the Offer System.

At the end of Sprint 4 the system must allow:
- buyer to send offer
- seller to receive offer
- seller to accept, reject or counter
- buyer to view sent offers
- seller to view received offers
- offer status transitions to work correctly

---

# Required Data Model Scope

Implement migrations and models for:
- offers
- offer_revisions

Use campaign and asset references according to docs/DATA_MODEL.md.

---

# Backend Requirements

Location:
apps/api

Implement:
- offers module
- create offer endpoint
- list sent offers endpoint
- list received offers endpoint
- offer detail endpoint
- counter offer endpoint
- accept offer endpoint
- reject offer endpoint
- cancel offer endpoint (if allowed by rules)

Validate:
- buyer owns linked campaign
- seller owns linked asset
- status transitions are safe

---

# Frontend Requirements

Location:
apps/web

Implement:
- send offer modal/page
- buyer offers page
- seller offers inbox page
- offer detail page
- counter action UI
- accept/reject actions

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- offers list
- offer detail
- accept/reject/counter shell

---

# Bot Requirements

Location:
apps/bot

Send notifications for:
- new offer received
- offer accepted
- offer rejected
- counter offer created

---

# Testing Requirements

Add tests for:
- create offer
- list inbox/sent offers
- accept/reject/counter transitions
- ownership validation

---

# Expected Result

At the end of Sprint 4:
- buyer can send offers
- seller can manage offers
- offer lifecycle works correctly

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
