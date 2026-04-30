-- 1. Enable RLS
-- (Run this after creating tables if not already enabled)

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_color TEXT,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Day Passes Table
CREATE TABLE IF NOT EXISTS public.day_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount_paid INTEGER, -- in paise
  status TEXT DEFAULT 'active'
);

-- 4. Game Sessions Table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  mode TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  players_count INTEGER,
  was_free BOOLEAN DEFAULT FALSE
);

-- 5. Game Scores Table
CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE NOT NULL,
  player_name TEXT,
  duo_name TEXT,
  score INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE,
  mode TEXT
);

-- 6. Game Content Table (Public Content)
CREATE TABLE IF NOT EXISTS public.game_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT,
  category TEXT,
  content_text TEXT,
  emoji TEXT,
  intensity_level INTEGER,
  mode TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Razorpay Webhooks (Admin/Internal Audit)
CREATE TABLE IF NOT EXISTS public.razorpay_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  user_id UUID,
  payload JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- 8. Game Feedback / Requested Games
CREATE TABLE IF NOT EXISTS public.game_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mode TEXT,
  idea TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_feedback ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies

-- Profiles: Users can see and update their own profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Day Passes: Users can only see their own passes
CREATE POLICY "Users can view their own passes" ON public.day_passes
  FOR SELECT USING (auth.uid() = user_id);

-- Game Sessions: Users can see and insert their own sessions
CREATE POLICY "Users can view their own sessions" ON public.game_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Game Scores: Users can see scores linked to their sessions
CREATE POLICY "Users can view scores from their sessions" ON public.game_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.game_sessions
      WHERE public.game_sessions.id = public.game_scores.session_id
      AND public.game_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert scores for their sessions" ON public.game_scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_sessions
      WHERE public.game_sessions.id = public.game_scores.session_id
      AND public.game_sessions.user_id = auth.uid()
    )
  );

-- Game Content: Publicly readable
CREATE POLICY "Game content is publicly readable" ON public.game_content
  FOR SELECT USING (is_active = TRUE);

-- Razorpay Webhooks: No public access (Service Role Only)
-- (No policies = Access denied to everyone except service role)

-- Game Feedback: Users can submit and view their own ideas
CREATE POLICY "Users can insert their own feedback" ON public.game_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own feedback" ON public.game_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- 11. Functions & Triggers (Auto-profile creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
