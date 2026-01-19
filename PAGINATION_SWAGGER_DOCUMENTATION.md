# API Pagination & Swagger Documentation Implementation

## Overview
This document summarizes the comprehensive pagination implementation and Swagger documentation setup for the EVTOL Drone Delivery API.

## Changes Made

### 1. **Pagination Implementation**

#### New Pagination DTOs (`src/dtos/pagination.dto.ts`)
- **PaginationQueryDto**: Parses and validates query parameters for pagination
  - Supports `page` and `limit` query parameters
  - Default: page 1, limit 10
  - Maximum limit: 100 items per page
  - Includes validation and sanitization

- **PaginatedResponseDto**: Standard wrapper for all list responses
  - Provides consistent response format across all endpoints
  - Includes pagination metadata:
    - `page`: Current page number
    - `limit`: Items per page
    - `total`: Total number of items
    - `totalPages`: Total pages
    - `hasNextPage`: Whether more pages exist
    - `hasPrevPage`: Whether previous page exists

#### List Endpoints with Pagination

**Users:**
- `GET /evtol/v1/users?page=1&limit=10` - Get all users (paginated)
- Implementation: [user.controller.ts](src/controllers/user.controller.ts)
- Service: [users.impl.ts](src/service/impl/users.impl.ts)

**EVTOLs:**
- `GET /evtol/v1/device?page=1&limit=10` - Get all drones (paginated)
- `GET /evtol/v1/device/available?page=1&limit=10` - Get available drones (paginated)
- Implementation: [evtol.controller.ts](src/controllers/evtol.controller.ts)
- Service: [evtol.impl.ts](src/service/impl/evtol.impl.ts)

**Medications:**
- `GET /evtol/v1/medications?page=1&limit=10` - Get all medications (paginated)
- Implementation: [medication.controller.ts](src/controllers/medication.controller.ts)
- Service: [medication.impl.ts](src/service/impl/medication.impl.ts)

**Orders:**
- `GET /evtol/v1/orders?page=1&limit=10` - Get user orders (paginated)
- `GET /evtol/v1/orders/all?page=1&limit=10` - Get all orders (paginated)
- Implementation: [orders.controller.ts](src/controllers/orders.controller.ts)
- Service: [orders.impl.ts](src/service/impl/orders.impl.ts)

### 2. **Swagger Documentation Setup**

#### Configuration (`src/config/swagger.ts`)
Complete Swagger/OpenAPI 3.0 specification including:

**General Information:**
- API Title: "EVTOL Drone Delivery API"
- Version: 1.0.0
- Comprehensive description of the system
- Contact information

**Servers:**
- Development: `http://localhost:PORT`
- Production: `https://api.evtol-delivery.com`

**Security Schemes:**
- Bearer Token (JWT) authentication configured

**Component Schemas:**
1. **User** - User account information
2. **EVTOL** - Drone specifications and status
3. **Medication** - Medication inventory item
4. **Order** - Delivery order
5. **OrderItem** - Individual medication item in order
6. **Pagination** - Pagination metadata
7. **PaginatedUsers** - Paginated user list
8. **PaginatedEVTOLs** - Paginated drone list
9. **PaginatedMedications** - Paginated medication list
10. **PaginatedOrders** - Paginated order list
11. **Error** - Error response format

**Tags:**
- Authentication
- Users
- EVTOLs
- Medications
- Orders

#### Route Documentation with JSDoc Comments

**Authentication Endpoints** (`src/routes/auth.routes.ts`):
- `POST /evtol/v1/authentication/register` - Register new user
- `POST /evtol/v1/authentication/login` - Login user
- `POST /evtol/v1/authentication/verify-email` - Verify email with OTP

**User Endpoints** (`src/routes/user.routes.ts`):
- `POST /evtol/v1/users` - Create user
- `GET /evtol/v1/users` - Get all users (paginated)
- `GET /evtol/v1/users/{id}` - Get user by ID
- `PUT /evtol/v1/users/{id}` - Update user
- `DELETE /evtol/v1/users/{id}` - Delete user

**EVTOL Endpoints** (`src/routes/evtol.routes.ts`):
- `POST /evtol/v1/device/registerDevice` - Register new drone
- `GET /evtol/v1/device` - Get all drones (paginated)
- `GET /evtol/v1/device/available` - Get available drones (paginated)
- `POST /evtol/v1/device/loadDevice/{id}` - Load medications

**Medication Endpoints** (`src/routes/medication.routes.ts`):
- `POST /evtol/v1/medications/register-med` - Register medication
- `GET /evtol/v1/medications` - Get all medications (paginated)
- `GET /evtol/v1/medications/getMed/{id}` - Get medication by ID

**Order Endpoints** (`src/routes/order.routes.ts`):
- `POST /evtol/v1/orders` - Place order
- `GET /evtol/v1/orders` - Get user orders (paginated)
- `GET /evtol/v1/orders/{id}` - Get order by ID
- `GET /evtol/v1/orders/all` - Get all orders (paginated)

### 3. **Main Application Setup**

#### Updated index.ts
- Integrated Swagger UI Express
- Added Swagger configuration
- Swagger UI available at: `http://localhost:PORT/api-docs`

## Pagination Usage Examples

### Query Parameters
All list endpoints support the following query parameters:

```
?page=1&limit=10
```

- `page` (optional, default: 1): Page number starting from 1
- `limit` (optional, default: 10): Items per page (max 100)

### Example Requests

**Get first page of users:**
```bash
curl "http://localhost:3000/evtol/v1/users?page=1&limit=10"
```

**Get second page of available drones:**
```bash
curl "http://localhost:3000/evtol/v1/device/available?page=2&limit=20"
```

**Get third page of medications:**
```bash
curl "http://localhost:3000/evtol/v1/medications?page=3&limit=15"
```

### Example Response

```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Accessing Swagger Documentation

### Interactive API Documentation
1. Start the server: `npm run dev`
2. Open browser to: `http://localhost:3000/api-docs`
3. Explore all endpoints with interactive examples
4. Test API endpoints directly from Swagger UI

### Features Available in Swagger UI
- ✅ Complete API documentation
- ✅ Request/response examples
- ✅ Parameter descriptions
- ✅ Required fields indicators
- ✅ Authentication configuration
- ✅ Error response examples
- ✅ Interactive "Try it out" functionality
- ✅ Real-time request/response display

## Summary of List Endpoints

| Resource | Endpoint | Pagination |
|----------|----------|-----------|
| Users | `GET /evtol/v1/users` | ✅ Yes |
| EVTOLs | `GET /evtol/v1/device` | ✅ Yes |
| Available EVTOLs | `GET /evtol/v1/device/available` | ✅ Yes |
| Medications | `GET /evtol/v1/medications` | ✅ Yes |
| User Orders | `GET /evtol/v1/orders` | ✅ Yes |
| All Orders | `GET /evtol/v1/orders/all` | ✅ Yes |

## Key Benefits

1. **Scalability**: Pagination prevents loading large datasets
2. **Performance**: Reduced memory usage and faster response times
3. **User Experience**: Consistent, documented API behavior
4. **Developer Experience**: Interactive Swagger UI for testing
5. **Maintenance**: Clear documentation reduces support burden
6. **Standardization**: Uniform pagination format across all endpoints

## Next Steps (Optional)

1. Add rate limiting middleware
2. Add sorting parameters to list endpoints
3. Add filtering parameters for advanced searches
4. Implement caching for frequently accessed data
5. Add request/response logging
6. Set up API versioning strategy
