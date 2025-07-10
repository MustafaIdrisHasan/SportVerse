import React, { useState } from 'react';
import { FiBell, FiMoon, FiSun, FiGlobe, FiShield, FiEye, FiVolume2, FiSmartphone } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
      raceAlerts: true,
      newsUpdates: true,
      socialActivity: false
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
      shareActivity: false
    },
    display: {
      compactMode: false,
      showAnimations: true,
      autoPlayVideos: false,
      highContrast: false
    },
    audio: {
      soundEffects: true,
      voiceAlerts: false,
      volume: 75
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => {
      const categorySettings = prev[category as keyof typeof prev];
      if (typeof categorySettings === 'object' && categorySettings !== null) {
        return {
          ...prev,
          [category]: {
            ...categorySettings,
            [key]: value
          }
        };
      }
      return prev;
    });
  };

  const updateTopLevelSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-accent-electric' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-racing text-white mb-2">Settings</h1>
            <p className="text-gray-400 font-sport">Customize your SportVerse experience</p>
          </div>

          <div className="space-y-6">
            {/* General Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-bold font-racing text-white mb-6 flex items-center">
                <FiGlobe className="w-5 h-5 mr-3 text-accent-electric" />
                General
              </h2>
              
              <div className="space-y-6">
                {/* Theme */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Theme</h3>
                    <p className="text-gray-400 text-sm">Choose your preferred color scheme</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateTopLevelSetting('theme', 'light')}
                      className={`p-2 rounded-lg border transition-colors ${
                        settings.theme === 'light'
                          ? 'bg-accent-electric border-accent-electric text-white'
                          : 'bg-dark-200 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <FiSun className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateTopLevelSetting('theme', 'dark')}
                      className={`p-2 rounded-lg border transition-colors ${
                        settings.theme === 'dark'
                          ? 'bg-accent-electric border-accent-electric text-white'
                          : 'bg-dark-200 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <FiMoon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Language</h3>
                    <p className="text-gray-400 text-sm">Select your preferred language</p>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => updateTopLevelSetting('language', e.target.value)}
                    className="bg-dark-200 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-electric"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h2 className="text-xl font-bold font-racing text-white mb-6 flex items-center">
                <FiBell className="w-5 h-5 mr-3 text-accent-electric" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive updates via email</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.email}
                    onChange={(value) => updateSetting('notifications', 'email', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Push Notifications</h3>
                    <p className="text-gray-400 text-sm">Get instant alerts on your device</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.push}
                    onChange={(value) => updateSetting('notifications', 'push', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Race Alerts</h3>
                    <p className="text-gray-400 text-sm">Get notified about race starts and results</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.raceAlerts}
                    onChange={(value) => updateSetting('notifications', 'raceAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">News Updates</h3>
                    <p className="text-gray-400 text-sm">Stay updated with latest sports news</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.newsUpdates}
                    onChange={(value) => updateSetting('notifications', 'newsUpdates', value)}
                  />
                </div>
              </div>
            </Card>

            {/* Privacy */}
            <Card className="p-6">
              <h2 className="text-xl font-bold font-racing text-white mb-6 flex items-center">
                <FiShield className="w-5 h-5 mr-3 text-accent-electric" />
                Privacy & Security
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Profile Visibility</h3>
                    <p className="text-gray-400 text-sm">Control who can see your profile</p>
                  </div>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                    className="bg-dark-200 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-electric"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Show Online Status</h3>
                    <p className="text-gray-400 text-sm">Let others see when you're online</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.privacy.showOnlineStatus}
                    onChange={(value) => updateSetting('privacy', 'showOnlineStatus', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Allow Direct Messages</h3>
                    <p className="text-gray-400 text-sm">Receive messages from other users</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.privacy.allowDirectMessages}
                    onChange={(value) => updateSetting('privacy', 'allowDirectMessages', value)}
                  />
                </div>
              </div>
            </Card>

            {/* Display */}
            <Card className="p-6">
              <h2 className="text-xl font-bold font-racing text-white mb-6 flex items-center">
                <FiEye className="w-5 h-5 mr-3 text-accent-electric" />
                Display & Accessibility
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Compact Mode</h3>
                    <p className="text-gray-400 text-sm">Show more content in less space</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.display.compactMode}
                    onChange={(value) => updateSetting('display', 'compactMode', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Animations</h3>
                    <p className="text-gray-400 text-sm">Enable smooth transitions and effects</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.display.showAnimations}
                    onChange={(value) => updateSetting('display', 'showAnimations', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Auto-play Videos</h3>
                    <p className="text-gray-400 text-sm">Automatically play video content</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.display.autoPlayVideos}
                    onChange={(value) => updateSetting('display', 'autoPlayVideos', value)}
                  />
                </div>
              </div>
            </Card>

            {/* Audio */}
            <Card className="p-6">
              <h2 className="text-xl font-bold font-racing text-white mb-6 flex items-center">
                <FiVolume2 className="w-5 h-5 mr-3 text-accent-electric" />
                Audio
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-sport font-medium">Sound Effects</h3>
                    <p className="text-gray-400 text-sm">Play sounds for interactions</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.audio.soundEffects}
                    onChange={(value) => updateSetting('audio', 'soundEffects', value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-white font-sport font-medium">Volume</h3>
                      <p className="text-gray-400 text-sm">Adjust audio volume level</p>
                    </div>
                    <span className="text-white font-sport">{settings.audio.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.audio.volume}
                    onChange={(e) => updateSetting('audio', 'volume', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
