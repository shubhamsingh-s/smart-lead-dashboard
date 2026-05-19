import React, { useEffect, useState } from 'react';
import { Download, Plus, Search, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLeadStore } from '../store/useLeadStore';
import type { Lead } from '../store/useLeadStore';
import { useDebounce } from '../hooks/useDebounce';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { AddLeadModal } from '../components/AddLeadModal';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { leads, pagination, loading, fetchLeads, deleteLead } = useLeadStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('Latest');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    fetchLeads({
      search: debouncedSearch,
      status: statusFilter,
      source: sourceFilter,
      sort: sortOrder,
      page,
      limit: 10,
    });
  }, [debouncedSearch, statusFilter, sourceFilter, sortOrder, page, fetchLeads]);

  const handleExportCSV = () => {
    if (!leads.length) return;
    
    const csvData = leads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      'Created At': new Date(lead.createdAt).toLocaleDateString(),
    }));
    
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = headers + '\n' + rows;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors = {
    New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-background">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-white font-bold">
            SL
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">Smart Leads</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{user?.role}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-500">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Overview</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleExportCSV} className="flex-1 sm:flex-none">
              <Download size={16} className="mr-2" /> Export CSV
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none">
              <Plus size={16} className="mr-2" /> Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Search Leads"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'New', label: 'New' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Qualified', label: 'Qualified' },
                { value: 'Lost', label: 'Lost' },
              ]}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              options={[
                { value: '', label: 'All Sources' },
                { value: 'Website', label: 'Website' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'Referral', label: 'Referral' },
              ]}
            />
          </div>
          <div className="w-full md:w-40">
            <Select
              label="Sort By"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              options={[
                { value: 'Latest', label: 'Latest First' },
                { value: 'Oldest', label: 'Oldest First' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-xl shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce"></div>
                      <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-4 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500 dark:text-slate-400">
                    No leads found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead: Lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {lead.source}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {user?.role === 'Admin' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this lead?')) {
                              deleteLead(lead._id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
