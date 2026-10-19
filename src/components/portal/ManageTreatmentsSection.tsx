import React, { useState, useEffect } from 'react';
import { TreatmentInfo } from '../../types';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Stethoscope, Check, X, Sparkles } from 'lucide-react';

export const ManageTreatmentsSection: React.FC = () => {
  const [treatments, setTreatments] = useState<TreatmentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTreatmentName, setNewTreatmentName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const data = await api.getTreatments();
      setTreatments(data);
    } catch (err) {
      console.error('Failed to load treatments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatments();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newTreatmentName.trim();
    if (!cleanName) return;

    // Check duplicate
    if (treatments.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
      showMessage('Treatment or procedure already exists in catalogue.', 'error');
      return;
    }

    try {
      await api.addTreatment(cleanName);
      setNewTreatmentName('');
      await loadTreatments();
      showMessage(`Added "${cleanName}" to live procedure dropdown.`);
    } catch (err: any) {
      showMessage(`Failed to add treatment: ${err?.message || 'Database error'}`, 'error');
    }
  };

  const handleStartEdit = (t: TreatmentInfo) => {
    setEditingId(t.id);
    setEditingName(t.name);
  };

  const handleSaveEdit = async (id: string) => {
    const cleanName = editingName.trim();
    if (!cleanName) return;

    // Check duplicate
    if (treatments.some(t => t.id !== id && t.name.toLowerCase() === cleanName.toLowerCase())) {
      showMessage('Another treatment with this name already exists.', 'error');
      return;
    }

    try {
      await api.updateTreatment(id, cleanName);
      setEditingId(null);
      setEditingName('');
      await loadTreatments();
      showMessage('Treatment procedure updated successfully.');
    } catch (err: any) {
      showMessage(`Failed to update treatment: ${err?.message || 'Database error'}`, 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the public hospital matching form?`)) {
      return;
    }

    try {
      await api.deleteTreatment(id);
      await loadTreatments();
      showMessage(`Successfully removed "${name}".`);
    } catch (err: any) {
      showMessage(`Failed to delete treatment: ${err?.message || 'Database error'}`, 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Manage Treatments &amp; Surgery Package Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized directly with Supabase database. Changes dynamically appear in the public &ldquo;Find Your Hospital with Acquire Surgery&rdquo; dropdown.
          </p>
        </div>
        <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 self-start sm:self-auto tabular-nums">
          {treatments.length} Active Procedures
        </span>
      </div>

      {/* Toast message */}
      {message && (
        <div className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add Treatment Input */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={newTreatmentName}
          onChange={(e) => setNewTreatmentName(e.target.value)}
          placeholder="Type new treatment or surgery name (e.g. Laser Varicose Veins Treatment)..."
          className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[#0B1E3B] focus:border-[#0B1E3B] transition-all"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1E3B] hover:bg-[#071325] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Add Procedure</span>
        </button>
      </form>

      {/* Treatments Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading procedure catalogue...</div>
        ) : treatments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No procedures registered. Add one using the form above.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Treatment / Procedure Name</th>
                <th className="px-4 py-3">Clinical Specialty</th>
                <th className="px-4 py-3">Bangalore Cost Benchmark</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {treatments.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px] tabular-nums">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {editingId === t.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-teal-500 rounded-md bg-white shadow-xs focus:outline-hidden"
                        autoFocus
                      />
                    ) : (
                      t.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="text-[11px] font-medium text-slate-700">
                      {t.category || 'General Surgery'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px] tabular-nums">
                    {t.averageBangaloreMinCost && t.averageBangaloreMaxCost ? (
                      `₹${t.averageBangaloreMinCost.toLocaleString('en-IN')} – ₹${t.averageBangaloreMaxCost.toLocaleString('en-IN')}`
                    ) : (
                      'Indicative on enquiry'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {editingId === t.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(t.id)}
                          className="px-3 py-1 bg-teal-700 text-white rounded-md font-semibold text-xs hover:bg-teal-800 cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md font-semibold text-xs hover:bg-slate-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-[#0B1E3B] hover:bg-slate-100 rounded-md font-semibold cursor-pointer"
                          title="Edit Procedure Name"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-500" /> 
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-md font-semibold cursor-pointer"
                          title="Remove Procedure"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> 
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
