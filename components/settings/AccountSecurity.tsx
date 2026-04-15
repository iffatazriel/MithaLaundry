'use client';

import { useState } from 'react';
import { Save, Eye, EyeOff, KeyRound } from 'lucide-react';

interface ProfileForm {
  fullName: string;
  email: string;
  role: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialProfile: ProfileForm = {
  fullName: 'Ahmad Faisal',
  email: 'ahmad.faisal@mithalaundry.com',
  role: 'Store Manager',
};

export default function AccountSecurity() {
  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [profileSaved, setProfileSaved] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileSaved(false);
  };

  const handleSaveProfile = () => {
    // TODO: API call
    console.log('Saving profile:', profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError('');
  };

  const handleSavePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    // TODO: API call
    console.log('Saving password');
    setPasswordSaved(true);
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const toggleShow = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <section id="profile" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800">Account Security</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Update your login credentials and personal information.
      </p>

      {/* Profile Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleProfileChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={profile.role}
            readOnly
            className="px-3 py-2 text-sm border border-gray-100 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => { setShowPasswordForm(!showPasswordForm); setPasswordError(''); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          <KeyRound size={14} />
          {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
        </button>
        <button
          onClick={handleSaveProfile}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            profileSaved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          <Save size={15} />
          {profileSaved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>

      {/* Password Form */}
      {showPasswordForm && (
        <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Change Password</p>
          <div className="grid grid-cols-1 gap-3 mb-3">
            {(
              [
                { name: 'currentPassword', label: 'Current Password', key: 'current' as const },
                { name: 'newPassword', label: 'New Password', key: 'new' as const },
                { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' as const },
              ] as const
            ).map(({ name, label, key }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? 'text' : 'password'}
                    name={name}
                    value={passwordForm[name]}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {passwordError && (
            <p className="text-xs text-red-500 mb-3">{passwordError}</p>
          )}

          {passwordSaved && (
            <p className="text-xs text-green-600 mb-3 font-medium">Password updated successfully!</p>
          )}

          <button
            onClick={handleSavePassword}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Update Password
          </button>
        </div>
      )}
    </section>
  );
}