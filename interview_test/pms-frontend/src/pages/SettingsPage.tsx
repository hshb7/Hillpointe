import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Building,
  Bell,
  Globe,
  Shield,
  Users,
  Database,
  Palette,
  CreditCard,
  Key,
  Mail,
  Phone,
  Smartphone,
  Clock,
  DollarSign,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit,
  Save,
  Check,
  X,
  Camera,
  Link,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatDateTime } from '../utils/formatters';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent' | 'viewer';
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string | null;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [saving, setSaving] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ current: '', newPass: '', confirm: '' });

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phoneNumber: userProfile.phone,
      });
      showToast('Profile saved successfully!');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save profile', 'info');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordFields.current || !passwordFields.newPass) {
      showToast('Please fill in all password fields', 'info');
      return;
    }
    if (passwordFields.newPass !== passwordFields.confirm) {
      showToast('New passwords do not match', 'info');
      return;
    }
    if (passwordFields.newPass.length < 6) {
      showToast('New password must be at least 6 characters', 'info');
      return;
    }
    setSaving(true);
    try {
      await authApi.changePassword(passwordFields.current, passwordFields.newPass);
      showToast('Password changed successfully!');
      setPasswordFields({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to change password', 'info');
    } finally {
      setSaving(false);
    }
  };

  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    avatar: null as string | null,
    timezone: 'America/New_York',
    language: 'en'
  });

  useEffect(() => {
    if (user) {
      const raw = user as any;
      const firstName = raw.firstName || raw.fullName?.split(' ')[0] || '';
      const lastName = raw.lastName || raw.fullName?.split(' ').slice(1).join(' ') || '';
      const email = raw.email || raw.emailAddress || '';
      const phone = raw.phoneNumber || '';
      const role = raw.role || raw.userRole || 'user';
      setUserProfile(prev => ({
        ...prev,
        firstName,
        lastName,
        email,
        phone,
        title: role.charAt(0).toUpperCase() + role.slice(1),
      }));
    }
  }, [user]);

  const [companySettings, setCompanySettings] = useState({
    name: 'PropertyPro Management',
    address: '123 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(555) 987-6543',
    website: 'www.propertypro.com',
    logo: null,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'New Maintenance Requests',
      description: 'Receive notifications when tenants submit maintenance requests',
      email: true,
      sms: true,
      push: true
    },
    {
      id: '2',
      title: 'Rent Due Reminders',
      description: 'Get notified when rent payments are due or overdue',
      email: true,
      sms: false,
      push: true
    },
    {
      id: '3',
      title: 'Lease Expirations',
      description: 'Alerts for upcoming lease renewals and expirations',
      email: true,
      sms: true,
      push: false
    },
    {
      id: '4',
      title: 'Property Inspections',
      description: 'Reminders for scheduled property inspections',
      email: true,
      sms: false,
      push: true
    },
    {
      id: '5',
      title: 'Financial Reports',
      description: 'Monthly and quarterly financial report notifications',
      email: true,
      sms: false,
      push: false
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@propertypro.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-24T10:30:00Z'
    },
    {
      id: '2',
      name: 'Mike Thompson',
      email: 'mike.thompson@propertypro.com',
      role: 'agent',
      status: 'active',
      lastLogin: '2024-01-23T15:45:00Z'
    },
    {
      id: '3',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@propertypro.com',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-20T09:15:00Z'
    },
    {
      id: '4',
      name: 'David Miller',
      email: 'david.miller@propertypro.com',
      role: 'agent',
      status: 'pending',
      lastLogin: null
    }
  ]);

  const settingSections: SettingSection[] = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: <User size={20} />,
      description: 'Manage your personal profile and preferences'
    },
    {
      id: 'company',
      title: 'Company Settings',
      icon: <Building size={20} />,
      description: 'Configure your business information and branding'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={20} />,
      description: 'Control how and when you receive notifications'
    },
    {
      id: 'system',
      title: 'System Preferences',
      icon: <Globe size={20} />,
      description: 'Set timezone, language, and formatting options'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield size={20} />,
      description: 'Manage security settings and privacy controls'
    },
    {
      id: 'team',
      title: 'Team Management',
      icon: <Users size={20} />,
      description: 'Manage team members and their permissions'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Zap size={20} />,
      description: 'Connect third-party services and APIs'
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: <Database size={20} />,
      description: 'Backup, export, and data retention settings'
    },
    {
      id: 'billing',
      title: 'Billing & Subscription',
      icon: <CreditCard size={20} />,
      description: 'Manage your subscription and payment methods'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette size={20} />,
      description: 'Customize the look and feel of your dashboard'
    }
  ];

  const updateNotificationSetting = (id: string, type: 'email' | 'sms' | 'push', value: boolean) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, [type]: value }
          : setting
      )
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'success';
      case 'agent': return 'info';
      case 'viewer': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const renderSettingContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#2d5a41',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}>
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      `${userProfile.firstName[0]}${userProfile.lastName[0]}`
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" iconLeft={<Camera size={16} />} onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = () => showToast('Profile photo selected. Save profile to apply changes.', 'success');
                      input.click();
                    }}>
                      Upload Photo
                    </Button>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={userProfile.title}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, title: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <Button variant="primary" iconLeft={<Save size={16} />} onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    if (user) {
                      const raw = user as any;
                      setUserProfile(prev => ({
                        ...prev,
                        firstName: raw.firstName || raw.fullName?.split(' ')[0] || '',
                        lastName: raw.lastName || raw.fullName?.split(' ').slice(1).join(' ') || '',
                        email: raw.email || raw.emailAddress || '',
                        phone: raw.phoneNumber || '',
                        title: (raw.role || raw.userRole || 'user').charAt(0).toUpperCase() + (raw.role || raw.userRole || 'user').slice(1),
                      }));
                    }
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordFields.current}
                        onChange={(e) => setPasswordFields(prev => ({ ...prev, current: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          paddingRight: '40px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordFields.newPass}
                        onChange={(e) => setPasswordFields(prev => ({ ...prev, newPass: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={passwordFields.confirm}
                        onChange={(e) => setPasswordFields(prev => ({ ...prev, confirm: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <Button variant="primary" style={{ alignSelf: 'flex-start' }} onClick={handleChangePassword} disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                  Choose how you want to receive notifications for different events.
                </p>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 80px 80px',
                    gap: '16px',
                    alignItems: 'center',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>
                    <div>Notification Type</div>
                    <div style={{ textAlign: 'center' }}>
                      <Mail size={16} style={{ margin: '0 auto' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Phone size={16} style={{ margin: '0 auto' }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Smartphone size={16} style={{ margin: '0 auto' }} />
                    </div>
                  </div>

                  {notificationSettings.map((setting) => (
                    <div
                      key={setting.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 80px 80px 80px',
                        gap: '16px',
                        alignItems: 'center',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                          {setting.title}
                        </h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                          {setting.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={setting.email}
                            onChange={(e) => updateNotificationSetting(setting.id, 'email', e.target.checked)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: '#2d5a41'
                            }}
                          />
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={setting.sms}
                            onChange={(e) => updateNotificationSetting(setting.id, 'sms', e.target.checked)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: '#2d5a41'
                            }}
                          />
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={setting.push}
                            onChange={(e) => updateNotificationSetting(setting.id, 'push', e.target.checked)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: '#2d5a41'
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: '20px' }}>
                    <Button variant="primary" iconLeft={<Save size={16} />} onClick={() => showToast('Notification settings saved!')}>
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant={twoFactorEnabled ? 'success' : 'warning'}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                      {twoFactorEnabled
                        ? 'Two-factor authentication is currently enabled for your account.'
                        : 'Two-factor authentication is not enabled. Enable it for better security.'}
                    </p>
                  </div>
                  <Button
                    variant={twoFactorEnabled ? 'outline' : 'primary'}
                    iconLeft={<Shield size={16} />}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  >
                    {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                  Manage your active login sessions across devices
                </p>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        Current Session (Desktop)
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        Chrome on Windows • Last active: Now
                      </p>
                    </div>
                    <Badge variant="success">Current</Badge>
                  </div>
                  <div style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        Mobile App
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        iPhone • Last active: 2 hours ago
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => showToast('Session revoked')}>
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                      Manage API keys for third-party integrations
                    </p>
                  </div>
                  <Button variant="primary" size="sm" iconLeft={<Plus size={16} />} onClick={() => showToast('New API key generated: pk_live_' + Math.random().toString(36).slice(2, 14), 'success')}>
                    Generate Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        Production API Key
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                        pk_live_••••••••••••••••••••••••••••1234
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                        Created: Jan 15, 2024 • Last used: 2 days ago
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button size="sm" variant="outline" iconLeft={<Edit size={14} />} onClick={() => showToast('API key label updated', 'success')}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" iconLeft={<Trash2 size={14} />} onClick={() => showToast('API key revoked successfully', 'success')}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'team':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                      Manage your team members and their access levels
                    </p>
                  </div>
                  <Button variant="primary" size="sm" iconLeft={<Plus size={16} />} onClick={() => showToast('Invitation sent to team member', 'success')}>
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#2d5a41',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            member.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {member.name}
                          </h4>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                            {member.email}
                          </p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                            Last login: {formatLastLogin(member.lastLogin)}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Badge variant={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Badge variant={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <Button size="sm" variant="outline" iconLeft={<Edit size={14} />} onClick={() => showToast(`${member.name}'s role updated`, 'success')}>
                            Edit
                          </Button>
                          {member.status !== 'pending' && (
                            <Button size="sm" variant="outline" iconLeft={<X size={14} />} onClick={() => showToast(`${member.name} removed from team`, 'success')}>
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                  Define what each role can access in your organization
                </p>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { role: 'Admin', color: '#dc2626', permissions: ['Full Access', 'User Management', 'Billing'] },
                    { role: 'Manager', color: '#059669', permissions: ['Property Management', 'Reports', 'Team View'] },
                    { role: 'Agent', color: '#2563eb', permissions: ['Property View', 'Tenant Communication', 'Maintenance'] },
                    { role: 'Viewer', color: '#d97706', permissions: ['Read-only Access', 'Basic Reports'] }
                  ].map((roleInfo) => (
                    <div
                      key={roleInfo.role}
                      style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: roleInfo.color
                        }} />
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {roleInfo.role}
                        </h4>
                      </div>
                      <ul style={{
                        margin: 0,
                        padding: 0,
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {roleInfo.permissions.map((permission, index) => (
                          <li key={index} style={{ fontSize: '12px', color: '#6b7280' }}>
                            • {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card>
              <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                  Customize the appearance of your dashboard
                </p>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '12px'
                    }}>
                      Color Theme
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {[
                        { id: 'light' as const, name: 'Light', bg: '#ffffff', border: '#e5e7eb' },
                        { id: 'dark' as const, name: 'Dark', bg: '#1f2937', border: '#374151' },
                        { id: 'system' as const, name: 'System', bg: 'linear-gradient(45deg, #ffffff 50%, #1f2937 50%)', border: '#6b7280' }
                      ].map((opt) => {
                        const isSelected = theme === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => setTheme(opt.id)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              padding: '12px',
                              border: `2px solid ${isSelected ? '#2d5a41' : '#e5e7eb'}`,
                              borderRadius: '8px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '60px',
                              height: '40px',
                              background: opt.bg,
                              border: `1px solid ${opt.border}`,
                              borderRadius: '4px'
                            }} />
                            <span style={{ fontSize: '12px', fontWeight: '500' }}>
                              {opt.name}
                            </span>
                            <input
                              type="radio"
                              name="theme"
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => setTheme(opt.id)}
                              style={{ margin: 0 }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Sidebar Collapsed by Default
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#2d5a41'
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Reduced Motion
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#2d5a41'
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <Button variant="primary" iconLeft={<Save size={16} />} style={{ alignSelf: 'flex-start' }} onClick={() => showToast('Appearance settings saved! Theme: ' + theme)}>
                    Save Appearance Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="text-center p-8">
              <Settings size={64} style={{ margin: '0 auto 16px', opacity: 0.3, color: '#6b7280' }} />
              <h3 style={{ marginBottom: '8px', color: '#1f2937' }}>No Settings Available</h3>
              <p style={{ color: '#6b7280' }}>Select a settings category from the sidebar.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px'
        }}>
          Settings
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your account, preferences, and system configuration
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '280px' }}
        >
          <Card className="sticky top-20">
            <CardContent className="p-4">
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: activeSection === section.id ? '#f0fdf4' : 'transparent',
                      color: activeSection === section.id ? '#2d5a41' : '#6b7280',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: activeSection === section.id ? '500' : '400',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== section.id) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== section.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{
                      color: activeSection === section.id ? '#2d5a41' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {section.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '2px' }}>
                        {section.title}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: activeSection === section.id ? '#059669' : '#9ca3af',
                        lineHeight: '1.3'
                      }}>
                        {section.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ flex: 1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderSettingContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              padding: '14px 20px',
              backgroundColor: toast.type === 'success' ? '#2d5a41' : '#1f2937',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '400px'
            }}
          >
            {toast.type === 'success' ? <Check size={16} /> : <Settings size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
