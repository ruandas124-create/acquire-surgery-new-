import React, { useState, useEffect } from 'react';
import { TreatmentInfo } from '../../types';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Stethoscope, X } from 'lucide-react';

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
      showMessage('Treatment or procedure already exists.', 'error');
      return;
    }

    try {
      await api.addTreatment(cleanName);
      setNewTreatmentName('');
      await loadTreatments();
      showMessage(`Successfully added "${cleanName}" to dropdown options.`);
    } catch (err: any) {
      showMessage(`Failed to add treatment: ${err?.message || 'Unknown error'}`, 'error');
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
      showMessage('Treatment option updated successfully.');
    } catch (err: any) {
      showMessage(`Failed to update treatment: ${err?.message || 'Unknown error'}`, 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the Find Your Hospital form dropdown?`)) {
      return;
    }

    try {
      await api.deleteTreatment(id);
      await loadTreatments();
      showMessage(`Successfully removed "${name}".`);
    } catch (err: any) {
      showMessage(`Failed to delete treatment: ${err?.message || 'Unknown error'}`, 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#062B61]" />
            Manage Treatments / Procedures Dropdown
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Add, edit, or remove treatment and surgery options. Changes immediately reflect in the public &quot;Find Your Hospital with Acquire Surgery&quot; form dropdown.
          </p>
        </div>
      </div>

      {/* Toast message */}
      {message && (
        <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add Treatment Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTreatmentName}
          onChange={(e) => setNewTreatmentName(e.target.value)}
          placeholder="Enter new treatment or procedure name (e.g. Laser Proctology)..."
          className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#062B61]"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#052048] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Treatment</span>
        </button>
      </form>

      {/* Treatments List Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading treatments...</div>
        ) : treatments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No treatments found. Add one above.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Treatment / Procedure Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {treatments.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {editingId === t.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-blue-400 rounded-lg bg-white shadow-xs"
                        autoFocus
                      />
                    ) : (
                      t.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.category || 'General Surgery'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {editingId === t.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(t.id)}
                          className="px-3 py-1.5 bg-[#062B61] text-white rounded-lg font-semibold text-xs hover:bg-[#052048] cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs hover:bg-slate-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-blue-700 hover:bg-blue-50 rounded-lg font-semibold cursor-pointer"
                          title="Edit Treatment Name"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                          title="Remove Treatment"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
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
