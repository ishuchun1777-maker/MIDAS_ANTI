# MIDAS Sprint 10 Implementation Prompt

You are implementing Sprint 10 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 10.

---

# Sprint 10 Goal

Implement the Analytics System.

At the end of Sprint 10 the system must allow:
- campaign metrics storage
- media performance snapshots
- ROI prediction storage
- buyer and seller analytics views
- campaign performance summary UI

---

# Required Data Model Scope

Implement migrations and models for:
- campaign_metrics
- media_performance_snapshots
- roi_predictions
- roi_actuals
- notification_preferences
- notifications (if not already implemented)

---

# Backend Requirements

Location:
apps/api

Implement:
- analytics module
- campaign analytics endpoint
- asset analytics endpoint
- seller analytics endpoint
- buyer analytics endpoint
- ROI predictions endpoint
- ROI actuals endpoint

Prefer robust summary APIs over raw table dumps.

---

# Frontend Requirements

Location:
apps/web

Implement:
- buyer analytics dashboard
- seller analytics dashboard
- campaign analytics page
- ROI summary cards
- simple charts/tables

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- lightweight analytics summaries

---

# Bot Requirements

Location:
apps/bot

Send notifications for:
- campaign performance summary ready (optional)

---

# Testing Requirements

Add tests for:
- analytics retrieval endpoints
- campaign metrics storage
- ROI prediction retrieval

---

# Expected Result

At the end of Sprint 10:
- MIDAS has a usable analytics layer for campaigns and marketplace participants

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
