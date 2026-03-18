# MIDAS Data Model

This document defines the full relational data model for the MIDAS platform.

MIDAS is an advertising marketplace platform with:

- buyers
- sellers
- specialists
- agencies
- admins
- campaigns
- deals
- messaging
- ratings
- notifications
- matching engine

The data model must support production-grade scalability.

---

# 1. Core Principles

1. Use PostgreSQL / Supabase
2. Use UUID as primary keys
3. Use timestamps on all major entities
4. Keep strong foreign key relationships
5. Avoid duplicate business logic across tables
6. Separate profile data from transactional data

---

# 2. Main Entity Groups

The database is divided into these groups:

1. Identity
2. Company & Team
3. Profiles
4. Inventory
5. Buyer Discovery & Matching
6. Campaigns
7. Offers & Deals
8. Messaging
9. Deliverables
10. Trust & Ratings
11. Notifications
12. Admin & Logs

---

# 3. Identity Entities

## User

Represents any platform user.

Fields:

- id
- telegram_id
- email
- phone
- password_hash
- full_name
- avatar_url
- is_active
- created_at
- updated_at

Relations:

- has many roles
- has many companies via memberships
- has one or more profiles depending on role
- has many messages
- has many notifications

---

## UserRole

Defines platform roles.

Examples:

- buyer
- seller
- specialist
- agency
- admin

Fields:

- id
- user_id
- role
- created_at

Relation:

many roles belong to one user

---

# 4. Company & Team Entities

## Company

Represents a business entity.

Fields:

- id
- owner_user_id
- company_type
- name
- legal_name
- description
- logo_url
- website
- city
- address
- verification_status
- created_at
- updated_at

Relations:

- belongs to owner user
- has many members
- has many branches
- may own profiles
- may own campaigns
- may own inventory

---

## CompanyMember

Links users to companies.

Fields:

- id
- company_id
- user_id
- permission_level
- title
- joined_at

Relations:

- belongs to company
- belongs to user

---

## CompanyBranch

Optional physical branch.

Fields:

- id
- company_id
- name
- city
- district
- address
- latitude
- longitude

Relations:

- belongs to company

---

# 5. Profile Entities

Profiles are role-specific business-facing representations.

## BuyerProfile

Fields:

- id
- user_id
- company_id
- business_name
- industry
- subindustry
- description
- website
- avg_budget_min
- avg_budget_max
- target_regions
- preferred_channels
- public_status
- trust_score
- created_at
- updated_at

Relations:

- belongs to user
- belongs to company
- has many campaigns
- has many business inputs
- has many personas
- has many match recommendations

---

## SellerProfile

Fields:

- id
- user_id
- company_id
- seller_type
- display_name
- niche
- bio
- languages
- primary_regions
- trust_score
- verification_status
- public_status
- created_at
- updated_at

Relations:

- belongs to user
- belongs to company
- has many media assets
- has many ratings

---

## SpecialistProfile

Fields:

- id
- user_id
- company_id
- specialist_type
- display_name
- bio
- skills
- tools
- portfolio_url
- hourly_rate
- project_rate_from
- trust_score
- verification_status
- public_status
- created_at
- updated_at

Relations:

- belongs to user
- belongs to company
- may be linked to campaigns
- may receive offers

---

# 6. Inventory Entities

Inventory is the core advertising supply side.

## MediaAsset

Represents a sellable advertising asset.

Examples:

- Instagram page
- Telegram channel
- TikTok creator
- Billboard
- LED screen
- YouTube channel
- App banner slot

Fields:

- id
- seller_profile_id
- company_id
- media_type
- title
- description
- category
- status
- verification_status
- visibility
- public_slug
- created_at
- updated_at

Relations:

- belongs to seller profile
- belongs to company
- has one audience row
- may have one social details row
- may have one outdoor details row
- has many pricing rows
- has many format rows
- has many region rows
- has many files
- may belong to many campaign media plans
- may receive many offers

---

## MediaAssetRegion

Fields:

- id
- media_asset_id
- country_code
- city
- district
- address
- latitude
- longitude

Relation:

belongs to media asset

---

## MediaAssetFormat

Fields:

- id
- media_asset_id
- format_name
- duration_seconds
- quantity_limit
- creative_requirements
- is_active

Relation:

belongs to media asset

---

## MediaAssetPricing

Fields:

- id
- media_asset_id
- format_id
- pricing_model
- currency
- base_price
- min_order_value
- negotiable
- valid_from
- valid_to

Relations:

