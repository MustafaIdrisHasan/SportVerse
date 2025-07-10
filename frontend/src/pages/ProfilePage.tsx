import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@sportverse.com',
    phone: '+1 (555) 123-4567',
    location: 'Miami, FL, USA',
    joinDate: 'January 2023',
    bio: 'Passionate motorsports fan with a love for F1, MotoGP, and endurance racing. Following the sport for over 15 years.',
    favoriteTeam: 'Mercedes-AMG Petronas F1 Team',
    favoriteDriver: 'Lewis Hamilton'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-racing text-white mb-2">My Profile</h1>
            <p className="text-gray-400 font-sport">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-f1-500 to-motogp-500 flex items-center justify-center text-4xl font-bold text-white">
                    AR
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-accent-electric rounded-full hover:bg-accent-electric/80 transition-colors">
                    <FiEdit3 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h2 className="text-xl font-bold font-racing text-white mb-2">{profile.name}</h2>
                <p className="text-gray-400 font-sport mb-4">{profile.email}</p>
                <div className="flex items-center justify-center text-sm text-gray-500 font-sport">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Member since {profile.joinDate}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-bold font-racing text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-sport">Events Watched</span>
                    <span className="text-white font-sport font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-sport">Predictions Made</span>
                    <span className="text-white font-sport font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-sport">Accuracy Rate</span>
                    <span className="text-accent-electric font-sport font-medium">73%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-racing text-white">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-accent-electric hover:bg-accent-electric/80 rounded-lg transition-colors"
                    >
                      <FiEdit3 className="w-4 h-4 text-white" />
                      <span className="text-white font-sport">Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <FiSave className="w-4 h-4 text-white" />
                        <span className="text-white font-sport">Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FiX className="w-4 h-4 text-white" />
                        <span className="text-white font-sport">Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric resize-none"
                    />
                  ) : (
                    <p className="text-white">{profile.bio}</p>
                  )}
                </div>

                {/* Sports Preferences */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Favorite Team</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.favoriteTeam}
                        onChange={(e) => setEditedProfile({ ...editedProfile, favoriteTeam: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric"
                      />
                    ) : (
                      <p className="text-white">{profile.favoriteTeam}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Favorite Driver</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.favoriteDriver}
                        onChange={(e) => setEditedProfile({ ...editedProfile, favoriteDriver: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-electric"
                      />
                    ) : (
                      <p className="text-white">{profile.favoriteDriver}</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
