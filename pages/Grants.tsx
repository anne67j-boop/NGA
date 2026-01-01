import React, { useState, useMemo } from 'react';
import { GRANTS } from '../constants';
import { Calendar, DollarSign, Search, Filter, Tag, CheckCircle, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';

type SortOption = 'deadline' | 'amount-high' | 'amount-low' | 'name';

const Grants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('deadline');

  const navigate = (path: string) => {
    window.location.hash = path;
    window.scrollTo(0, 0);
  };

  // Helper to parse amount strings like "$10,000 - $50,000" to a number (50000)
  const getMaxAmount = (amountStr: string) => {
    const matches = amountStr.match(/\$(\d{1,3}(,\d{3})*)/g);
    if (!matches || matches.length === 0) return 0;
    const maxVal = matches[matches.length - 1].replace(/[$,]/g, '');
    return parseInt(maxVal, 10);
  };

  // Helper to parse dates
  const getDateValue = (dateStr: string) => {
    if (dateStr.includes('Rolling') || dateStr.includes('Open')) return 9999999999999; 
    return new Date(dateStr).getTime();
  };

  const filteredAndSortedGrants = useMemo(() => {
    // 1. Filter
    let result = GRANTS.filter(grant => {
      const matchesSearch =
        grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? grant.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    });

    // 2. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return getDateValue(a.deadline) - getDateValue(b.deadline);
        case 'amount-high':
          return getMaxAmount(b.amount) - getMaxAmount(a.amount);
        case 'amount-low':
          return getMaxAmount(a.amount) - getMaxAmount(b.amount);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, filterCategory, sortBy]);

  const categories = Array.from(new Set(GRANTS.map(g => g.category)));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Assistance Programs</h1>
              <p className="text-lg text-slate-600">
                Browse official grant opportunities. Use the filters below to sort by eligibility.
              </p>
            </div>
            <div className="hidden md:block">
               <div className="bg-brand-50 border border-brand-100 px-4 py-2 rounded-lg flex items-center text-sm text-brand-800 font-medium">
                 <CheckCircle className="h-4 w-4 mr-2 text-brand-600" />
                 Verified for Fiscal Year 2025
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters & Sorting Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-brand-600" /> Filters
                </h2>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterCategory(''); setSortBy('deadline'); }}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline"
                >
                  Reset
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Keywords</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all"
                    placeholder="Search programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category</label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 rounded-md py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all cursor-pointer"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sorting - The "Sort Mode" - ACTIVATED */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center">
                  Sort Mode <ArrowUpDown className="h-3 w-3 ml-1" />
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('deadline')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-bold border transition-all shadow-sm ${
                      sortBy === 'deadline' 
                        ? 'bg-brand-600 border-brand-700 text-white ring-2 ring-brand-200' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'
                    }`}
                  >
                    <span>Deadline (Earliest)</span>
                    {sortBy === 'deadline' && <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setSortBy('amount-high')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-bold border transition-all shadow-sm ${
                      sortBy === 'amount-high' 
                        ? 'bg-brand-600 border-brand-700 text-white ring-2 ring-brand-200' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'
                    }`}
                  >
                    <span>Amount (Highest)</span>
                    {sortBy === 'amount-high' && <ArrowDown className="h-4 w-4" />}
                  </button>
                   <button
                    onClick={() => setSortBy('amount-low')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-bold border transition-all shadow-sm ${
                      sortBy === 'amount-low' 
                        ? 'bg-brand-600 border-brand-700 text-white ring-2 ring-brand-200' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'
                    }`}
                  >
                    <span>Amount (Lowest)</span>
                    {sortBy === 'amount-low' && <ArrowUp className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2 mb-4">
              <p className="text-sm text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredAndSortedGrants.length}</span> Active Programs
              </p>
              <div className="hidden sm:block text-xs text-slate-400">
                Sorted by: <span className="font-bold text-brand-600 uppercase">{sortBy.replace('-', ' ')}</span>
              </div>
            </div>

            {filteredAndSortedGrants.length > 0 ? (
              filteredAndSortedGrants.map((grant) => (
                <div key={grant.id} className="group bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-depth transition-all duration-200 relative overflow-hidden">
                  {/* Hover Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-brand-600 transition-colors"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100">
                           {grant.category}
                         </span>
                         {grant.category.includes('Business') && (
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                             SBA Compliant
                           </span>
                         )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <button onClick={() => navigate(`#/apply?preselectedGrant=${grant.id}`)} className="hover:text-brand-600 hover:underline text-left focus:outline-none">
                          {grant.title}
                        </button>
                      </h3>
                      
                      <p className="text-slate-600 mb-5 text-sm leading-relaxed max-w-2xl">
                        {grant.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                         <div className="flex items-center bg-green-50 px-3 py-1.5 rounded border border-green-100 text-green-800 font-bold">
                           <DollarSign className="h-4 w-4 mr-1.5" />
                           {grant.amount}
                         </div>
                         <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-slate-600 font-medium">
                           <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                           Deadline: {grant.deadline}
                         </div>
                      </div>

                      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
                        {grant.eligibility.map((item, idx) => (
                          <div key={idx} className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                            <CheckCircle className="h-3 w-3 mr-1.5 text-brand-500" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0 mt-4 md:mt-0 self-center md:self-start">
                      <button
                        onClick={() => navigate(`#/apply?preselectedGrant=${grant.id}`)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded shadow-sm text-white bg-brand-600 hover:bg-brand-700 hover:translate-y-[-1px] transition-all whitespace-nowrap active:bg-brand-800"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No programs match your filters</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Try adjusting your search terms or clearing the category filters to see more results.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterCategory(''); setSortBy('deadline'); }}
                  className="inline-flex items-center px-4 py-2 border border-brand-600 text-brand-600 font-bold rounded hover:bg-brand-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grants;