# MIDAS Sprint 6 Implementation Prompt

You are implementing Sprint 6 of the MIDAS platform.

Read all documentation in /docs and all rules in /agents before making changes.
Follow docs/SPRINT_PLAN.md and start only Sprint 6.

---

# Sprint 6 Goal

Implement the Messaging System.

At the end of Sprint 6 the system must allow:
- chat room creation for deals/campaigns
- sending messages
- listing messages
- tracking participants and reads
- attaching files metadata

---

# Required Data Model Scope

Implement migrations and models for:
- chat_rooms
- chat_participants
- messages

---

# Backend Requirements

Location:
apps/api

Implement:
- rooms module
- list rooms endpoint
- room detail endpoint
- room messages list endpoint
- send message endpoint
- mark as read endpoint
- participant validation

If realtime is not fully implemented, build clean polling-friendly APIs.

---

# Frontend Requirements

Location:
apps/web

Implement:
- inbox page
- room list
- conversation view
- message composer
- attachment metadata support
- context panel showing linked deal/campaign

---

# Mini App Requirements

Location:
apps/miniapp

Implement:
- chat list
- conversation view
- send message

---

# Bot Requirements

Location:
apps/bot

Send notifications for:
- new message received

---

# Testing Requirements

Add tests for:
- room access validation
- send/list messages
- mark as read

---

# Expected Result

At the end of Sprint 6:
- buyer and seller can chat within platform context
- messages are stored and retrievable
- linked deal/campaign context is preserved

---

# Output Requirements

Return:
1. Files created
2. Explanation of implementation
3. Database migrations added
4. Run instructions
5. Known risks
