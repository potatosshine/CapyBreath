export interface Session {
  id: string;
  user_id: string;
  breaths_count: number;
  retention_time: number;
  recovery_time: number;
  session_date: string;
  duration_seconds: number;
  notes: string | null;
  mood_before: number | null;
  mood_after: number | null;
  technique_variant: string;
  created_at: string;
  updated_at: string;
}

export interface SessionDetail extends Session {
  is_personal_best: boolean;
}

export interface SessionListItem {
  id: string;
  breaths_count: number;
  retention_time: number;
  session_date: string;
  technique_variant: string;
  mood_improvement: number | null;
  is_personal_best: boolean;
}

export interface PaginatedSessionsResponse {
  items: SessionListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SessionCreateRequest {
  breaths_count?: number;
  retention_time: number;
  recovery_time?: number;
  duration_seconds: number;
  notes?: string;
  mood_before?: number;
  mood_after?: number;
  technique_variant?: 'standard' | 'advanced' | 'beginner' | 'power';
}

export interface SessionQueryParams {
  page?: number;
  size?: number;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
}
