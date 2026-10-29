import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  Calendar,
  ShieldCheck,
  FolderArchive,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';

export type NavTab =
  | 'dashboard'
  | 'applications'
  | 'workflow'
  | 'evc'
  | 'compliance'
  | 'documents'
  | 'alerts'
  | 'reports'
  | 'settings'
  | 'institution-portal';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigateHome?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapsed,
  onNavigateHome,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { applications, notifications, activeUser } = useSakshamStore();

  const overdueCount = applications.filter((a) => a.isOverdue).length;
  const alertCount = notifications.filter(
    (n) => !n.isRead && (n.severity === 'CRITICAL' || n.severity === 'WARNING')
  ).length;

  const isInstUser = activeUser.role === 'INSTITUTION_USER';

  // Standard classic navigation items matching the original layout
  const navItems = [
    {
      id: isInstUser ? ('institution-portal' as NavTab) : ('dashboard' as NavTab),
      label: isInstUser ? 'Institution Portal' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'applications' as NavTab,
      label: 'Applications',
      icon: FileText,
      badge: overdueCount > 0 ? `${overdueCount}` : undefined,
    },
    { id: 'workflow' as NavTab, label: 'Workflow', icon: GitBranch },
    { id: 'evc' as NavTab, label: 'EVC', icon: Calendar },
    { id: 'compliance' as NavTab, label: 'Compliance', icon: ShieldCheck },
    { id: 'documents' as NavTab, label: 'Documents', icon: FolderArchive },
    {
      id: 'alerts' as NavTab,
      label: 'Alerts',
      icon: Bell,
      badge: alertCount > 0 ? `${alertCount}` : undefined,
    },
    { id: 'reports' as NavTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const isCollapsedView = collapsed && !isMobileOpen;

  return (
    <aside
      className={`flex flex-col bg-[#111111] text-[#888888] border-r border-[#222222] transition-all duration-200 select-none font-sans shrink-0 ${
        isCollapsedView ? 'md:w-16' : 'md:w-56'
      } ${
        isMobileOpen
          ? 'fixed inset-y-0 left-0 w-56 shadow-2xl z-50 flex'
          : 'hidden md:flex'
      }`}
    >
      {/* Top Header: Original Classic Saksham Logo */}
      <div
        className={`h-16 flex items-center border-b border-[#222222] shrink-0 ${
          isCollapsedView ? 'justify-center px-0' : 'justify-between px-4'
        }`}
      >
        {isCollapsedView ? (
          /* Centered Logo in Collapsed Mode (Eliminates '| >' squishing) */
          <div className="flex flex-col items-center justify-center gap-1">
            <button
              onClick={onToggleCollapsed}
              title="Expand Sidebar"
              className="w-7 h-7 rounded bg-white text-[#111111] flex items-center justify-center font-bold text-xs tracking-tighter shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              S
            </button>
            <button
              onClick={onToggleCollapsed}
              title="Expand Sidebar"
              className="text-[#666666] hover:text-white p-0.5 rounded transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Expanded Logo (Matches original design exactly) */
          <>
            <div
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
              onClick={onNavigateHome}
              title="Return to Public Overview"
            >
              <div className="w-7 h-7 rounded bg-white text-[#111111] flex items-center justify-center font-bold text-xs tracking-tighter shrink-0 select-none">
                S
              </div>
              <div className="leading-tight overflow-hidden">
                <span className="font-bold text-sm text-white tracking-wide block">
                  Saksham
                </span>
                <span className="text-[10px] text-[#666666] uppercase tracking-wider block font-medium">
                  Approval &amp; Compliance
                </span>
              </div>
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapsed}
              className="text-[#666666] hover:text-white p-1 rounded transition-colors hidden md:block cursor-pointer shrink-0"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="text-[#666666] hover:text-white p-1 rounded transition-colors md:hidden cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Main Navigation Items (Exact original 9 items) */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (isInstUser && item.id === 'institution-portal' && currentTab === 'institution-portal');

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              title={isCollapsedView ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#222222] text-white font-semibold'
                  : 'text-[#888888] hover:text-[#EEEEEE] hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
              {!isCollapsedView && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsedView && item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#333333] text-[#CCCCCC]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Account / User Section at Bottom (Original compact styling) */}
      <div className="p-3 border-t border-[#222222] bg-[#111111] shrink-0">
        <div className={`flex items-center ${isCollapsedView ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-8 h-8 rounded bg-[#222222] border border-[#333333] flex items-center justify-center text-white shrink-0">
            <User className="w-4 h-4 text-[#AAAAAA]" />
          </div>
          {!isCollapsedView && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate" title={activeUser.name}>
                {activeUser.name}
              </div>
              <div className="text-[10px] text-[#666666] truncate font-mono uppercase">
                {activeUser.role.replace(/_/g, ' ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
