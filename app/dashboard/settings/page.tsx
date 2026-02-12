'use client';

import { useState } from 'react';
import { User, Lock, Bell, Moon, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
            icon={<User size={18} />} 
            label="Profile" 
          />
          <TabButton 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
            icon={<Lock size={18} />} 
            label="Security" 
          />
          <TabButton 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
            icon={<Bell size={18} />} 
            label="Notifications" 
          />
          <TabButton 
            active={activeTab === 'appearance'} 
            onClick={() => setActiveTab('appearance')}
            icon={<Moon size={18} />} 
            label="Appearance" 
          />
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold border-b pb-2 dark:border-gray-700">Public Profile</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input type="text" className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="PlayerOne" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input type="email" className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="player@example.com" />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold border-b pb-2 dark:border-gray-700">Security</h3>
      <div className="space-y-4">
        <button className="text-indigo-600 font-medium hover:underline flex items-center gap-2">
          <Shield size={16} /> Change Password
        </button>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
          Two-factor authentication is currently disabled.
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon} {label}
    </button>
  );
}