- belongs to media asset
- may belong to one format

---

## MediaAssetAudience

Fields:

- id
- media_asset_id
- total_reach
- avg_views
- avg_engagement_rate
- male_percent
- female_percent
- age_13_17
- age_18_24
- age_25_34
- age_35_44
- age_45_plus
- top_cities
- top_interests
- audience_quality_score
- updated_at

Relation:

one-to-one with media asset

---

## MediaAssetSocialDetails

For digital creators and channels.

Fields:

- id
- media_asset_id
- followers
- subscribers
- avg_story_views
- avg_post_views
- avg_video_views
- avg_comments
- avg_shares
- growth_rate
- authenticity_score
- updated_at

Relation:

one-to-one with media asset

---

## MediaAssetOutdoorDetails

For billboard and LED assets.

Fields:

- id
- media_asset_id
- width_m
- height_m
- resolution
- screen_type
- daily_traffic_estimate
- visibility_score
- illumination
- landmark_info
- facing_direction
- installation_type
- updated_at

Relation:

one-to-one with media asset

---

## MediaAssetFile

Fields:

- id
- media_asset_id
- file_url
- file_type
- caption
- sort_order
- created_at

Relation:

belongs to media asset

---

## MediaAssetAvailability

Fields:

- id
- media_asset_id
- date_from
- date_to
- availability_status
- note

Relation:

belongs to media asset

---

# 7. Buyer Intelligence & Matching Entities

## BuyerBusinessInput

Represents structured business input from buyer.

Fields:

- id
- buyer_profile_id
- company_id
- business_type
- product_name
- product_description
- price_level
- target_goal
- target_regions
- budget_min
- budget_max
- premium_or_mass
- seasonality
- notes
- created_at
- updated_at

Relation:

belongs to buyer profile

---

## BuyerPersona

AI/rule-generated target persona.

Fields:

- id
- buyer_profile_id
- persona_name
- age_range
- gender_mix
- income_proxy
- interests
- lifestyle_tags
- location_tags
- pain_points
- motivations
- confidence_score
- source_type
- created_at
- updated_at

Relation:

belongs to buyer profile

---

## BuyerTargetFilter

System-generated targeting constraints.

Fields:

- id
- buyer_profile_id
- preferred_platforms
- preferred_creator_types
- preferred_regions
- preferred_age_ranges
- preferred_gender_mix
- min_engagement_rate
- max_budget
- updated_at

Relation:

one-to-one or one latest row per buyer profile

---

## MatchRecommendation

Represents recommendation result.

Fields:

- id
- buyer_profile_id
- campaign_id
- media_asset_id
- seller_profile_id
- specialist_profile_id
- score_total
- recommendation_reason
- created_at

Relations:

- belongs to buyer profile
- may belong to campaign
- may reference media asset
- may reference seller profile
- may reference specialist profile
- has one score breakdown
- has many feedback rows

---

## MatchScoreBreakdown

Fields:

- id
- recommendation_id
- score_audience_fit
- score_geo_fit
- score_industry_fit
- score_budget_fit
- score_trust_fit
- score_quality_fit
- score_conversion_potential
- score_availability_fit
- score_payload
- created_at

Relation:

belongs to recommendation

---

## RecommendationFeedback

Fields:

- id
- recommendation_id
- user_id
- feedback_type
- note
- created_at

Relations:

- belongs to recommendation
- belongs to user

---

# 8. Campaign Entities

## Campaign

Represents buyer campaign.

Fields:

- id
- company_id
- buyer_profile_id
- branch_id
- title
- objective
- budget_total
- currency
- start_date
- end_date
- status
- created_by_user_id
- created_at
- updated_at

Relations:

- belongs to buyer profile
- belongs to company
- may belong to branch
- has one brief
- has many media plan items
- has many specialist plan items
- has many offers
- has many deals
- has metrics

---

## CampaignBrief

Fields:

- id
- campaign_id
- brief_text
- key_message
- call_to_action
- brand_tone
- brand_guidelines
- prohibited_items
- approval_rules
- created_at
- updated_at

Relation:

one-to-one with campaign

---

## CampaignMediaPlan

Fields:

- id
- campaign_id
- media_asset_id
- recommendation_source
- proposed_budget
- expected_reach
- expected_leads
- expected_roi
- priority_rank
- selection_status
- created_at

Relations:

- belongs to campaign
- belongs to media asset

---

## CampaignSpecialist

Fields:

- id
- campaign_id
- specialist_profile_id
- role_type
- estimated_cost
- status
- created_at

