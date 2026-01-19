# API Endpoints Map & Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT/FRONTEND                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Express API Server   │
        │   http://localhost:3000│
        └────────┬───────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌─────────┐  ┌──────────┐
│Swagger │  │Routes   │  │Middleware│
│UI Docs │  │Handler  │  │& Auth    │
│/api-doc│  │         │  │          │
└────────┘  └────┬────┘  └────┬─────┘
                 │            │
                 └────────┬───┘
                          │
                 ┌────────▼───────┐
                 │ Controllers    │
                 │(Request Logic) │
                 └────────┬───────┘
                          │
                 ┌────────▼───────┐
                 │ Services       │
                 │(Business Logic)│
                 └────────┬───────┘
                          │
                 ┌────────▼───────┐
                 │ Prisma ORM     │
                 │(DB Access)     │
                 └────────┬───────┘
                          │
                 ┌────────▼───────┐
                 │ PostgreSQL DB  │
                 │                │
                 └────────────────┘
```

## Complete API Endpoints Map

### 🔐 Authentication Endpoints
```
POST /evtol/v1/authentication/register
    ├─ Request: { email, password, firstName, lastName }
    └─ Response: User object

POST /evtol/v1/authentication/login
    ├─ Request: { email, password }
    └─ Response: { token, user }

POST /evtol/v1/authentication/verify-email
    ├─ Request: { email, otp }
    └─ Response: User object
```

### 👥 Users Endpoints
```
POST /evtol/v1/users
    ├─ Request: { email, password, firstName, lastName }
    └─ Response: 201 User object

GET /evtol/v1/users?page=1&limit=10  [PAGINATED]
    ├─ Query: page, limit
    └─ Response: {
        data: User[],
        pagination: { page, limit, total, totalPages, hasNextPage, hasPrevPage }
    }

GET /evtol/v1/users/{id}
    ├─ Param: id
    └─ Response: User object

PUT /evtol/v1/users/{id}
    ├─ Param: id
    ├─ Request: { firstName?, lastName?, email? }
    └─ Response: User object

DELETE /evtol/v1/users/{id}
    ├─ Param: id
    └─ Response: 200 OK
```

### 🚁 EVTOL (Drone) Endpoints
```
POST /evtol/v1/device/registerDevice
    ├─ Request: { model, battery, weightLimit, image? }
    └─ Response: 201 EVTOL object

GET /evtol/v1/device?page=1&limit=10  [PAGINATED]
    ├─ Query: page, limit
    └─ Response: Paginated EVTOL list

GET /evtol/v1/device/available?page=1&limit=10  [PAGINATED]
    ├─ Query: page, limit
    ├─ Filter: state=IDLE AND battery≥25%
    └─ Response: Paginated available EVTOLs

POST /evtol/v1/device/loadDevice/{id}
    ├─ Param: id
    ├─ Request: { items: [{ medicationId, quantity }] }
    └─ Response: { evtol, loads }
```

### 💊 Medication Endpoints
```
POST /evtol/v1/medications/register-med
    ├─ Request: { name, code, weight, quantity, image? }
    └─ Response: 201 Medication object

GET /evtol/v1/medications?page=1&limit=10  [PAGINATED]
    ├─ Query: page, limit
    └─ Response: Paginated medication list

GET /evtol/v1/medications/getMed/{id}
    ├─ Param: id
    └─ Response: Medication object
```

### 📦 Order Endpoints
```
POST /evtol/v1/orders  [REQUIRES AUTH]
    ├─ Request: { items: [{ medicationId, quantity }] }
    └─ Response: 201 Order object

GET /evtol/v1/orders?page=1&limit=10  [PAGINATED, REQUIRES AUTH]
    ├─ Query: page, limit
    ├─ Filter: user's own orders
    └─ Response: Paginated user orders

GET /evtol/v1/orders/{id}  [REQUIRES AUTH]
    ├─ Param: id
    ├─ Filter: user's own order
    └─ Response: Order object

GET /evtol/v1/orders/all?page=1&limit=10  [PAGINATED, REQUIRES AUTH]
    ├─ Query: page, limit
    ├─ Admin only
    └─ Response: Paginated all orders
```

## Pagination Flow Diagram

```
Client Request
    │
    ├─ Query: ?page=2&limit=20
    │
    ▼
Route Handler
    │
    ├─ Parse Query Parameters
    │
    ▼
PaginationQueryDto
    │
    ├─ Validate page (≥1)
    ├─ Validate limit (1-100)
    ├─ Set defaults
    │
    ▼
Controller
    │
    ├─ Get skip: (page-1)*limit = (2-1)*20 = 20
    ├─ Get limit: 20
    │
    ▼
Service Layer
    │
    ├─ Query Database with SKIP 20, TAKE 20
    ├─ Count Total Items
    │
    ▼
Calculate Pagination Metadata
    │
    ├─ totalPages = ceil(total/limit) = ceil(150/20) = 8
    ├─ hasNextPage = page < totalPages = 2 < 8 = true
    ├─ hasPrevPage = page > 1 = 2 > 1 = true
    │
    ▼
