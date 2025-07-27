import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Mail, Calendar, Edit, Save, X, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  console.log('user:', user);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  console.log('profileData:', profileData);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.username.trim()) {
      newErrors.username = 'username is required';
    }

    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    try {
      setLoading(true);
      await updateProfile(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setIsChangingPassword(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setErrors({});
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>
        <div className="card-content">
          {isEditing ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className={`input ${errors.username ? 'border-danger-500' : ''}`}
                  disabled={loading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`input ${errors.email ? 'border-danger-500' : ''}`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary"
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn-secondary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Change Password
              </button>
            )}
          </div>
        </div>
        <div className="card-content">
          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={`input pr-10 ${errors.oldPassword ? 'border-danger-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('old')}
                  >
                    {showPasswords.old ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="mt-1 text-sm text-danger-600">{errors.oldPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`input pr-10 ${errors.newPassword ? 'border-danger-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-danger-600">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`input pr-10 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelPasswordChange}
                  className="btn-secondary"
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Changing...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">
              Keep your account secure by using a strong password and changing it regularly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;