Relations:

- belongs to campaign
- belongs to specialist profile

---

## CampaignBudgetAllocation

Fields:

- id
- campaign_id
- allocation_type
- ref_id
- amount
- currency
- created_at

Relation:

belongs to campaign

---

# 9. Offer & Deal Entities

## Offer

Represents proposal between buyer and seller/specialist.

Fields:

- id
- campaign_id
- media_asset_id
- specialist_profile_id
- sender_user_id
- receiver_user_id
- price
- currency
- deliverables_summary
- timeline_summary
- status
- expires_at
- created_at
- updated_at

Relations:

- belongs to campaign
- may belong to media asset
- may belong to specialist profile
- belongs to sender user
- belongs to receiver user
- has many revisions
- may have one deal

---

## OfferRevision

Fields:

- id
- offer_id
- revised_by_user_id
- price
- deliverables
- timeline
- note
- created_at

Relations:

- belongs to offer
- belongs to user

---

## Deal

Represents accepted offer.

Fields:

- id
- offer_id
- campaign_id
- buyer_user_id
- seller_user_id
- total_amount
- currency
- start_date
- end_date
- status
- contract_text
- created_at
- updated_at

Relations:

- belongs to offer
- belongs to campaign
- belongs to buyer user
- belongs to seller user
- has many milestones
- has one room or one main deal room
- has many deliverables
- has many ratings
- may have one dispute

---

## DealMilestone

Fields:

- id
- deal_id
- title
- description
- amount
- due_date
- status
- sort_order
- created_at

Relation:

belongs to deal

---

## DealStatusHistory

Fields:

- id
- deal_id
- old_status
- new_status
- changed_by_user_id
- note
- created_at

Relations:

- belongs to deal
- belongs to user

---

# 10. Messaging Entities

## ChatRoom

Fields:

- id
- room_type
- campaign_id
- deal_id
- created_at

Relations:

- may belong to campaign
- may belong to deal
- has many participants
- has many messages

---

## ChatParticipant

Fields:

- id
- room_id
- user_id
- joined_at
- last_read_at

Relations:

- belongs to room
- belongs to user

---

## Message

Fields:

- id
- room_id
- sender_user_id
- message_type
- text
- attachment_url
- metadata
- created_at

Relations:

- belongs to room
- belongs to sender user

---

# 11. Execution Entities

## Deliverable

Represents work item in a deal.

Fields:

- id
- deal_id
- campaign_id
- assigned_user_id
- deliverable_type
- title
- description
- due_date
- status
- created_at
- updated_at

Relations:

- belongs to deal
- may belong to campaign
- may belong to assigned user
- has many proofs
- has many approvals
- has many revision requests

---

## DeliverableProof

Fields:

- id
- deliverable_id
- proof_type
- file_url
- link_url
- note
- payload
- uploaded_by_user_id
- uploaded_at

Relations:

- belongs to deliverable
- belongs to uploaded by user

---

## Approval

Fields:

- id
- deliverable_id
- approved_by_user_id
- status
- feedback
- created_at

Relations:

- belongs to deliverable
- belongs to user

---

## RevisionRequest

Fields:

- id
- deliverable_id
- requested_by_user_id
- reason
- status
- created_at
- resolved_at

Relations:

- belongs to deliverable
- belongs to user

---

# 12. Trust & Rating Entities

## Verification

Fields:

- id
- user_id
- company_id
- media_asset_id
- verification_type
- status
- reviewed_by_admin_id
- review_note
- submitted_at
- reviewed_at

Relations:

- may belong to user
- may belong to company
- may belong to media asset
- may belong to admin reviewer
- has many verification documents

---

## VerificationDocument

Fields:

- id
- verification_id
- file_url
- document_type
- created_at

Relation:

belongs to verification

---

## Rating

Fields:

- id
- from_user_id
- to_user_id
- deal_id
- score
- communication_score
- speed_score
- quality_score
- value_score
- comment
- created_at

Relations:

- belongs to from user
- belongs to to user
- belongs to deal

---

## TrustScore

Fields:

- id
- user_id
- seller_profile_id
- buyer_profile_id
- score_total
- score_authenticity
- score_reliability
- score_delivery
- score_response
- score_satisfaction
- updated_at

Relations:

- may belong to user
- may belong to seller profile
- may belong to buyer profile

---

## FraudFlag

Fields:

- id
- entity_type
- entity_id
- reason
- severity
- payload
- is_active
- created_at

Used by moderation and trust systems.

---

## Dispute

