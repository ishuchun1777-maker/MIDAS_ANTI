# Database Schema - MIDAS

## Collections/Tables
### Users
- `id` (Primary Key)
- `telegram_id`
- `username`
- `rating`
- `review_count`

### Listings
- `id` (Primary Key)
- `owner_id` (Foreign Key)
- `title`
- `description`
- `tags`
- `status` (active, inactive, completed)

### Deals
- `id` (Primary Key)
- `listing_id` (Foreign Key)
- `buyer_id` (Foreign Key)
- `status` (pending, active, completed, cancelled)

### Messages
- `id` (Primary Key)
- `deal_id` (Foreign Key)
- `sender_id` (Foreign Key)
- `content`
- `timestamp`
