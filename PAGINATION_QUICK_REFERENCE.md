# Quick Reference Guide - Pagination & Swagger

## Getting Started

### 1. Start the Server
```bash
npm run dev
```

### 2. Access Swagger Documentation
Open your browser: **http://localhost:3000/api-docs**

## Pagination Endpoints

### Users
```
GET /evtol/v1/users?page=1&limit=10
```
Returns paginated list of all users

### EVTOLs (Drones)
```
GET /evtol/v1/device?page=1&limit=10
GET /evtol/v1/device/available?page=1&limit=10
```
- First endpoint: All drones (any state)
- Second endpoint: Only available drones (IDLE + battery ≥ 25%)

### Medications
```
GET /evtol/v1/medications?page=1&limit=10
```
Returns paginated list of all medications

### Orders
```
GET /evtol/v1/orders?page=1&limit=10              # User's orders (requires auth)
GET /evtol/v1/orders/all?page=1&limit=10          # All orders (requires auth)
```

## Query Parameter Options

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | 1 | N/A | Page number (1-indexed) |
| `limit` | 10 | 100 | Items per page |

### Example URLs
```
/evtol/v1/users?page=1&limit=5
/evtol/v1/device?page=2&limit=20
/evtol/v1/medications
/evtol/v1/orders/all?limit=50
```

## Response Structure

All paginated endpoints return this format:

```json
{
  "data": [
    {
      "id": 1,
      "name": "...",
      "...": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Pagination Info

The `pagination` object provides:
- **page**: Current page number
- **limit**: Items returned per page
- **total**: Total items across all pages
- **totalPages**: Total number of pages available
- **hasNextPage**: Is there another page? (useful for UI)
- **hasPrevPage**: Is there a previous page?

## Common Pagination Scenarios

### Get First 10 Items
```
GET /evtol/v1/users?page=1&limit=10
```

### Get Next 10 Items
```
GET /evtol/v1/users?page=2&limit=10
```

### Get 50 Items at Once
```
GET /evtol/v1/medications?page=1&limit=50
```

### Maximum Items (100)
```
GET /evtol/v1/device?page=1&limit=100
```

## Files Modified/Created

### New Files
- `src/dtos/pagination.dto.ts` - Pagination DTOs
- `src/config/swagger.ts` - Swagger configuration
- `PAGINATION_SWAGGER_DOCUMENTATION.md` - Full documentation

### Modified Controllers
- `src/controllers/user.controller.ts` - Added pagination to getAllUsers
- `src/controllers/evtol.controller.ts` - Added pagination to getAllEvtols, getAvailableEvtols
- `src/controllers/medication.controller.ts` - Added pagination to getAllMedications
- `src/controllers/orders.controller.ts` - Added pagination to getUserOrders, getAllOrders

### Modified Services
- `src/service/impl/users.impl.ts` - Updated getAllUsers method
- `src/service/impl/evtol.impl.ts` - Updated getAllEvtols, getAvailableEvtols
- `src/service/impl/medication.impl.ts` - Updated getAllMedications
- `src/service/impl/orders.impl.ts` - Updated getUserOrders, getAllOrders

### Modified Routes (with Swagger docs)
- `src/routes/auth.routes.ts` - Added Swagger documentation
- `src/routes/user.routes.ts` - Added Swagger documentation
- `src/routes/evtol.routes.ts` - Added Swagger documentation
- `src/routes/medication.routes.ts` - Added Swagger documentation
- `src/routes/order.routes.ts` - Added Swagger documentation

### Updated Main File
- `src/index.ts` - Integrated Swagger UI

## Testing in Swagger UI

1. Navigate to: **http://localhost:3000/api-docs**
2. Click on any endpoint (e.g., "GET /evtol/v1/users")
3. Click "Try it out"
4. Modify query parameters if needed
5. Click "Execute"
6. View response

## Troubleshooting

### If Swagger UI doesn't load:
- Ensure dependencies are installed: `npm install`
- Verify port matches in swagger config
- Check no other app is using the port

### If pagination returns error:
- Ensure `page` is ≥ 1
- Ensure `limit` is between 1 and 100
- Check authentication headers if endpoint requires auth

### If responses don't have pagination object:
- Verify you're using a list endpoint
- Single resource endpoints (GET by ID) don't return pagination

## Useful cURL Commands

```bash
# Get first page of users
curl "http://localhost:3000/evtol/v1/users?page=1&limit=10"

# Get second page with 20 items
curl "http://localhost:3000/evtol/v1/device?page=2&limit=20"

# Get medications (default page and limit)
curl "http://localhost:3000/evtol/v1/medications"

# Get available drones with auth token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/evtol/v1/device/available?page=1"

# Get orders with auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/evtol/v1/orders?page=1&limit=15"
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate resource |
| 500 | Server Error |

---

**Swagger Documentation**: http://localhost:3000/api-docs
**Created**: 2025-01-18
