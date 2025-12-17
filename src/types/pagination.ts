// src/types/pagination.ts
export interface PaginationMeta {
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
