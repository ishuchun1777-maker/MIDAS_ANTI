# MIDAS Sprint 3 Implementation Prompt

You are implementing Sprint 3 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 3.

---

# Sprint 3 Goal

Implement the Buyer Discovery System.

At the end of Sprint 3 the system must allow buyers to:
- browse assets
- search assets
- filter by media type, city, category, price and audience-related properties
- open asset detail page
- save shortlist entries
- view shortlist

---

# Required Data Model Scope

Implement migrations and models for:
- saved_shortlists
- shortlist_items
- search_logs (optional but preferred)

Use existing inventory tables from Sprint 2.

---

# Backend Requirements

Location:
apps/api

Implement:
- discovery module
- asset discovery endpoint
- search/filter endpoint
- asset detail endpoint for authenticated buyers
- shortlist create endpoint
- shortlist item add/remove endpoint
- shortlist list endpoint

Search/filter must support:
- media_type
- city
- district
- category
- min_price
- max_price
- verified_only
- trust_score_min

---

# Frontend Requirements

Location:
apps/web

Implement buyer UI:
- buyer dashboard discovery CTA
- discovery page
- filter sidebar
- search results grid/list
- asset detail page
- shortlist page
- add to shortlist actions

Ensure loading, empty and error states exist.

---

# Mini App Requirements

Location:
apps/miniapp

Implement lightweight buyer discovery:
- asset list
- search/filter shell
- asset detail
- shortlist view

---

# Testing Requirements

Add tests for:
- discovery endpoint filters
- asset detail retrieval
- shortlist create/add/remove

---

# Expected Result

At the end of Sprint 3:
- buyer can discover assets
- filters work
- asset detail opens
- shortlist works

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
