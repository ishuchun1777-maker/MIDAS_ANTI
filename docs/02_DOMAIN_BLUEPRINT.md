# Domain Blueprint - MIDAS

## Core Entities
1. **Listing**: Represents an item or service available.
2. **Deal**: Represents a transaction or interaction between users.
3. **User**: Management of user profiles and ratings.
4. **Chat**: Real-time communication within deals.

## Relationships
- A User can have multiple Listings.
- A Deal involves two Users and one Listing.
- A Deal has associated Chat messages.
