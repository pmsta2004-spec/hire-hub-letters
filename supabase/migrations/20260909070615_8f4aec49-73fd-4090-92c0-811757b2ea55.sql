CREATE TABLE public.org_settings (
  id int PRIMARY KEY DEFAULT 1,
  name text NOT NULL DEFAULT 'AI-HRM',
  tagline text NOT NULL DEFAULT 'Artificial Intelligence Human Resource Manager',
  website text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address1 text NOT NULL DEFAULT '',
  address2 text NOT NULL DEFAULT '',
  gst text NOT NULL DEFAULT '',
  cin text NOT NULL DEFAULT '',
  signatory_name text NOT NULL DEFAULT 'Authorised Signatory',
  signatory_title text NOT NULL DEFAULT 'Head of Human Resources',
  hr_email text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_settings_single_row CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_settings TO anon, authenticated;
GRANT ALL ON public.org_settings TO service_role;
ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_settings open" ON public.org_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.org_settings (id, hr_email, email) VALUES (1, 'pm.sta958@gmail.com', 'pm.sta958@gmail.com');

CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'Fresher',
  source text NOT NULL DEFAULT 'Resume upload',
  stage text NOT NULL DEFAULT 'Applied',
  resume_text text NOT NULL DEFAULT '',
  resume_file text NOT NULL DEFAULT '',
  ai_score int,
  ai_summary text NOT NULL DEFAULT '',
  ai_strengths text[] NOT NULL DEFAULT '{}',
  ai_gaps text[] NOT NULL DEFAULT '{}',
  interview_at timestamptz,
  interview_mode text NOT NULL DEFAULT 'Google Meet',
  interview_status text NOT NULL DEFAULT 'Not scheduled',
  interview_notes text NOT NULL DEFAULT '',
  invite_sent_at timestamptz,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO anon, authenticated;
GRANT ALL ON public.candidates TO service_role;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "candidates open" ON public.candidates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_id text NOT NULL,
  type text NOT NULL DEFAULT 'offer',
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'Fresher',
  department text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  reporting_to text NOT NULL DEFAULT '',
  start_date date,
  letter_date date,
  ctc text NOT NULL DEFAULT '',
  pay_cycle text NOT NULL DEFAULT 'Monthly',
  probation text NOT NULL DEFAULT '',
  work_hours text NOT NULL DEFAULT '',
  stipend text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  signatory_name text NOT NULL DEFAULT '',
  signatory_title text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.letters TO anon, authenticated;
GRANT ALL ON public.letters TO service_role;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "letters open" ON public.letters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.id_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL DEFAULT '',
  letter_ref text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'Fresher',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  blood_group text NOT NULL DEFAULT '',
  emergency_contact text NOT NULL DEFAULT '',
  issue_date date,
  valid_till date,
  photo text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.id_cards TO anon, authenticated;
GRANT ALL ON public.id_cards TO service_role;
ALTER TABLE public.id_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "id_cards open" ON public.id_cards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  message text NOT NULL DEFAULT '',
  ai_reply text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback TO anon, authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback open" ON public.feedback FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE SET NULL,
  to_email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  purpose text NOT NULL DEFAULT 'Interview invitation',
  status text NOT NULL DEFAULT 'Draft',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_log TO anon, authenticated;
GRANT ALL ON public.email_log TO service_role;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_log open" ON public.email_log FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);