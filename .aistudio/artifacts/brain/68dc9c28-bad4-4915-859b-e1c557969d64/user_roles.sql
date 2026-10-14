-- Create the table
CREATE TABLE IF NOT EXISTS public.user_roles (
    "Username" TEXT PRIMARY KEY,
    "Password" TEXT NOT NULL,
    "Role" TEXT NOT NULL
);

-- RLS: Only allow read access via service role
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Insert the admin user with a bcrypt hash of 'Acquire@8131'
-- Hash generated: $2b$10$Q5SkbHPHNE9Kkk.8WlK5XOdDSRnpcKjHprVuPZR9g.fSLh2IXyPue
INSERT INTO public.user_roles ("Username", "Password", "Role")
VALUES ('Admin@acquire.com', '$2b$10$Q5SkbHPHNE9Kkk.8WlK5XOdDSRnpcKjHprVuPZR9g.fSLh2IXyPue', 'admin')
ON CONFLICT ("Username") DO UPDATE SET 
  "Password" = EXCLUDED."Password",
  "Role" = EXCLUDED."Role";
