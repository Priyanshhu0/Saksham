import React, { useState } from 'react';
import { Check, X, Shield, UserPlus, KeyRound, CheckCircle2 } from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { Modal } from '../common/Modal';
import type { Role, User } from '../../types';

export const UserManagementView: React.FC = () => {
  const { store, users, activeUser } = useSakshamStore();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('REGIONAL_OFFICER');
  const [newUserDesignation, setNewUserDesignation] = useState('');
  const [newUserRegion, setNewUserRegion] = useState('Central');

  const permissionsMatrix = [
    {
      module: 'Submit New Approval Application',
      institution: true,
      ro: false,
      bo: false,
      evc: false,
      ca: false,
      admin: true,
    },
    {
      module: 'Preliminary Document Scrutiny',
      institution: false,
      ro: true,
      bo: true,
      evc: false,
      ca: false,
      admin: true,
    },
    {
      module: 'Return Application for Deficiencies',
      institution: false,
      ro: true,
      bo: true,
      evc: false,
      ca: false,
      admin: true,
    },
    {
      module: 'Resubmit Deficiency Rectification',
      institution: true,
      ro: false,
      bo: false,
      evc: false,
      ca: false,
      admin: false,
    },
    {
      module: 'Schedule & Assign EVC Committee',
      institution: false,
      ro: true,
      bo: true,
      evc: false,
      ca: false,
      admin: true,
    },
    {
      module: 'Submit On-Site EVC Report',
      institution: false,
      ro: false,
      bo: false,
      evc: true,
      ca: false,
      admin: true,
    },
    {
      module: 'Verify Compliance Undertakings',
      institution: false,
      ro: true,
      bo: true,
      evc: false,
      ca: false,
      admin: true,
    },
    {
      module: 'Grant Statutory Recommendation (SAC/EC)',
      institution: false,
      ro: false,
      bo: false,
      evc: false,
      ca: true,
      admin: true,
    },
    {
      module: 'Grant Final Statutory EoA Approval',
      institution: false,
      ro: false,
      bo: true,
      evc: false,
      ca: true,
      admin: true,
    },
    {
      module: 'Configure SLA Rules & Settings',
      institution: false,
      ro: false,
      bo: false,
      evc: false,
      ca: false,
      admin: true,
    },
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      region: newUserRegion,
      designation: newUserDesignation.trim() || 'Regulatory Authority Officer',
      phone: '+91 11 2958 1000',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    const currentUsers = store.getUsers();
    localStorage.setItem('saksham_users', JSON.stringify([...currentUsers, newUser]));
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl font-bold text-[#111111] tracking-tight">
            Users & Role Permissions
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Role-based authorization hierarchy, institutional boundaries, and administrative operational privileges
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="h-9 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium inline-flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Officer Persona</span>
        </button>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white rounded border border-[#E5E5E5] overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] bg-white flex items-center justify-between">
          <div className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#111111]" />
            Configured Personas ({users.length})
          </div>
          <span className="text-[11px] text-[#777777]">
            Active Persona: <strong className="text-[#111111]">{activeUser.name}</strong>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold uppercase tracking-wider text-[10px] select-none">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {users.map((u) => {
                const isActive = activeUser.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-[#F7F7F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#E5E5E5]"
                        />
                        <div>
                          <div className="font-semibold text-[#111111]">{u.name}</div>
                          <div className="text-[11px] text-[#777777] font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-[#111111] bg-[#EEEEEC] border border-[#E5E5E5] px-2.5 py-0.5 rounded">
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#111111] font-medium">{u.designation}</td>
                    <td className="py-3 px-4 text-[#777777]">
                      {u.institutionName ? u.institutionName : `${u.region} Region`}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#777777] whitespace-nowrap">
                      {u.phone}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#111111] bg-[#EEEEEC] border border-[#E5E5E5] px-2.5 py-1 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Current Persona
                        </span>
                      ) : (
                        <button
                          onClick={() => store.setActiveUser(u)}
                          className="px-3 py-1 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] text-xs font-medium transition-colors border border-[#E5E5E5]"
                        >
                          Switch
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Permissions Matrix */}
      <div className="bg-white rounded border border-[#E5E5E5] overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] bg-white text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#111111]" />
          Statutory Role Permission & Privilege Matrix
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold uppercase tracking-wider text-[10px] select-none">
                <th className="py-3 px-4">Functional Module & Privilege</th>
                <th className="py-3 px-3 text-center">Institution</th>
                <th className="py-3 px-3 text-center">Regional Officer</th>
                <th className="py-3 px-3 text-center">Bureau Officer</th>
                <th className="py-3 px-3 text-center">EVC Expert</th>
                <th className="py-3 px-3 text-center">Competent Auth</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {permissionsMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#F7F7F5] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#111111]">{p.module}</td>
                  <td className="py-3 px-3 text-center">
                    {p.institution ? (
                      <Check className="w-4 h-4 text-[#111111] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#E5E5E5] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.ro ? (
                      <Check className="w-4 h-4 text-[#111111] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#E5E5E5] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.bo ? (
                      <Check className="w-4 h-4 text-[#111111] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#E5E5E5] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.evc ? (
                      <Check className="w-4 h-4 text-[#111111] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#E5E5E5] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.ca ? (
                      <Check className="w-4 h-4 text-[#111111] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#E5E5E5] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.admin ? (
                      <Check className="w-4 h-4 text-[#111111] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#E5E5E5] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <Modal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          title="Add Regulatory Officer Persona"
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. Dr. K. Radhakrishnan"
                className="w-full h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Official Email</label>
              <input
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="e.g. radhakrishnan@aicte-india.org"
                className="w-full h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  <option value="REGIONAL_OFFICER">Regional Officer</option>
                  <option value="BUREAU_OFFICER">Bureau Officer</option>
                  <option value="EVC_MEMBER">EVC Member</option>
                  <option value="COMPETENT_AUTHORITY">Competent Authority</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Region</label>
                <select
                  value={newUserRegion}
                  onChange={(e) => setNewUserRegion(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  <option value="Central">Central</option>
                  <option value="Western">Western</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Northern">Northern</option>
                  <option value="Southern">Southern</option>
                  <option value="South-West">South-West</option>
                  <option value="North-West">North-West</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">Designation</label>
              <input
                type="text"
                value={newUserDesignation}
                onChange={(e) => setNewUserDesignation(e.target.value)}
                placeholder="e.g. Joint Director (Approvals)"
                className="w-full h-9 px-3 bg-white border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 rounded bg-white text-[#111111] border border-[#E5E5E5] font-medium hover:bg-[#EEEEEC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium transition-colors"
              >
                Create Persona
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
