// src/components/Settings.tsx
import { createClient } from '../utils/supbase';
import { useState, useEffect } from 'react';
import { FiUser, FiBookmark, FiLock, FiTrash2, FiUpload } from 'react-icons/fi';
import * as nsfwjs from 'nsfwjs';


import { getUserDetails, getUserProfile } from '../utils/api';


const supabase = createClient();

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks'>('profile');
  const [user, setUser] = useState<any>(null);

  const [setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar_url: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  
useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserDetails();
  
      if (user) {
        setUser(user);
        const profile = await getUserProfile(user.id);


  
        if (profile) {
          setProfile(profile);
          setFormData({
            username: profile.username || '',
            email: user.email || '',
            avatar_url: profile.avatar_url || ''
          });
        } 
      }
    };
  
    fetchUser();
  }, []);
  

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    setMessage('');
  
    try {
      const file = e.target.files[0];
      
      // 1. Basic validation
      if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
        throw new Error('Only JPEG, PNG, or GIF images are allowed');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image must be less than 5MB');
      }
  
      // 2. NSFW Content Check
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
  
      // Load NSFW model (consider loading this once at app start)
      const model = await nsfwjs.load();
      const predictions = await model.classify(img);
      const nsfwResults = predictions.find(p => 
        ['Porn', 'Hentai', 'Sexy'].includes(p.className) && p.probability > 0.7
      );
  
      if (nsfwResults) {
        throw new Error('Image contains inappropriate content');
      }
  
      // 3. Prepare upload
      const fileExt = file.name.split('.').pop();
      const fileName = `pfp${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; // No folder prefix needed with your policies
  
      // 4. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false // Don't overwrite existing files
        });
  
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message.includes('409') 
          ? 'This image already exists' 
          : 'Failed to upload image');
      }
  
      // 5. Get public URL (matches your "Avatar public access" policy)
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      console.log('Public URL:', publicUrl);

      // 6. Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
  
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      setMessage('Profile picture updated successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;
      setMessage('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Password update failed');
    } finally {
      setLoading(false);
    }
  };


  const handleAccountDeletion = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all data.')) return;

    setLoading(true);
    
    try {
      // First delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) throw authError;

      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Deletion failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
        <nav className="p-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiUser className="mr-3" />
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'bookmarks' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiBookmark className="mr-3" />
            Bookmark Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <FiUser className="mr-2" /> Profile Information
              </h3>
              
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex items-center">
                      {formData.avatar_url ? (
                        <img 
                          src={formData.avatar_url} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          <FiUser size={24} className="text-gray-400" />
                        </div>
                      )}
                      <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100">
                        <FiUpload className="inline mr-2" />
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <FiLock className="mr-2" /> Change Password
              </h3>
              
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
              <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-gray-600">Permanently remove your account and all data</p>
                </div>
                <button
                  onClick={handleAccountDeletion}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FiBookmark className="mr-2" /> Bookmark Settings
            </h3>
            <p className="text-gray-600">Coming soon! Manage your Quran bookmarks here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;