# MIDAS Sprint 5 Implementation Prompt

You are implementing Sprint 5 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 5.

---

# Sprint 5 Goal

Implement the Deal System.

At the end of Sprint 5 the system must allow:
- accepted offer to create a deal
- buyer and seller to view deal details
- deal status to be tracked
- deal milestones to be created and viewed
- deal room shell to exist

---

# Required Data Model Scope

Implement migrations and models for:
- deals
- deal_milestones
- deal_status_history

---

# Backend Requirements

Location:
apps/api

Implement:
- deal creation logic triggered by accepted offer
- deals module
- list deals endpoint
- deal detail endpoint
- milestone create/update endpoints
- deal history endpoint

Validate:
- one accepted offer creates one deal
- users can access only their deals

---

# Frontend Requirements

Location:
apps/web

Implement:
- buyer deals page
- seller deals page
- deal detail page
- milestone list UI
- deal status panel
- linked deal room shell

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- deal list
- deal detail
- status display

---

# Bot Requirements

Location:
apps/bot

Send notifications for:
- deal created
- milestone added (optional)
- deal status changed

---

# Testing Requirements

Add tests for:
- accepted offer creates one deal
- deal listing and access rules
- milestone creation

---

# Expected Result

At the end of Sprint 5:
- deal is created from accepted offer
- buyer and seller can access deal details
- milestones and status history work

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
