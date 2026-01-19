# Code Changes Reference

## Pagination Response Format

All paginated endpoints now return this consistent structure:

```typescript
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

## Example Controller Pattern

Before Pagination:
```typescript
public getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await this.userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
```

After Pagination:
```typescript
public getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pagination = new PaginationQueryDto(
      req.query.page,
      req.query.limit
    );
    const { data, total } = await this.userService.getAllUsers(
      pagination.getSkip(),
      pagination.limit
    );
    const response = new PaginatedResponseDto(
      data,
      pagination.page,
      pagination.limit,
      total
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
```

## Example Service Pattern

Before Pagination:
```typescript
async getAllUsers(): Promise<User[]> {
  return await db.user.findMany();
}
```

After Pagination:
```typescript
async getAllUsers(skip?: number, take?: number): Promise<{ data: User[]; total: number }> {
  const [users, total] = await Promise.all([
    db.user.findMany({
      skip: skip || 0,
      take: take || 10,
      orderBy: { id: "desc" },
    }),
    db.user.count(),
  ]);
  return { data: users, total };
}
```

## Pagination Helper Classes

### PaginationQueryDto
```typescript
export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;

  constructor(page?: string | number, limit?: string | number) {
    this.page = typeof page === "string" ? parseInt(page, 10) : page;
    this.limit = typeof limit === "string" ? parseInt(limit, 10) : limit;

    // Validate and set defaults
    if (isNaN(this.page) || this.page < 1) {
      this.page = 1;
    }
    if (isNaN(this.limit) || this.limit < 1) {
      this.limit = 10;
    }
    // Max limit of 100
    if (this.limit > 100) {
      this.limit = 100;
    }
  }

  getSkip(): number {
    return (this.page - 1) * this.limit;
  }
}
```

### PaginatedResponseDto
```typescript
export class PaginatedResponseDto<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  constructor(
    data: T[],
    page: number,
    limit: number,
    total: number
  ) {
    this.data = data;
    const totalPages = Math.ceil(total / limit);
    this.pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}
```

## List Endpoints Implementation

### 1. Users - GET /evtol/v1/users

**Controller:**
```typescript
public getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const pagination = new PaginationQueryDto(req.query.page, req.query.limit);
    const { data, total } = await this.userService.getAllUsers(
      pagination.getSkip(),
      pagination.limit
    );
    const response = new PaginatedResponseDto(data, pagination.page, pagination.limit, total);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
```

### 2. EVTOLs - GET /evtol/v1/device

**Service:**
```typescript
async getAllEvtols(skip?: number, take?: number): Promise<{ data: eVTOL[]; total: number }> {
  const [evtols, total] = await Promise.all([
    db.eVTOL.findMany({
      skip: skip || 0,
      take: take || 10,
      orderBy: { id: "desc" },
    }),
    db.eVTOL.count(),
  ]);
  return { data: evtols, total };
}
```

### 3. Available EVTOLs - GET /evtol/v1/device/available

**Service:**
```typescript
async getAvailableEvtols(skip?: number, take?: number): Promise<{ data: eVTOL[]; total: number }> {
  const [evtols, total] = await Promise.all([
    db.eVTOL.findMany({
      where: { state: State.IDLE, battery: { gte: 25 } },
      skip: skip || 0,
      take: take || 10,
      orderBy: { id: "desc" },
    }),
    db.eVTOL.count({ where: { state: State.IDLE, battery: { gte: 25 } } }),
  ]);
  return { data: evtols, total };
}
```

### 4. Medications - GET /evtol/v1/medications

**Service:**
```typescript
async getAllMedications(skip?: number, take?: number): Promise<{ data: Medication[]; total: number }> {
  const [medications, total] = await Promise.all([
    db.medication.findMany({
      skip: skip || 0,
      take: take || 10,
      orderBy: { id: "desc" },
    }),
    db.medication.count(),
  ]);
  return { data: medications, total };
}
```

### 5. User Orders - GET /evtol/v1/orders

**Service:**
```typescript
async getUserOrders(
  userId: number,
  skip?: number,
  take?: number
): Promise<{ data: (Order & { items: OrderItem[] })[]; total: number }> {
  const [orders, total] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { orderDate: "desc" },
      skip: skip || 0,
      take: take || 10,
    }),
    db.order.count({ where: { userId } }),
  ]);
  return { data: orders, total };
}
```

### 6. All Orders - GET /evtol/v1/orders/all

**Service:**
```typescript
async getAllOrders(skip?: number, take?: number): Promise<{ data: (Order & { items: OrderItem[] })[]; total: number }> {
  const [orders, total] = await Promise.all([
    db.order.findMany({
      include: {
        items: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { orderDate: "desc" },
      skip: skip || 0,
      take: take || 10,
    }),
    db.order.count(),
  ]);
  return { data: orders, total };
}
```

## Swagger Integration in Main App

**Before:**
```typescript
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./utils/errorhandler.util";

// ... rest of code
```

**After:**
```typescript
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./utils/errorhandler.util";

// ... 

app.use(cors(corsOption));
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// ... rest of code
```

## Swagger JSDoc Comments Pattern

### Auth Routes Example
```typescript
/**
 * @swagger
 * /evtol/v1/authentication/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already taken
 */
```

### Paginated Endpoint Example
```typescript
/**
 * @swagger
 * /evtol/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsers'
 */
```

## Usage in Frontend

### React Example
```typescript
const [page, setPage] = useState(1);
const [users, setUsers] = useState([]);
const [pagination, setPagination] = useState(null);

useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch(
      `/evtol/v1/users?page=${page}&limit=10`
    );
    const { data, pagination: paginationData } = await response.json();
    setUsers(data);
    setPagination(paginationData);
  };
  
  fetchUsers();
}, [page]);

return (
  <div>
    {/* Render users */}
    <button 
      onClick={() => setPage(page - 1)} 
      disabled={!pagination?.hasPrevPage}
    >
      Previous
    </button>
    <span>Page {pagination?.page} of {pagination?.totalPages}</span>
    <button 
      onClick={() => setPage(page + 1)} 
      disabled={!pagination?.hasNextPage}
    >
      Next
    </button>
  </div>
);
```

### Vanilla JS Example
```javascript
async function getUsers(page = 1, limit = 10) {
  const response = await fetch(`/evtol/v1/users?page=${page}&limit=${limit}`);
  const { data, pagination } = await response.json();
  
  console.log(`Showing ${data.length} users`);
  console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
  console.log(`Total users: ${pagination.total}`);
  
  return { data, pagination };
}
```

---

**Note**: All implementations follow the same pattern for consistency across endpoints.