Response Object
    │
    └─ { data: [...], pagination: {...} }
```

## Data Flow Example: Get Users Page 2

```
1. HTTP Request
   GET /evtol/v1/users?page=2&limit=20

2. Express Route Handler
   ├─ Passes to getUserAllUsers Controller

3. UserController.getAllUsers()
   ├─ Creates: new PaginationQueryDto(2, 20)
   ├─ Validates: page=2 ✓, limit=20 ✓
   ├─ Calls: userService.getAllUsers(skip=20, take=20)

4. UserService.getAllUsers(20, 20)
   ├─ Executes 2 Parallel Queries:
   │  ├─ findMany({skip: 20, take: 20, orderBy: {id: desc}})
   │  └─ count()
   ├─ Returns: { data: [User, User, ...], total: 150 }

5. Controller Wraps Response
   ├─ Creates: new PaginatedResponseDto(data, 2, 20, 150)
   ├─ Calculates:
   │  ├─ totalPages = 8
   │  ├─ hasNextPage = true
   │  ├─ hasPrevPage = true

6. HTTP Response (200 OK)
   └─ {
        "data": [...],  // 20 users
        "pagination": {
          "page": 2,
          "limit": 20,
          "total": 150,
          "totalPages": 8,
          "hasNextPage": true,
          "hasPrevPage": true
        }
      }
```

## Swagger UI Navigation

```
Swagger UI (http://localhost:3000/api-docs)
│
├─ 🔐 Authentication
│  ├─ POST /authentication/register
│  ├─ POST /authentication/login
│  └─ POST /authentication/verify-email
│
├─ 👥 Users
│  ├─ POST /users
│  ├─ GET /users [PAGINATED]
│  ├─ GET /users/{id}
│  ├─ PUT /users/{id}
│  └─ DELETE /users/{id}
│
├─ 🚁 EVTOLs
│  ├─ POST /device/registerDevice
│  ├─ GET /device [PAGINATED]
│  ├─ GET /device/available [PAGINATED]
│  └─ POST /device/loadDevice/{id}
│
├─ 💊 Medications
│  ├─ POST /medications/register-med
│  ├─ GET /medications [PAGINATED]
│  └─ GET /medications/getMed/{id}
│
└─ 📦 Orders
   ├─ POST /orders
   ├─ GET /orders [PAGINATED]
   ├─ GET /orders/{id}
   └─ GET /orders/all [PAGINATED]
```

## Pagination Statistics

```
Total API Endpoints: 24
├─ Authentication: 3
├─ Users: 5
├─ EVTOLs: 4
├─ Medications: 3
└─ Orders: 4

Paginated Endpoints: 6 ✅
├─ GET /evtol/v1/users
├─ GET /evtol/v1/device
├─ GET /evtol/v1/device/available
├─ GET /evtol/v1/medications
├─ GET /evtol/v1/orders
└─ GET /evtol/v1/orders/all

Pagination Coverage: 25% of endpoints (6/24)
(25% is correct - only list endpoints are paginated)
```

## Response Status Codes

```
Success Responses
├─ 200 OK - Successful GET/PUT/DELETE
├─ 201 CREATED - Successful POST (new resource)
└─ 204 NO CONTENT - Successful DELETE (no response body)

Client Error Responses
├─ 400 BAD REQUEST - Invalid parameters/data
├─ 401 UNAUTHORIZED - Missing/invalid auth token
├─ 403 FORBIDDEN - Access denied
└─ 404 NOT FOUND - Resource doesn't exist

Server Error Responses
└─ 500 INTERNAL SERVER ERROR - Unexpected error
```

## Environment Setup

```
.env file required:
├─ PORT=3000
├─ DATABASE_URL=postgresql://...
├─ JWT_SECRET=your_secret_key
└─ CORS_ORIGIN=*

Running:
├─ Development: npm run dev
├─ Build: npm run build
├─ Production: npm start
└─ Swagger UI: http://localhost:3000/api-docs
```

## Performance Considerations

```
Page Size Recommendations
├─ Mobile: 5-10 items per page
├─ Web Desktop: 10-25 items per page
├─ Admin Dashboard: 20-50 items per page
└─ API Default: 10 items per page (max 100)

Database Query Optimization
├─ Using SKIP/TAKE (Prisma handles LIMIT/OFFSET)
├─ Counting in parallel with data query
├─ Ordering by ID for consistency
└─ Including relations as needed
```

## Security Considerations

```
Pagination Security
├─ Maximum limit enforced: 100 items
├─ Input validation on all parameters
├─ Prevents large offset attacks
└─ Protected by auth middleware

Authentication
├─ JWT Bearer Token required for protected endpoints
├─ User isolation (can't see others' orders)
├─ Admin checks for system-wide operations
└─ OTP verification for email
```

---

**Last Updated**: 2025-01-18
**Total Files Modified**: 18
**Test Endpoint**: http://localhost:3000/api-docs
