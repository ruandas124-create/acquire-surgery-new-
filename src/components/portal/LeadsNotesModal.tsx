import React, { useState } from 'react';
import { Lead, AuthUser } from '../../types';
import { api } from '../../services/api';
import { 
  FileText, 
  X, 
  Send, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';

interface LeadsNotesModalProps {
  lead: Lead;
  currentUser: AuthUser;
  onClose: () => void;
  onLeadUpdated: (updatedLead: Lead) => void;
}

export const LeadsNotesModal: React.FC<LeadsNotesModalProps> = ({
  lead,
  currentUser,
  onClose,
  onLeadUpdated,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const updatedLead = await api.updateLead(lead.id, {
        note: newNoteText.trim(),
        authorName: currentUser.name || 'Admin',
      });
      onLeadUpdated(updatedLead);
      setNewNoteText('');
    } catch (err: any) {
      setError(err?.message || 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="leads-notes-modal"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#062B61] to-[#0A3B75] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <FileText className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Lead Follow-Up Notes</h2>
              <p className="text-[11px] text-slate-300">
                Patient: <span className="font-semibold text-white">{lead.name}</span> ({lead.treatment})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lead Summary strip */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs flex items-center justify-between shrink-0">
          <div>
            <span className="text-slate-500">Contact:</span> <strong className="text-slate-800">{lead.mobile}</strong>
          </div>
          <div>
            <span className="text-slate-500">Budget:</span> <strong className="text-slate-800">{lead.budget}</strong>
          </div>
          <div>
            <span className="text-slate-500">Status:</span> <span className="font-semibold text-[#062B61]">{lead.status}</span>
          </div>
        </div>

        {/* Notes Timeline / History */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Timeline Notes ({lead.notes?.length || 0})
          </h3>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {(!lead.notes || lead.notes.length === 0) ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No follow-up notes recorded yet. Add the first clinical or counseling note below.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lead.notes.map((noteStr, idx) => {
                // Parse timestamp and author if bracketed
                const bracketMatch = noteStr.match(/^\[(.*?)\]\s*(.*)$/);
                const meta = bracketMatch ? bracketMatch[1] : '';
                const content = bracketMatch ? bracketMatch[2] : noteStr;

                return (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 space-y-1 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {meta || 'Note'}
                      </span>
                      <span className="text-slate-400">#{lead.notes!.length - idx}</span>
                    </div>
                    <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                      {content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Add New Note
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter consultation details, patient follow-up, or surgeon recommendations..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newNoteText.trim()}
              className="px-4 py-2 bg-[#062B61] hover:bg-[#0A3B75] text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Add Note'}</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400">
            Note will be stamped with timestamp and author: <strong>{currentUser.name}</strong>
          </div>
        </form>
      </div>
    </div>
  );
};
