-- AICTE SAKSHAM PostgreSQL Production Database Schema
-- Smart India Hackathon: Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System
-- Database: PostgreSQL 15+ / Supabase PostgreSQL with Row Level Security (RLS)

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
  'INSTITUTION_USER',
  'REGIONAL_OFFICER',
  'BUREAU_OFFICER',
  'EVC_MEMBER',
  'SUPER_ADMIN'
);

CREATE TYPE workflow_route AS ENUM (
  'SCRUTINY_ONLY',
  'SCRUTINY_EVC',
  'EVC_SAC',
  'SCRUTINY_EVC_SAC',
  'EVC_ONLY'
);

CREATE TYPE application_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'UNDER_SCRUTINY',
  'DEFICIENCY_REPORTED',
  'PENDING_EVC',
  'EVC_SCHEDULED',
  'EVC_COMPLETED',
  'PENDING_SAC',
  'APPROVED',
  'REJECTED',
  'ON_HOLD'
);

CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE doc_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');
CREATE TYPE evc_status AS ENUM ('PENDING_SCHEDULING', 'PROPOSED', 'SCHEDULED', 'CONDUCTED', 'POSTPONED', 'REPORT_SUBMITTED');
CREATE TYPE undertaking_status AS ENUM ('PENDING', 'DUE_SOON', 'SUBMITTED', 'UNDER_VERIFICATION', 'VERIFIED', 'REJECTED_FOR_CORRECTION', 'OVERDUE');

-- 2. INSTITUTIONS
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  established_year INT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  head_of_institution VARCHAR(255) NOT NULL,
  total_students INT DEFAULT 0,
  total_faculty INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES AND ROLES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role NOT NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  region VARCHAR(50) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATIONS
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number VARCHAR(100) UNIQUE NOT NULL,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  academic_year VARCHAR(20) NOT NULL,
  region VARCHAR(50) NOT NULL,
  approval_type VARCHAR(150) NOT NULL,
  workflow_route workflow_route NOT NULL DEFAULT 'SCRUTINY_ONLY',
  current_stage VARCHAR(100) NOT NULL DEFAULT 'APPLICATION_SUBMITTED',
  status application_status NOT NULL DEFAULT 'SUBMITTED',
  risk_level risk_level NOT NULL DEFAULT 'LOW',
  assigned_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  deadline_date TIMESTAMPTZ NOT NULL,
  is_overdue BOOLEAN DEFAULT FALSE,
  intake_proposed INT NOT NULL DEFAULT 0,
  intake_approved_previous INT DEFAULT 0,
  programmes_proposed JSONB DEFAULT '[]'::JSONB,
  deficiency_count INT DEFAULT 0,
  pending_observations INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APPLICATION STAGE HISTORY
CREATE TABLE application_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage VARCHAR(100) NOT NULL,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  actor_id UUID REFERENCES profiles(id),
  actor_name VARCHAR(255) NOT NULL,
  actor_role user_role NOT NULL,
  action_taken VARCHAR(255) NOT NULL,
  comments TEXT,
  sla_days INT NOT NULL DEFAULT 14,
  elapsed_days INT DEFAULT 0,
  sla_breached BOOLEAN DEFAULT FALSE
);

-- 6. APPLICATION DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  document_type VARCHAR(150) NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by VARCHAR(255) NOT NULL,
  expiry_date DATE,
  verification_status doc_status NOT NULL DEFAULT 'PENDING',
  verified_by VARCHAR(255),
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  file_url TEXT NOT NULL
);

-- 7. EVC VISITS
CREATE TABLE evc_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  region VARCHAR(50) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(50) NOT NULL,
  status evc_status NOT NULL DEFAULT 'SCHEDULED',
  committee_members JSONB NOT NULL DEFAULT '[]'::JSONB,
  checklist JSONB NOT NULL DEFAULT '[]'::JSONB,
  visit_outcome VARCHAR(100),
  report_summary TEXT,
  conducted_at TIMESTAMPTZ,
  report_uploaded_at TIMESTAMPTZ,
  follow_up_tasks JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMPLIANCE UNDERTAKINGS
CREATE TABLE compliance_undertakings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  issued_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status undertaking_status NOT NULL DEFAULT 'PENDING',
  evidence_required TEXT NOT NULL,
  evidence_submitted JSONB,
  assigned_verifier_id UUID REFERENCES profiles(id),
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  reminders_sent INT DEFAULT 0,
  last_reminder_date DATE,
  escalation_level INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS AND ESCALATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL DEFAULT 'INFO',
  target_role VARCHAR(50) NOT NULL DEFAULT 'ALL',
  target_user_id UUID REFERENCES profiles(id),
  related_application_id UUID REFERENCES applications(id),
  related_record_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  escalation_level INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. IMMUTABLE DIGITAL AUDIT TRAIL
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  actor_id VARCHAR(100) NOT NULL,
  actor_name VARCHAR(255) NOT NULL,
  actor_role user_role NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NOT NULL,
  target_id VARCHAR(100) NOT NULL,
  target_title VARCHAR(255) NOT NULL,
  previous_state VARCHAR(150),
  new_state VARCHAR(150),
  details TEXT NOT NULL,
  ip_address VARCHAR(50) NOT NULL
);

-- 11. INDEXES FOR PERFORMANCE
CREATE INDEX idx_apps_institution ON applications(institution_id);
CREATE INDEX idx_apps_region ON applications(region);
CREATE INDEX idx_apps_status ON applications(status);
CREATE INDEX idx_apps_deadline ON applications(deadline_date);
CREATE INDEX idx_docs_institution ON documents(institution_id);
CREATE INDEX idx_docs_expiry ON documents(expiry_date);
CREATE INDEX idx_evc_app ON evc_visits(application_id);
CREATE INDEX idx_utk_institution ON compliance_undertakings(institution_id);
CREATE INDEX idx_audit_target ON audit_events(target_id);
CREATE INDEX idx_audit_timestamp ON audit_events(timestamp DESC);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_undertakings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Institutions can only see their own records
CREATE POLICY "Institutions view own applications" ON applications
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE institution_id = applications.institution_id)
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('REGIONAL_OFFICER', 'BUREAU_OFFICER', 'SUPER_ADMIN'))
  );

-- Audit log is append-only: No user may UPDATE or DELETE
CREATE POLICY "Audit trail is immutable" ON audit_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Audit trail readable by officials" ON audit_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('REGIONAL_OFFICER', 'BUREAU_OFFICER', 'SUPER_ADMIN'))
  );
