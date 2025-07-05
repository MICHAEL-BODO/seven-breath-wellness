-- Users table (linked to Supabase Auth)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text,
  created_at timestamp with time zone DEFAULT current_timestamp
);

-- Breathing Techniques (static content)
CREATE TABLE public.techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  pain_point text,
  inhale_seconds int,
  hold_seconds int,
  exhale_seconds int
);

-- Breath Sessions
CREATE TABLE public.breath_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  technique_id uuid REFERENCES public.techniques(id),
  duration_seconds int,
  completed_at timestamp with time zone DEFAULT current_timestamp
);

-- Journal Entries
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  technique_id uuid REFERENCES public.techniques(id),
  mood text,
  notes text,
  created_at timestamp with time zone DEFAULT current_timestamp
);

-- Badges
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  description text,
  criteria jsonb
);

-- User Badges (junction table)
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES public.badges(id),
  earned_at timestamp with time zone DEFAULT current_timestamp
);

-- Habit Reminders
CREATE TABLE public.habit_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  channel text,
  time_of_day time,
  active boolean DEFAULT true,
  override_until timestamp with time zone
);

-- AI Logs (for personalization history)
CREATE TABLE public.ai_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  interaction_type text,
  interaction_value jsonb,
  created_at timestamp with time zone DEFAULT current_timestamp
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for techniques (public read access)
CREATE POLICY "Techniques are viewable by everyone" ON public.techniques
  FOR SELECT USING (true);

-- RLS Policies for breath_sessions
CREATE POLICY "Users can view their own sessions" ON public.breath_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON public.breath_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.breath_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for journal_entries
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for badges (public read access)
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can receive badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for habit_reminders
CREATE POLICY "Users can view their own reminders" ON public.habit_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" ON public.habit_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON public.habit_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" ON public.habit_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ai_logs
CREATE POLICY "Users can view their own AI logs" ON public.ai_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI logs" ON public.ai_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function: Award badge if earned
CREATE OR REPLACE FUNCTION public.award_badge_if_earned(user_id uuid, technique_id uuid)
RETURNS void AS $$
BEGIN
  -- Example logic (replace with real criteria logic as needed)
  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT user_id, id FROM public.badges
  WHERE criteria @> jsonb_build_object('technique_id', technique_id)::jsonb
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log session and check streak
CREATE OR REPLACE FUNCTION public.log_session_and_check_streak(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Placeholder logic: add streak tracking updates here
  UPDATE public.users SET display_name = display_name WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update personalization model
CREATE OR REPLACE FUNCTION public.update_personalization_model(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.ai_logs (user_id, interaction_type, interaction_value)
  VALUES (user_id, 'update_model', jsonb_build_object('status', 'success'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Pause reminders
CREATE OR REPLACE FUNCTION public.pause_reminders(user_id uuid, duration_minutes int)
RETURNS void AS $$
BEGIN
  UPDATE public.habit_reminders
  SET override_until = now() + (duration_minutes || ' minutes')::interval
  WHERE user_id = pause_reminders.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;