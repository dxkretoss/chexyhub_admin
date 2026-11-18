# CHEXY HUB — Development & Architecture Rules

## 1. Global SQL Database Management
- **Rule**: Whenever any table, column, policy, trigger, index, or RPC function is created or modified in Supabase, the full definition MUST be documented and kept up to date in `docs/schema.sql`.
- **Purpose**: If the database is ever reset or migrated to another instance, executing `docs/schema.sql` will recreate the complete database architecture without missing any schema, seed data, or policies.

## 2. Supabase Custom Authentication (Zero Built-In Supabase Auth)
- **Rule**: Never use built-in Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`, etc.).
- **Rule**: All authentication flows must use custom tables:
  - `public.users` for storefront customers
  - `public.admins` for atelier control staff
- **Rule**: Passwords must always be stored in salted cryptographic hash format (e.g., Bcrypt / pgcrypto with 10 salt rounds). Plaintext passwords must NEVER be saved in the database or logged.
- **Rule**: Client sessions must be managed using signed cryptographic Bearer Tokens (JWT). The token must be sent in the `Authorization: Bearer <TOKEN>` HTTP header for authenticated operations.

## 3. Product Media & Storage
- **Rule**: When creating or editing products in the Admin Panel, images uploaded from the user's computer must be stored directly in the Supabase Storage bucket (`atelier-products`).
- **Rule**: The resulting public CDN URL from the bucket must be stored in the product record (`thumbnail` and `gallery`).

## 4. Supabase Edge Functions
- **Rule**: All backend business logic and custom auth functions must be written as Supabase Edge Functions in the `supabase/functions/` directory.
- **Rule**: A comprehensive record of every Edge Function (endpoint, method, request payload, response format, and required headers) must be maintained in `docs/edge_functions.md`.

## 5. Documentation & Changelog Tracking
- **Rule**: All project developments must be documented inside the `docs/` directory:
  - Global system log: `docs/GLOBAL_CHANGELOG.md`
  - Date-wise logs: `docs/logs/YYYY-MM-DD.md`
- **Rule**: The `docs/` directory must always be listed in `.gitignore` so that internal architectural records and credentials are never pushed to public Git repositories.

## 6. Luxury Atelier Theme Standards
- **Rule**: Maintain the high-fashion editorial aesthetic of CHEXY HUB (Zara-inspired minimalist monochrome, crisp typography, hairline borders, no generic components). All shirt imagery must represent 100% checkered patterns.
