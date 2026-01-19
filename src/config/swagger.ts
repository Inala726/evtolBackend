import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EVTOL Drone Delivery API",
      version: "1.0.0",
      description:
        "A comprehensive API for managing autonomous drone deliveries of medications. This API handles drone (eVTOL) management, medication inventory, order processing, and delivery dispatch operations.",
      contact: {
        name: "API Support",
        email: "support@evtol-delivery.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
      {
        url: "https://api.evtol-delivery.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication",
        },
      },
      schemas: {
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
              description: "Current page number (1-indexed)",
            },
            limit: {
              type: "integer",
              example: 10,
              description: "Number of items per page (max 100)",
            },
            total: {
              type: "integer",
              example: 50,
              description: "Total number of items",
            },
            totalPages: {
              type: "integer",
              example: 5,
              description: "Total number of pages",
            },
            hasNextPage: {
              type: "boolean",
              example: true,
              description: "Whether there is a next page",
            },
            hasPrevPage: {
              type: "boolean",
              example: false,
              description: "Whether there is a previous page",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            emailVerified: {
              type: "boolean",
              example: false,
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              example: "USER",
            },
          },
        },
        EVTOL: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            serialNumber: {
              type: "string",
              example: "SN-001-20250101",
              description: "Unique serial number",
            },
            model: {
              type: "string",
              enum: ["LIGHTWEIGHT", "MIDDLEWEIGHT", "CRUISERWEIGHT", "HEAVYWEIGHT"],
              example: "MIDDLEWEIGHT",
            },
            battery: {
              type: "integer",
              example: 85,
              description: "Battery percentage (0-100)",
            },
            weightLimit: {
              type: "number",
              example: 2.5,
              description: "Weight limit in kg",
            },
            state: {
              type: "string",
              enum: ["IDLE", "LOADING", "LOADED", "DELIVERING", "DELIVERED", "RETURNING"],
              example: "IDLE",
            },
            image: {
              type: "string",
              nullable: true,
              example: "https://example.com/image.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Medication: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Aspirin",
            },
            code: {
              type: "string",
              example: "ASP-001",
              description: "Unique medication code",
            },
            weight: {
              type: "number",
              example: 0.5,
              description: "Weight per unit in kg",
            },
            quantity: {
              type: "integer",
              example: 100,
              description: "Available quantity in stock",
            },
            image: {
              type: "string",
              nullable: true,
              example: "https://example.com/med.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            medicationId: {
              type: "integer",
              example: 1,
            },
            quantity: {
              type: "integer",
              example: 5,
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            orderDate: {
              type: "string",
              format: "date-time",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
          },
        },
        PaginatedUsers: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },
        PaginatedEVTOLs: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/EVTOL",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },
        PaginatedMedications: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Medication",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },
        PaginatedOrders: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Order",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            statusCode: {
              type: "integer",
              example: 400,
            },
            message: {
              type: "string",
              example: "Bad Request",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "EVTOLs",
        description: "Drone (eVTOL) management endpoints",
      },
      {
        name: "Medications",
        description: "Medication inventory endpoints",
      },
      {
        name: "Orders",
        description: "Order management endpoints",
      },
    ],
  },
  apis: [
    "./src/routes/auth.routes.ts",
    "./src/routes/user.routes.ts",
    "./src/routes/evtol.routes.ts",
    "./src/routes/medication.routes.ts",
    "./src/routes/order.routes.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
