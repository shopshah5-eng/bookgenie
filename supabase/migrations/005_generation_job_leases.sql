-- ========================================================
-- Migration 005: Generation Job Leases & Distributed Claims
-- ========================================================

-- 1. Ensure jobs table has lease tracking columns
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS claimed_at timestamptz;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS started_at timestamptz;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS worker_id text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS attempt_count integer DEFAULT 0;

-- 2. Index for finding unleased or expired queued jobs
CREATE INDEX IF NOT EXISTS idx_jobs_status_claimed
  ON public.jobs (status, claimed_at)
  WHERE status IN ('queued', 'processing');

-- 3. Atomic Job Claim and Lease Renewal Function
CREATE OR REPLACE FUNCTION public.claim_generation_job(
  p_job_id uuid,
  p_worker_id text,
  p_lease_seconds integer DEFAULT 180
)
RETURNS boolean AS $$
DECLARE
  v_claimed boolean := false;
BEGIN
  UPDATE public.jobs
  SET
    claimed_at = now(),
    started_at = COALESCE(started_at, now()),
    worker_id = p_worker_id,
    attempt_count = attempt_count + 1,
    status = 'processing',
    updated_at = now()
  WHERE id = p_job_id
    AND (
      status = 'queued'
      OR (status = 'processing' AND (claimed_at IS NULL OR claimed_at < now() - (p_lease_seconds || ' seconds')::interval))
    );

  IF FOUND THEN
    v_claimed := true;
  END IF;

  RETURN v_claimed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
