# Par 5 Golf Blog

This is a golf blog developed in TypeScript utilizing the React framework.

This is for fun for myself and others if they would like.

The backend for this application is using Supabase.

### Supabase Info

- PostgreSQL — posts, users, tags, everything. You write SQL to define your tables, and Supabase hosts it.
- Authentication — Supabase gives users a JWT token automatically.
- Auto-generated API - Automatically generates REST APIs for tables.
- Row Level Security (RLS) - Security layer. Instead of writing backend middleware to check if a user is allowed to do something, can write rules directly on the database table. Supabase will automatically enforce these rules.
