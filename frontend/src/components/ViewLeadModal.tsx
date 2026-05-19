import React from 'react';
import { X, Mail, Globe, Clock, User } from 'lucide-react';
import type { Lead } from '../store/useLeadStore';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const ViewLeadModal: React.FC<ViewLeadModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const statusColors = {
    New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lead Details</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">{lead.name}</h4>
              <span className={`mt-1 inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                {lead.status}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Mail size={18} className="text-slate-400" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Globe size={18} className="text-slate-400" />
              <span>Source: <span className="font-medium text-slate-900 dark:text-white">{lead.source}</span></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Clock size={18} className="text-slate-400" />
              <span>Added on {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <User size={18} className="text-slate-400" />
              <span className="text-xs">ID: {lead._id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
