import { useEffect, useState } from 'react';
import supabase  from '../utils/supbase';
import { FaUser } from 'react-icons/fa';

interface ProfilePictureProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  initial?: string;  // Add this prop

}



export default function ProfilePicture({ userId, size = 'md', className = '', initial }: ProfilePictureProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // First try to get from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .single();

        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [userId]);

  if (loading) {
    return (
      <div className={`rounded-full bg-gray-200 animate-pulse ${sizeClasses[size]} ${className}`} />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile"
          className={`rounded-full object-cover ${sizeClasses[size]}`}
        />
      ) : (
        <div
        className={`rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}
      >
        {initial || <FaUser />}
      </div>
      )}
    </div>
  );
}