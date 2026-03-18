# MIDAS Sprint 2 Implementation Prompt

You are implementing Sprint 2 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 2.

---

# Sprint 2 Goal

Implement the Seller Inventory System.

At the end of Sprint 2 the system must allow sellers to:
- create media assets
- edit media assets
- add pricing
- add audience data
- upload portfolio files
- view assets in seller inventory dashboard
- view public asset detail pages

---

# Required Data Model Scope

Implement migrations and models for:
- media_assets
- media_asset_regions
- media_asset_formats
- media_asset_pricing
- media_asset_audience
- media_asset_social_details
- media_asset_outdoor_details
- media_asset_files
- media_asset_availability

Follow docs/DATA_MODEL.md and docs/03_DATABASE_SCHEMA.md.

---

# Backend Requirements

Location:
apps/api

Implement:
- inventory module
- create asset endpoint
- edit asset endpoint
- asset detail endpoint
- seller inventory list endpoint
- public asset detail endpoint
- pricing endpoint
- audience endpoint
- asset files upload metadata endpoint
- availability endpoint

Add ownership checks:
- seller can only modify own assets

Use typed request/response schemas.

---

# Frontend Requirements

Location:
apps/web

Implement seller UI:
- seller dashboard inventory section
- inventory list page
- create asset wizard
- asset detail/edit page
- pricing form
- audience form
- portfolio upload UI
- availability section
- public asset detail page

Follow:
- docs/BRAND_GUIDELINES.md
- docs/DESIGN_SYSTEM.md
- docs/UX_PRINCIPLES.md
- docs/UI_COMPONENT_MAP.md
- docs/SCREEN_MAP.md

---

# Mini App Requirements

Location:
apps/miniapp

Implement lightweight seller inventory views:
- asset list
- asset detail
- basic create/edit shell

---

# Testing Requirements

Add tests for:
- asset creation
- seller ownership validation
- pricing save
- audience save
- public asset fetch

---

# Expected Result

At the end of Sprint 2:
- seller can create and manage assets
- assets appear in seller inventory dashboard
- public asset detail page works
- pricing and audience are stored and retrievable

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
