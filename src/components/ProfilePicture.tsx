import React from 'react';

interface ProfilePictureProps {
  avatarUrl: string | null;
  size?: number;  // Optional size for the avatar
  fallbackText?: string;  // Text to display as a fallback if no avatar is available
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ avatarUrl, size = 50, fallbackText = "?" }) => {
  // Style for the image
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover' as const,  // Ensures image is contained within the circle
  };

  // Style for the container (circle)
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: size / 2,  // Adjusts text size based on container size
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Profile" style={imageStyle} />
      ) : (
        <span>{fallbackText}</span>
      )}
    </div>
  );
};

export default ProfilePicture;
