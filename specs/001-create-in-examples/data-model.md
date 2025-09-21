# Data Model: tanstack-start

**Date**: September 15, 2025  
**Purpose**: Define data entities and relationships for TanStack Start application

## Core Entities

### User Session
**Purpose**: Manage authenticated user state across the application

**Fields**:
- `sessionId`: string (UUID) - Primary identifier
- `userId`: string - Reference to user identity
- `createdAt`: timestamp - Session creation time
- `expiresAt`: timestamp - Session expiration time
- `isActive`: boolean - Session validity status
- `metadata`: object - Additional session context (device, location, etc.)

**Validation Rules**:
- sessionId must be valid UUID format
- expiresAt must be after createdAt
- metadata must not contain sensitive information
- userId must match authenticated identity

**State Transitions**:
- Created → Active (on successful authentication)
- Active → Expired (on timeout or logout)
- Expired → Deleted (cleanup process)

### Application State
**Purpose**: Client-side application state management

**Fields**:
- `theme`: string - UI theme preference ('light' | 'dark' | 'system')
- `language`: string - User language preference (ISO 639-1)
- `lastRoute`: string - Last visited route for session restoration
- `preferences`: object - User-specific UI preferences
- `cacheTimestamp`: timestamp - State cache validity

**Validation Rules**:
- theme must be one of allowed values
- language must be valid ISO code
- lastRoute must be valid application route
- preferences must be serializable object

### Static Asset Metadata
**Purpose**: Track static assets for caching and optimization

**Fields**:
- `assetPath`: string - Relative path to asset
- `contentHash`: string - File content hash for versioning
- `mimeType`: string - Asset MIME type
- `size`: number - File size in bytes
- `lastModified`: timestamp - Last modification time
- `cachePolicy`: string - CloudFront cache behavior

**Validation Rules**:
- assetPath must be valid relative path
- contentHash must be SHA-256 hash
- mimeType must be valid MIME type
- size must be positive number

### API Request Log
**Purpose**: Track API requests for monitoring and debugging

**Fields**:
- `requestId`: string (UUID) - Unique request identifier
- `timestamp`: timestamp - Request timestamp
- `method`: string - HTTP method
- `path`: string - Request path
- `statusCode`: number - Response status code
- `duration`: number - Request duration in milliseconds
- `userId`: string (optional) - Authenticated user ID
- `userAgent`: string - Client user agent
- `sourceIp`: string - Client IP address (anonymized)

**Validation Rules**:
- requestId must be valid UUID
- method must be valid HTTP method
- statusCode must be valid HTTP status code
- duration must be positive number
- sourceIp must be anonymized for privacy

## Relationships

### User Session ↔ API Request Log
- One user session can have many API requests
- API requests reference sessionId for user context
- Used for user activity tracking and debugging

### Application State ↔ User Session
- Application state is scoped to user session
- State persistence tied to session lifecycle
- State cleanup on session expiration

### Static Asset Metadata ↔ CloudFront Cache
- Asset metadata drives cache behavior configuration
- Content hash enables efficient cache invalidation
- MIME type determines compression and security headers

## Data Storage Strategy

### DynamoDB Tables

**Sessions Table**:
- Primary Key: sessionId
- TTL: expiresAt (automatic cleanup)
- Global Secondary Index: userId (query user sessions)

**RequestLogs Table**:
- Primary Key: requestId
- Sort Key: timestamp
- TTL: 30 days (compliance and debugging)
- Local Secondary Index: userId (user-specific logs)

**AssetMetadata Table**:
- Primary Key: assetPath
- Attributes: contentHash, mimeType, size, lastModified, cachePolicy
- Updated on deployment with new asset versions

### Client-Side Storage

**Application State**:
- Stored in browser localStorage
- Synchronized with server on session changes
- Fallback to default values if corrupted

## Security Considerations

### Data Protection
- No sensitive data in client-side storage
- Session tokens stored as secure HTTP-only cookies
- User data anonymization in logs
- Encryption at rest for all DynamoDB tables

### Access Control
- Session validation for all authenticated endpoints
- Rate limiting based on user and IP
- Audit logging for sensitive operations
- Data retention policies for compliance

### Privacy
- Minimal data collection principle
- User consent for optional tracking
- Right to deletion implementation
- Data anonymization in analytics