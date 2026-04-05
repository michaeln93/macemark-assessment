-- Macemark Assessment Tool — Supabase Table Setup
--
-- Run this SQL in your Supabase project's SQL Editor:
-- 1. Go to https://supabase.com and create a free account
-- 2. Create a new project (note your project URL and anon key)
-- 3. Go to SQL Editor in the sidebar
-- 4. Paste this entire file and click "Run"
-- 5. Copy your project URL and anon key into index.html and results.html

-- Create the assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Facility info (flat fields for easy querying/filtering)
  facility_name TEXT NOT NULL DEFAULT '',
  contact_person TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  facility_type TEXT DEFAULT '',
  staff_count TEXT DEFAULT '',

  -- Section data (JSON for flexibility)
  facility_data JSONB DEFAULT '{}',
  cssd_data JSONB DEFAULT '{}',
  endoscopy_data JSONB DEFAULT '{}',
  consumables_data JSONB DEFAULT '{}',
  compliance_data JSONB DEFAULT '{}',

  -- Results
  gaps JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  gap_count INTEGER DEFAULT 0,
  rec_count INTEGER DEFAULT 0,
  summary_text TEXT DEFAULT '',
  bundling_interest TEXT DEFAULT ''
);

-- Enable Row Level Security (required by Supabase)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (submissions from the public assessment form)
CREATE POLICY "Allow public inserts" ON assessments
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (results dashboard is accessible by link)
CREATE POLICY "Allow public reads" ON assessments
  FOR SELECT TO anon
  USING (true);

-- Index for faster date-based queries
CREATE INDEX idx_assessments_created_at ON assessments (created_at DESC);

-- Index for filtering by facility type
CREATE INDEX idx_assessments_facility_type ON assessments (facility_type);
