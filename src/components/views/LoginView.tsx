import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { Role } from '../../types';

interface LoginViewProps {
  onSuccessLogin: (role: Role) => void;
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccessLogin,
  onNavigateHome,
}) => {
  const { store, users } = useSakshamStore();
  const [email, setEmail] = useState('bureau.officer@aicte.gov.in');
  const [password, setPassword] = useState('Saksham@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const demoRoles = [
    {
      role: 'SUPER_ADMIN' as Role,
      title: 'Super Administrator',
      desc: 'System oversight, global audit trail, and SLA configuration',
      email: 'super.admin@aicte.gov.in',
    },
    {
      role: 'BUREAU_OFFICER' as Role,
      title: 'Bureau / Scrutiny Officer',
      desc: 'Case review, deficiency notes, and stage advancement',
      email: 'bureau.officer@aicte.gov.in',
    },
    {
      role: 'REGIONAL_OFFICER' as Role,
      title: 'Regional Officer',
      desc: 'Regional workload, committee assignments, and logistics',
      email: 'ro.central@aicte.gov.in',
    },
    {
      role: 'EVC_MEMBER' as Role,
      title: 'EVC Committee Member',
      desc: 'On-site inspections, checklist items, and visit reports',
      email: 'evc.coordinator@aicte.gov.in',
    },
    {
      role: 'COMPETENT_AUTHORITY' as Role,
      title: 'Competent Authority',
      desc: 'Executive Council & Standing Appellate final decisions',
      email: 'chairman.sac@aicte.gov.in',
    },
    {
      role: 'INSTITUTION_USER' as Role,
      title: 'Institution User',
      desc: 'Application submission, deficiency response, and renewals',
      email: 'registrar@shree-engg.edu.in',
    },
  ];

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      store.setActiveUser(matchedUser);
      onSuccessLogin(matchedUser.role);
    } else {
      onSuccessLogin('BUREAU_OFFICER');
    }
  };

  const handleDemoSelect = (role: Role) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    store.setActiveUser(targetUser);
    onSuccessLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-8 font-sans text-[#111111]">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto pb-6">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={onNavigateHome}
        >
          <div className="w-7 h-7 rounded bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#111111] block leading-none">
              Saksham
            </span>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-medium mt-0.5">
              Approval &amp; Compliance Management System
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs text-[#777777] hover:text-[#111111] font-medium"
        >
          &larr; Back to Public Overview
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start my-auto">
        {/* Left Column: Official Sign In Form */}
        <div className="md:col-span-6 bg-white p-6 sm:p-7 rounded-lg border border-[#E5E5E5] space-y-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#111111] tracking-tight">Sign In</h2>
            <p className="text-xs text-[#777777] mt-1">
              Enter your credentials to access the Saksham regulatory console.
            </p>
          </div>

          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#111111] font-semibold mb-1">
                Official Email or Username
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@aicte-india.org"
                className="w-full h-8 px-3 bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#111111] font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Demo password reset link simulated to registered mobile/email.')}
                  className="text-[11px] text-[#777777] hover:text-[#111111]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-8 pl-3 pr-8 bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-[#777777] hover:text-[#111111]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#777777]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#111111] rounded"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-9 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column: Demo Role Switcher for Hackathon Judges */}
        <div className="md:col-span-6 bg-white p-6 sm:p-7 rounded-lg border border-[#E5E5E5] space-y-4 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <h3 className="text-sm font-bold text-[#111111]">Demo Mode Role Switcher</h3>
            </div>
            <p className="text-xs text-[#777777] mt-1">
              Select any persona to immediately explore role-based permissions and workflows.
            </p>
          </div>

          <div className="space-y-2">
            {demoRoles.map((dr) => (
              <button
                key={dr.role}
                onClick={() => handleDemoSelect(dr.role)}
                className="w-full p-2.5 rounded border border-[#E5E5E5] bg-[#F7F7F5] hover:bg-[#EEEEEC] hover:border-[#111111] transition-all text-left flex items-start justify-between gap-2 group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#111111] group-hover:text-[#111111]">
                    {dr.title}
                  </div>
                  <div className="text-[11px] text-[#777777] leading-tight mt-0.5">
                    {dr.desc}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111] shrink-0 mt-0.5" />
              </button>
            ))}
          </div>

          <div className="text-[10px] text-[#888888] pt-2 border-t border-[#E5E5E5]">
            Note: This role switcher is provided for demonstration evaluation only.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center pt-6 text-[11px] text-[#777777]">
        Saksham &bull; Smart India Hackathon Prototype &bull; Pure Monochrome Interface
      </div>
    </div>
  );
};
