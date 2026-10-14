-- SQL script to ensure the 'leads' table is structured correctly in Supabase.
-- This script can be run in the Supabase SQL Editor.

-- 1. Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    phone TEXT,
    email TEXT,
    treatment TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'New Leads',
    follow_up_date DATE,
    notes JSONB DEFAULT '[]'::jsonb
);

-- 2. Add the constraint to ensure only allowed statuses are used
-- First, remove any existing constraint with the same name if it exists, to avoid errors
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE public.leads ADD CONSTRAINT valid_status CHECK (status IN ('New Leads', 'RNR', 'Followup', 'Converted', 'Junk'));

-- 3. Ensure the default status is correctly set
ALTER TABLE public.leads ALTER COLUMN status SET DEFAULT 'New Leads';

-- 4. Create an index on status and follow_up_date for better performance with filters
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_date ON public.leads(follow_up_date);
