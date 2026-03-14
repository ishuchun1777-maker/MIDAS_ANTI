# API Blueprint - MIDAS

## Endpoints
### Auth
- `POST /api/init`: Validate Telegram InitData.

### Listings
- `GET /api/listings`: Fetch filtered listings.
- `GET /api/listings/:id`: Fetch single listing details.
- `POST /api/listings`: Create new listing.

### Deals
- `POST /api/deals`: Initiate a new deal.
- `GET /api/deals`: List user deals.

### Chat
- `GET /api/chats/:deal_id`: Fetch message history.
- `POST /api/chats/:deal_id`: Send a message.
