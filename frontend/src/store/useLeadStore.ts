import { create } from 'zustand';
import api from '../api/axios';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LeadState {
  leads: Lead[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  fetchLeads: (params?: any) => Promise<void>;
  createLead: (lead: Partial<Lead>) => Promise<boolean>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<boolean>;
  deleteLead: (id: string) => Promise<boolean>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  pagination: null,
  loading: false,
  error: null,
  
  fetchLeads: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/leads', { params });
      set({ leads: response.data.data, pagination: response.data.pagination, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch leads', loading: false });
    }
  },

  createLead: async (lead) => {
    try {
      await api.post('/leads', lead);
      await get().fetchLeads();
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create lead' });
      return false;
    }
  },

  updateLead: async (id, leadData) => {
    try {
      await api.put(`/leads/${id}`, leadData);
      // Optimistic update
      set((state) => ({
        leads: state.leads.map(lead => lead._id === id ? { ...lead, ...leadData } : lead)
      }));
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update lead' });
      return false;
    }
  },

  deleteLead: async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      // Optimistic update
      set((state) => ({
        leads: state.leads.filter(lead => lead._id !== id)
      }));
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete lead' });
      return false;
    }
  }
}));
