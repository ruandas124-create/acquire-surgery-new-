import React, { useState, useEffect } from 'react';
import { AuthUser, Hospital } from '../types';
import { authService } from '../services/auth';
import { api } from '../services/api';
import { PortalLogin } from './portal/PortalLogin';
import { AdminDashboard } from './portal/AdminDashboard';
import { HospitalDashboard } from './portal/HospitalDashboard';

interface AdminPortalProps {
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  // Load hospitals & auth state on mount
  useEffect(() => {
    const initPortal = async () => {
      setLoading(true);
      try {
        const hospList = await api.getHospitals();
        setHospitals(hospList);

        const savedUser = authService.getCurrentUser();
        if (savedUser) {
          // If hospital user, ensure hospital still exists or default to first
          if (savedUser.role === 'hospital' && savedUser.hospitalId) {
            const exists = hospList.some(h => h.id === savedUser.hospitalId);
            if (!exists && hospList.length > 0) {
              savedUser.hospitalId = hospList[0].id;
              savedUser.hospitalName = hospList[0].name;
            }
          }
          setCurrentUser(savedUser);
        }
      } catch (err) {
        console.error('Failed initializing portal', err);
      } finally {
        setLoading(false);
      }
    };

    initPortal();
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    authService.setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Allow admin to switch to hospital view
  const handleSwitchToHospital = (hospitalId: string) => {
    const targetHosp = hospitals.find(h => h.id === hospitalId) || hospitals[0];
    if (targetHosp) {
      const hospUser = authService.loginAsHospital(targetHosp);
      setCurrentUser(hospUser);
    }
  };

  // Allow hospital user to switch to another hospital for testing/preview
  const handleSwitchHospital = (hospitalId: string) => {
    const targetHosp = hospitals.find(h => h.id === hospitalId) || hospitals[0];
    if (targetHosp) {
      const updatedUser: AuthUser = {
        ...currentUser!,
        hospitalId: targetHosp.id,
        hospitalName: targetHosp.name,
      };
      setCurrentUser(updatedUser);
      authService.setCurrentUser(updatedUser);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
        <div className="w-10 h-10 border-4 border-[#062B61] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-600">Loading Secure Portal Gateway...</span>
      </div>
    );
  }

  // Not logged in: show Login Screen
  if (!currentUser) {
    return (
      <PortalLogin
        hospitals={hospitals}
        onLoginSuccess={handleLoginSuccess}
        onCancel={onClose}
      />
    );
  }

  // Logged in as Administrator
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
        onClose={onClose}
        onSwitchToHospital={handleSwitchToHospital}
      />
    );
  }

  // Logged in as Hospital Partner
  return (
    <HospitalDashboard
      user={currentUser}
      hospitals={hospitals}
      onLogout={handleLogout}
      onClose={onClose}
      onSwitchHospital={handleSwitchHospital}
    />
  );
};
