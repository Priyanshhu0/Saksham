import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  RefreshCw,
  Eye,
  RotateCcw,
  Upload,
  Plus,
} from 'lucide-react';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import { RenewDocumentModal } from '../modals/RenewDocumentModal';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';
import { UploadDocumentModal } from '../modals/UploadDocumentModal';
import type { ApplicationDocument } from '../../types';

export const DocumentRegistryView: React.FC = () => {
  const { documents, activeUser } = useSakshamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [validityFilter, setValidityFilter] = useState('ALL');
  const [selectedForRenew, setSelectedForRenew] = useState<ApplicationDocument | null>(null);
  const [selectedForPreview, setSelectedForPreview] = useState<ApplicationDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Compute validity states from actual sample dates
  const today = new Date();

  const getValidityState = (doc: ApplicationDocument) => {
    if (!doc.expiryDate) return 'VALID';
    const exp = new Date(doc.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'EXPIRED';
    if (diffDays <= 30) return 'EXPIRING_SOON';
    return 'VALID';
  };

  const filteredDocuments = documents.filter((doc) => {
    if (activeUser.role === 'INSTITUTION_USER' && activeUser.institutionId) {
      if (doc.institutionId !== activeUser.institutionId) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !doc.title.toLowerCase().includes(q) &&
        !doc.documentType.toLowerCase().includes(q) &&
        !doc.fileName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    const state = getValidityState(doc);
    if (validityFilter !== 'ALL') {
      if (validityFilter === 'VALID' && state !== 'VALID') return false;
      if (validityFilter === 'EXPIRING_SOON' && state !== 'EXPIRING_SOON') return false;
      if (validityFilter === 'EXPIRED' && state !== 'EXPIRED') return false;
      if (validityFilter === 'RENEWAL_SUBMITTED' && doc.renewalStatus !== 'RENEWAL_SUBMITTED') return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-[#111111]">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
            Document Validity Registry
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Monitor prescribed statutory certificates, land lease validity, fire NOCs, and renewal filings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="h-8 px-3.5 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#E5E5E5] flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-56">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, document type, file name..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F7F7F5] border border-[#E5E5E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>

        <select
          value={validityFilter}
          onChange={(e) => setValidityFilter(e.target.value)}
          className="h-8 px-2.5 bg-white border border-[#E5E5E5] rounded text-xs text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
        >
          <option value="ALL">All Validity States</option>
          <option value="VALID">Valid</option>
          <option value="EXPIRING_SOON">Expiring Soon (Within 30 Days)</option>
          <option value="EXPIRED">Expired</option>
          <option value="RENEWAL_SUBMITTED">Renewal Submitted</option>
        </select>

        {(searchQuery || validityFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setValidityFilter('ALL');
            }}
            className="h-8 px-2.5 text-xs text-[#777777] hover:text-[#111111] inline-flex items-center gap-1 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Document Register Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F7F7F5] text-[#777777] font-semibold text-[10px] uppercase tracking-wider select-none">
                <th className="py-2.5 px-4">Document Type</th>
                <th className="py-2.5 px-4">File Name</th>
                <th className="py-2.5 px-4">Expiry Date</th>
                <th className="py-2.5 px-4">Validity Status</th>
                <th className="py-2.5 px-4">Renewal Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#777777]">
                    No documents match the current filter.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
                  const validity = getValidityState(doc);
                  const isExpired = validity === 'EXPIRED';
                  const isExpiringSoon = validity === 'EXPIRING_SOON';

                  return (
                    <tr key={doc.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#111111]">{doc.title}</div>
                        <div className="text-[10px] text-[#777777]">{doc.documentType}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#777777]">
                        {doc.fileName} <span className="text-[10px]">({doc.fileSize})</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                        <span className={isExpired ? 'text-[#DC2626] font-bold' : isExpiringSoon ? 'text-[#111111] font-semibold' : 'text-[#777777]'}>
                          {doc.expiryDate || 'N/A (Perpetual)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            isExpired
                              ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                              : isExpiringSoon
                              ? 'bg-[#EEEEEC] text-[#111111] border-[#E5E5E5] font-semibold'
                              : 'bg-[#F7F7F5] text-[#555555] border-[#E5E5E5]'
                          }`}
                        >
                          {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5]">
                          {doc.renewalStatus || 'NOT_REQUIRED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedForPreview(doc)}
                            className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] hover:bg-[#F7F7F5] text-[#111111] text-xs font-medium cursor-pointer"
                            title="Preview Document"
                          >
                            <Eye className="w-3 h-3 inline mr-1 text-[#777777]" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => setSelectedForRenew(doc)}
                            className="px-2.5 py-1 rounded bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold cursor-pointer"
                            title="Upload Renewal"
                          >
                            <RefreshCw className="w-3 h-3 inline mr-1" />
                            <span>Renew</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renew Document Modal */}
      {selectedForRenew && (
        <RenewDocumentModal
          isOpen={!!selectedForRenew}
          onClose={() => setSelectedForRenew(null)}
          document={selectedForRenew}
        />
      )}

      {/* Preview Modal */}
      {selectedForPreview && (
        <DocumentPreviewModal
          isOpen={!!selectedForPreview}
          onClose={() => setSelectedForPreview(null)}
          document={selectedForPreview}
        />
      )}

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <UploadDocumentModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      )}
    </div>
  );
};
