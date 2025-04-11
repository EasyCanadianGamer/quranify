// src/routes/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '../utils/supbase';

const supabase = createClient();

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // First, get the session from the URL
        const { data: { session }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError || !session) {
          throw sessionError || new Error('No session found');
        }

        // Then get the user
        const { data: { user }, error: userError } = 
          await supabase.auth.getUser();

        if (userError || !user) {
          throw userError || new Error('No user found');
        }

        // Check if profile exists, create if not
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile && !profileError) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            username: user.user_metadata.full_name || user.email?.split('@')[0],
            pfp: user.user_metadata.avatar_url
          });
        }

        navigate('/'); // Redirect to home after successful login
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        navigate('/login', { state: { error: 'Google login failed' } });
      }
    };

    handleAuth();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">
          <p>Error during authentication: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p>Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;