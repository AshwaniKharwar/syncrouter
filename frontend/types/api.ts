export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  is_active: boolean;
  credits: number | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIModel {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  company: Company;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModelProvider {
  id: string;
  name: string;
  website: string | null;
  input_token_cost: number;
  output_token_cost: number;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ApiKeyCreateResponse = ApiKey;

export interface ApiKeyUpdate {
  name?: string;
  is_active?: boolean;
}

export interface ApiKeyCreate {
  name: string;
}

export interface AuthMessage {
  message: string;
}
