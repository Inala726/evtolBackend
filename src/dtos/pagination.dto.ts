/**
 * Pagination Query DTO
 * Used to parse query parameters for pagination
 */
export class PaginationQueryDto {
  page: number = 1;
  limit: number = 10;

  constructor(page?: string | number, limit?: string | number) {
    this.page = typeof page === "string" ? parseInt(page, 10) : page ?? 1;
    this.limit = typeof limit === "string" ? parseInt(limit, 10) : limit ?? 10;

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

/**
 * Paginated Response DTO
 * Wrapper for paginated list responses
 */
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
