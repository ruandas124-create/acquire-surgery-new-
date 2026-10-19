import React, { useState, useEffect } from 'react';
import { TreatmentInfo } from '../../types';
import { api } from '../../services/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Check, 
  X, 
  Search, 
  RefreshCw, 
  Database,
  ArrowRight
} from 'lucide-react';

const COMMON_CATEGORIES = [
  'General Surgery',
  'Orthopedics',
  'Ophthalmology',
  'Urology',
  'Cardiac Surgery',
  'Gynecology',
  'Fertility / IVF',
  'ENT & Head-Neck',
  'Plastic & Cosmetic',
  'Oncology'
];

export const ManageTreatmentsSection: React.FC = () => {
  const [treatments, setTreatments] = useState<TreatmentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Add state
  const [newTreatmentName, setNewTreatmentName] = useState('');
  const [newTreatmentCategory, setNewTreatmentCategory] = useState('General Surgery');
  const [isAdding, setIsAdding] = useState(false);

  // Update / Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Dedicated Update Modal state for comprehensive update
  const [modalEditTarget, setModalEditTarget] = useState<TreatmentInfo | null>(null);
  const [modalEditName, setModalEditName] = useState('');
  const [modalEditCategory, setModalEditCategory] = useState('');

  // Toast notification
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4500);
  };

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const data = await api.getTreatments();
      setTreatments(data);
    } catch (err: any) {
      console.error('Failed to load treatments from Supabase', err);
      showMessage(`Failed to load treatments: ${err?.message || 'Database error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatments();
  }, []);

  // Add Treatment -> Saves to Supabase table `treatments` column `name`
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newTreatmentName.trim();
    if (!cleanName) return;

    // Check duplicate
    if (treatments.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
      showMessage(`Treatment "${cleanName}" already exists in Supabase catalogue.`, 'error');
      return;
    }

    setIsAdding(true);
    try {
      await api.addTreatment(cleanName, newTreatmentCategory);
      setNewTreatmentName('');
      await loadTreatments();
      showMessage(`Added "${cleanName}" to Supabase table "treatments" (column: name).`);
    } catch (err: any) {
      console.error('Failed to add treatment to Supabase:', err);
      showMessage(`Failed to save to Supabase: ${err?.message || 'Database error'}`, 'error');
    } finally {
      setIsAdding(false);
    }
  };

  // Start Inline Edit
  const handleStartEdit = (t: TreatmentInfo) => {
    setEditingId(t.id);
    setEditingName(t.name);
    setEditingCategory(t.category || 'General Surgery');
  };

  // Save Inline Edit -> Updates Supabase table `treatments` column `name`
  const handleSaveInlineEdit = async (id: string) => {
    const cleanName = editingName.trim();
    if (!cleanName) {
      showMessage('Treatment procedure name cannot be empty.', 'error');
      return;
    }

    // Check duplicate among other items
    if (treatments.some(t => t.id !== id && t.name.toLowerCase() === cleanName.toLowerCase())) {
      showMessage(`Another treatment with the name "${cleanName}" already exists.`, 'error');
      return;
    }

    setIsUpdating(true);
    try {
      await api.updateTreatment(id, cleanName);
      setEditingId(null);
      setEditingName('');
      await loadTreatments();
      showMessage(`Saved update for "${cleanName}" in Supabase table "treatments" (column: name).`);
    } catch (err: any) {
      console.error('Failed to update treatment in Supabase:', err);
      showMessage(`Failed to update in Supabase: ${err?.message || 'Database error'}`, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Start Modal Edit
  const handleOpenEditModal = (t: TreatmentInfo) => {
    setModalEditTarget(t);
    setModalEditName(t.name);
    setModalEditCategory(t.category || 'General Surgery');
  };

  // Save Modal Edit -> Updates Supabase table `treatments` column `name`
  const handleSaveModalEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditTarget) return;

    const cleanName = modalEditName.trim();
    if (!cleanName) {
      showMessage('Treatment procedure name cannot be empty.', 'error');
      return;
    }

    // Check duplicate
    if (treatments.some(t => t.id !== modalEditTarget.id && t.name.toLowerCase() === cleanName.toLowerCase())) {
      showMessage(`Another treatment with the name "${cleanName}" already exists.`, 'error');
      return;
    }

    setIsUpdating(true);
    try {
      await api.updateTreatment(modalEditTarget.id, cleanName);
      setModalEditTarget(null);
      await loadTreatments();
      showMessage(`Successfully updated "${cleanName}" in Supabase table "treatments" (column: name).`);
    } catch (err: any) {
      console.error('Failed to update treatment in Supabase:', err);
      showMessage(`Failed to update in Supabase: ${err?.message || 'Database error'}`, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Treatment -> Deletes from Supabase table `treatments`
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Supabase table "treatments"? This will also remove it from public hospital matching dropdowns.`)) {
      return;
    }

    try {
      await api.deleteTreatment(id);
      await loadTreatments();
      showMessage(`Successfully deleted "${name}" from Supabase table "treatments".`);
    } catch (err: any) {
      console.error('Failed to delete treatment from Supabase:', err);
      showMessage(`Failed to delete from Supabase: ${err?.message || 'Database error'}`, 'error');
    }
  };

  const filteredTreatments = treatments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header with Supabase Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-bold mb-1.5">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>Supabase Sync Active • Table: treatments (column: name)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Manage Treatments &amp; Procedures
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Add, update, and manage treatments stored directly in Supabase table <code className="font-mono text-teal-700 bg-teal-50/70 px-1 py-0.5 rounded font-bold">treatments</code> (column <code className="font-mono text-teal-700 bg-teal-50/70 px-1 py-0.5 rounded font-bold">name</code>). Any updates saved here dynamically appear in the public &ldquo;Find Your Hospital with Acquire Surgery&rdquo; procedure dropdown.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadTreatments}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>
          <span className="text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200/80 tabular-nums">
            {treatments.length} Active Procedures
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-3 transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-xs' 
            : 'bg-rose-50 text-rose-950 border border-rose-200 shadow-xs'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="leading-snug">{message.text}</span>
        </div>
      )}

      {/* Add Treatment Form */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            Add New Procedure to Supabase
          </span>
          <span className="text-[11px] text-slate-400">Saves into <code className="font-mono text-slate-600">treatments.name</code></span>
        </div>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newTreatmentName}
            onChange={(e) => setNewTreatmentName(e.target.value)}
            placeholder="Type treatment name (e.g., Robotic Knee Replacement, Laser Varicose Veins)..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0B1E3B] focus:border-[#0B1E3B] transition-all font-medium placeholder:text-slate-400"
            disabled={isAdding}
          />
          <select
            value={newTreatmentCategory}
            onChange={(e) => setNewTreatmentCategory(e.target.value)}
            className="px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-[#0B1E3B] focus:outline-hidden"
            disabled={isAdding}
          >
            {COMMON_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isAdding || !newTreatmentName.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1E3B] hover:bg-[#071325] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>{isAdding ? 'Saving to Supabase...' : 'Add Procedure'}</span>
          </button>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search procedures in Supabase..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Specialty:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="All">All Specialties</option>
            {COMMON_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Treatments Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs sm:text-sm text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0B1E3B] border-t-transparent rounded-full animate-spin" />
            <span>Loading procedures from Supabase database...</span>
          </div>
        ) : filteredTreatments.length === 0 ? (
          <div className="p-12 text-center text-xs sm:text-sm text-slate-500">
            {searchQuery ? (
              <span>No treatments match &ldquo;{searchQuery}&rdquo;. Try another search.</span>
            ) : (
              <span>No treatments found in Supabase table &ldquo;treatments&rdquo;. Add one above.</span>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-14">#</th>
                  <th className="px-4 py-3">Treatment / Procedure Name (column: name)</th>
                  <th className="px-4 py-3">Clinical Specialty</th>
                  <th className="px-4 py-3">Benchmark Cost</th>
                  <th className="px-4 py-3 text-right">Update / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTreatments.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 font-mono text-xs tabular-nums">{idx + 1}</td>
                    
                    {/* Treatment Name Column (Inline Edit or Display) */}
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {editingId === t.id ? (
                        <div className="space-y-1.5 max-w-md">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs sm:text-sm border-2 border-teal-600 rounded-md bg-white shadow-xs focus:outline-hidden font-bold text-slate-900"
                            autoFocus
                            placeholder="Enter procedure name"
                          />
                          <p className="text-[10px] text-teal-700 font-medium">
                            Saves directly to Supabase table <code className="font-mono">treatments</code>, column <code className="font-mono">name</code>.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-bold">{t.name}</span>
                        </div>
                      )}
                    </td>

                    {/* Category Column */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {t.category || 'General Surgery'}
                      </span>
                    </td>

                    {/* Benchmark Cost Column */}
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-xs tabular-nums">
                      {t.averageBangaloreMinCost && t.averageBangaloreMaxCost ? (
                        `₹${t.averageBangaloreMinCost.toLocaleString('en-IN')} – ₹${t.averageBangaloreMaxCost.toLocaleString('en-IN')}`
                      ) : (
                        'Indicative'
                      )}
                    </td>

                    {/* Actions / Update Column */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {editingId === t.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleSaveInlineEdit(t.id)}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isUpdating ? 'Saving...' : 'Save Update'}</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          {/* Update Option Button */}
                          <button
                            onClick={() => handleStartEdit(t)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Update Treatment in Supabase"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>Update</span>
                          </button>

                          {/* Delete Option Button */}
                          <button
                            onClick={() => handleDelete(t.id, t.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            title="Delete Treatment from Supabase"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dedicated Comprehensive Update Modal */}
      {modalEditTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setModalEditTarget(null)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B1E3B] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-teal-300 block">Supabase Update</span>
                <h3 className="text-base font-extrabold text-white">Update Treatment / Procedure</h3>
              </div>
              <button
                onClick={() => setModalEditTarget(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModalEdit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Treatment / Procedure Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalEditName}
                  onChange={(e) => setModalEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0B1E3B]"
                  placeholder="Enter treatment name"
                  required
                />
                <p className="text-[11px] text-slate-500">
                  This value is saved directly to Supabase table <code className="font-mono text-teal-700 bg-slate-100 px-1 py-0.5 rounded">treatments</code>, column <code className="font-mono text-teal-700 bg-slate-100 px-1 py-0.5 rounded">name</code>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Clinical Specialty
                </label>
                <select
                  value={modalEditCategory}
                  onChange={(e) => setModalEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0B1E3B]"
                >
                  {COMMON_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalEditTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !modalEditName.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving to Supabase...' : 'Save Update to Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
