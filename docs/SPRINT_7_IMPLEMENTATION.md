# MIDAS Sprint 7 Implementation Prompt

You are implementing Sprint 7 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 7.

---

# Sprint 7 Goal

Implement the Execution System.

At the end of Sprint 7 the system must allow:
- deliverables to be created and tracked
- proof uploads metadata to be recorded
- approvals to be submitted
- revision requests to be issued
- execution status to be visible in deal context

---

# Required Data Model Scope

Implement migrations and models for:
- deliverables
- deliverable_proofs
- approvals
- revision_requests

---

# Backend Requirements

Location:
apps/api

Implement:
- execution module
- create deliverable endpoint
- list deliverables by deal/campaign
- upload proof metadata endpoint
- approve endpoint
- reject/revision request endpoint
- deliverable detail endpoint

Validate:
- only valid deal participants can interact
- approvals are scoped correctly to deal context

---

# Frontend Requirements

Location:
apps/web

Implement:
- deliverables board/list
- deliverable detail page
- proof upload UI
- approval UI
- revision request UI
- execution panel in deal room

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- deliverables list
- proof upload shell
- approval/revision actions

---

# Bot Requirements

Location:
apps/bot

Send notifications for:
- deliverable submitted
- approval required
- revision requested

---

# Testing Requirements

Add tests for:
- deliverable creation
- proof submission
- approval and revision actions
- access validation

---

# Expected Result

At the end of Sprint 7:
- deal execution can be managed inside the platform
- proof and approvals work correctly

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