Fields:

- id
- deal_id
- opened_by_user_id
- reason
- status
- resolution_text
- resolved_by_admin_id
- created_at
- resolved_at

Relations:

- belongs to deal
- belongs to opened by user
- may belong to resolving admin

---

# 13. Analytics Entities

## CampaignMetric

Fields:

- id
- campaign_id
- impressions
- reach
- clicks
- leads
- conversions
- sales_amount
- roi_estimate
- updated_at

Relation:

one-to-one with campaign

---

## MediaPerformanceSnapshot

Fields:

- id
- media_asset_id
- period_start
- period_end
- avg_views
- avg_engagement
- avg_ctr
- avg_leads
- conversion_estimate
- created_at

Relation:

belongs to media asset

---

## ROIPrediction

Fields:

- id
- campaign_id
- media_asset_id
- predicted_reach
- predicted_clicks
- predicted_leads
- predicted_sales
- predicted_roi
- confidence_score
- created_at

Relations:

- belongs to campaign
- may belong to media asset

---

## ROIActual

Fields:

- id
- campaign_id
- media_asset_id
- actual_reach
- actual_clicks
- actual_leads
- actual_sales
- actual_roi
- created_at

Relations:

- belongs to campaign
- may belong to media asset

---

# 14. Notification Entities

## NotificationPreference

Fields:

- id
- user_id
- telegram_enabled
- email_enabled
- in_app_enabled
- marketing_enabled
- updated_at

Relation:

belongs to user

---

## Notification

Fields:

- id
- user_id
- type
- title
- body
- channel
- status
- related_entity_type
- related_entity_id
- created_at
- read_at

Relation:

belongs to user

---

# 15. AI & Background Entities

## AIJob

Fields:

- id
- job_type
- status
- input_ref_type
- input_ref_id
- started_at
- finished_at
- error_message
- created_at

---

## AIOutput

Fields:

- id
- ai_job_id
- output_type
- output_json
- confidence_score
- created_at

Relation:

belongs to AI job

---

## FeedbackLabel

Fields:

- id
- source_type
- source_id
- user_id
- label_type
- label_value
- payload
- created_at

Used to improve future recommendation quality.

---

# 16. Admin & Audit Entities

## AdminAction

Fields:

- id
- admin_user_id
- action_type
- target_type
- target_id
- note
- created_at

Relation:

belongs to admin user

---

## ModerationFlag

Fields:

- id
- flagged_entity_type
- flagged_entity_id
- reason
- severity
- status
- created_at
- reviewed_at

---

## AuditLog

Fields:

- id
- actor_user_id
- entity_type
- entity_id
- action
- old_data
- new_data
- created_at

---

# 17. Core Relationship Summary

## User Relationships

User
- has many user roles
- has many company memberships
- may own companies
- may own buyer profile
- may own seller profile
- may own specialist profile
- has many messages
- has many notifications
- has many ratings given and received

---

## Buyer Relationships

BuyerProfile
- belongs to user
- belongs to company
- has many campaigns
- has many business inputs
- has many personas
- has many recommendations

---

## Seller Relationships

SellerProfile
- belongs to user
- belongs to company
- has many media assets
- has many ratings
- has trust score

---

## Campaign Relationships

Campaign
- belongs to buyer profile
- belongs to company
- has one brief
- has many media plan items
- has many offers
- has many deals
- has metrics

---

## Deal Relationships

Deal
- belongs to offer
- belongs to campaign
- has many milestones
- has one room
- has many deliverables
- has many ratings
- may have dispute

---

# 18. Recommended Build Order for Tables

Build in this order:

1. users
2. user_roles
3. companies
4. company_members
5. buyer_profiles
6. seller_profiles
7. specialist_profiles
8. media_assets
9. media_asset_audience
10. media_asset_pricing
11. campaigns
12. campaign_briefs
13. offers
14. deals
15. chat_rooms
16. chat_participants
17. messages
18. deliverables
19. deliverable_proofs
20. approvals
21. ratings
22. verifications
23. notifications
24. matching tables
25. analytics tables

---

# 19. Critical Constraints

The system must enforce:

- one accepted offer creates one deal
- seller can edit only own assets
- buyer can access only own campaigns
- ratings only after completed deal
- deliverable approval must belong to related deal context
- chat room participants must belong to related deal/campaign

---

# 20. Final Rule

Database design must support:

- production-grade marketplace operations
- multi-role architecture
- buyer-to-seller transactions
- future AI matching and analytics
- future scaling to multiple cities and markets