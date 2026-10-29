import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  Plus,
  Menu,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { NavTab } from './Sidebar';
import type { Role } from '../../types';

interface TopNavProps {
  currentTab: NavTab;
  onSelectApplication: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onNavigateHome?: () => void;
  onOpenCreateApp?: () => void;
  onToggleMobileNav?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectApplication,
  onNavigateTab,
  onOpenCreateApp,
  onToggleMobileNav,
}) => {
  const { store, applications, notifications, activeUser, users } = useSakshamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? applications.filter(
        (a) =>
          a.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleRoleSwitch = (role: Role) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      store.setActiveUser(targetUser);
      setShowUserMenu(false);

      // Auto-navigate to the view most relevant to the switched demo persona
      if (role === 'INSTITUTION_USER') {
        onNavigateTab('institution-portal');
      } else if (role === 'EVC_MEMBER') {
        onNavigateTab('evc');
      } else {
        onNavigateTab('dashboard');
      }
    }
  };

  const pageTitles: Record<NavTab, string> = {
    dashboard: 'Dashboard',
    applications: 'Applications',
    workflow: 'Workflow Engine',
    evc: 'EVC Management',
    compliance: 'Compliance',
    documents: 'Document Validity',
    alerts: 'Alerts & Escalations',
    reports: 'Reports & Analytics',
    settings: 'Settings',
    'institution-portal': 'Institution Portal',
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E5E5] px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 font-sans">
      {/* Current Page Title / Breadcrumb / Mobile Hamburger */}
      <div className="flex items-center gap-2 min-w-0">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="p-1.5 -ml-1 text-[#555555] hover:text-[#111111] rounded hover:bg-[#F7F7F5] transition-colors md:hidden cursor-pointer shrink-0"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <h1 className="text-sm font-bold text-[#111111] tracking-tight truncate">
          {pageTitles[currentTab] || 'Saksham'}
        </h1>
        <span className="text-[#CCCCCC] text-xs">/</span>
        <span className="text-xs text-[#777777] hidden md:inline truncate">
          AICTE Approval &amp; Compliance
        </span>
      </div>

      {/* Center Search Field */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search applications, institutions..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-10 left-0 w-full bg-white border border-[#E5E5E5] rounded-md shadow-lg py-1 z-50 text-xs">
            <div className="px-3 py-1 text-[10px] font-semibold text-[#777777] uppercase tracking-wider border-b border-[#E5E5E5]">
              Matching Records ({searchResults.length})
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-[#E5E5E5]">
              {searchResults.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    onSelectApplication(app.id);
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 hover:bg-[#F7F7F5] cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-[#111111]">{app.applicationNumber}</div>
                    <div className="text-[11px] text-[#777777] truncate max-w-xs">
                      {app.institutionName}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#777777] font-mono">{app.region}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* "+ New Application" Button */}
        {onOpenCreateApp && (
          <button
            onClick={onOpenCreateApp}
            className="h-8 px-2.5 sm:px-3 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Create New Application"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Application</span>
          </button>
        )}

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded border border-[#E5E5E5] hover:bg-[#F7F7F5] flex items-center justify-center text-[#111111] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 stroke-[1.75]" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white border border-[#E5E5E5] rounded-md shadow-xl py-2 z-50 text-xs">
              <div className="px-3 pb-2 border-b border-[#E5E5E5] flex items-center justify-between">
                <span className="font-bold text-[#111111]">Notifications</span>
                <button
                  onClick={() => store.markAllNotificationsAsRead()}
                  className="text-[11px] text-[#777777] hover:text-[#111111] cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E5E5E5]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-[#777777]">No notifications</div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        store.markNotificationAsRead(n.id);
                        if (n.relatedApplicationId) {
                          onSelectApplication(n.relatedApplicationId);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3 hover:bg-[#F7F7F5] cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-[#FAFAFA]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {n.severity === 'CRITICAL' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#111111] truncate">{n.title}</p>
                          <p className="text-[11px] text-[#777777] line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[#E5E5E5] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateTab('alerts');
                  }}
                  className="text-[11px] font-semibold text-[#111111] hover:underline cursor-pointer"
                >
                  View All Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu (Real Active User & Demo Role Switching) */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 sm:gap-2 h-8 px-2 sm:px-2.5 rounded border border-[#E5E5E5] hover:bg-[#F7F7F5] transition-colors cursor-pointer text-xs"
            title={activeUser.name}
          >
            <div className="w-5 h-5 rounded bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {activeUser.name.charAt(0)}
            </div>
            <span className="font-semibold text-[#111111] hidden md:inline truncate max-w-28">
              {activeUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#777777] shrink-0" />
          </button>

          {/* Profile / Demo Role Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-10 w-72 bg-white border border-[#E5E5E5] rounded-md shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#E5E5E5]">
                <div className="font-bold text-[#111111] truncate">{activeUser.name}</div>
                <div className="text-[11px] text-[#777777] truncate">{activeUser.designation}</div>
                <div className="text-[10px] text-[#555555] font-mono mt-0.5 truncate">
                  Role: {activeUser.role} • {activeUser.region}
                </div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#777777]">
                  Switch Demo Role Persona
                </div>
                {[
                  { label: 'Super Administrator', role: 'SUPER_ADMIN' as Role, desc: 'Full National Oversight' },
                  { label: 'Bureau / Scrutiny Officer', role: 'BUREAU_OFFICER' as Role, desc: 'Central Bureau Approval Desk' },
                  { label: 'Regional Officer', role: 'REGIONAL_OFFICER' as Role, desc: 'NWRO Chandigarh Jurisdiction' },
                  { label: 'EVC Committee Member', role: 'EVC_MEMBER' as Role, desc: 'On-site Inspection Visits' },
                  { label: 'Competent Authority', role: 'COMPETENT_AUTHORITY' as Role, desc: 'Final SAC / Approval Decision' },
                  { label: 'Institution User', role: 'INSTITUTION_USER' as Role, desc: 'Delhi Institute of Tech & Mgmt' },
                ].map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSwitch(r.role)}
                    className={`w-full text-left px-3 py-2 hover:bg-[#F7F7F5] flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      activeUser.role === r.role ? 'bg-[#F5F5F3] font-bold text-[#111111]' : 'text-[#555555]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#111111]">{r.label}</div>
                      <div className="text-[10px] text-[#888888] font-normal">{r.desc}</div>
                    </div>
                    {activeUser.role === r.role && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-[#E5E5E5]">
                <button
                  onClick={() => {
                    if (confirm('Reset demo dataset to baseline?')) {
                      store.resetToDefaults();
                      window.location.reload();
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#DC2626] hover:bg-[#FEE2E2]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo Baseline</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
