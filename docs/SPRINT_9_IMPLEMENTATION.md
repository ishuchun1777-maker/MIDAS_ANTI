# MIDAS Sprint 9 Implementation Prompt

You are implementing Sprint 9 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 9.

---

# Sprint 9 Goal

Implement the Matching Engine.

At the end of Sprint 9 the system must allow:
- buyer business input capture
- persona generation storage
- rule-based asset scoring
- recommendation generation
- recommendation list display
- recommendation feedback collection

---

# Required Data Model Scope

Implement migrations and models for:
- buyer_business_inputs
- buyer_personas
- buyer_target_filters
- match_recommendations
- match_score_breakdowns
- recommendation_feedback
- ai_jobs (optional scaffolding)
- ai_outputs (optional scaffolding)

Follow docs/MATCHING_ENGINE_SPEC.md.

---

# Backend Requirements

Location:
apps/api

Implement:
- buyer intelligence module
- matching module
- buyer business input endpoints
- persona retrieval endpoints
- recommendation run endpoint
- recommendation list/detail endpoint
- recommendation feedback endpoint

Use rule-based scoring for MVP.
Do NOT implement heavy ML.

---

# Frontend Requirements

Location:
apps/web

Implement:
- business analysis form
- AI insights page
- recommendations list
- recommendation detail/score explanation
- feedback actions

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- recommendations list shell
- recommendation detail shell

---

# Testing Requirements

Add tests for:
- business input save
- recommendation generation
- score breakdown creation
- feedback save

---

# Expected Result

At the end of Sprint 9:
- MIDAS can recommend ranked advertising assets for buyers
- matching is rule-based and transparent

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
