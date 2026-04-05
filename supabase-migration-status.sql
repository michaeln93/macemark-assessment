-- Add status column to assessments table
-- Run this in Supabase SQL Editor

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Allow anyone to UPDATE status (for dashboard status changes)
CREATE POLICY "Allow public updates" ON assessments
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
