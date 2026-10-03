import React, { useState, useEffect } from "react";
import { X, Inbox, Mail, User, Clock, Trash2, Download, Send, CheckCircle2, RefreshCw } from "lucide-react";

interface FormLead {
  id: string;
  name: string;
  email: string;
  message: string;
  page: string;
  submittedAt: string;
}

interface FormLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormLeadsModal({ isOpen, onClose }: FormLeadsModalProps) {
  const [leads, setLeads] = useState<FormLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forms/leads");
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (e) {
      console.error("Failed to fetch leads", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/forms/leads/${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTestLead = async () => {
    setSendingTest(true);
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Client",
          email: "test.client@example.com",
          message: "Hi! This is a live test submission to verify backend database storage.",
          page: "Home",
        }),
      });
      const data = await res.json();
      if (data.lead) {
        setLeads((prev) => [data.lead, ...prev]);
        setTestSent(true);
        setTimeout(() => setTestSent(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingTest(false);
    }
  };

  const exportCsv = () => {
    if (!leads.length) return;
    const header = "ID,Name,Email,Page,Message,SubmittedAt\n";
    const rows = leads.map((l) => `"${l.id}","${l.name}","${l.email}","${l.page}","${l.message.replace(/"/g, '""')}","${l.submittedAt}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#1c1917] border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c3836] bg-[#221f1d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Inbox size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Backend Form Leads & Inbox
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-medium">
                  {leads.length} Submissions
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Live submissions from contact forms stored in the backend Node/Express database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={leads.length === 0}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 border-b border-stone-800 bg-[#161413] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Live Backend Route:</span>
            <code className="text-[11px] bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-orange-400 font-mono">
              POST /api/forms/submit
            </code>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLeads}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1 transition"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleSendTestLead}
              disabled={sendingTest}
              className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {testSent ? <CheckCircle2 size={13} className="text-white" /> : <Send size={13} />}
              <span>{testSent ? "Test Submitted!" : "Send Test Lead"}</span>
            </button>
          </div>
        </div>

        {/* Leads List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#121110]">
          {leads.length === 0 ? (
            <div className="text-center py-16 text-stone-500 text-xs">
              No form submissions collected yet. Submit the contact form on your website or click "Send Test Lead" above!
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 space-y-2.5 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-100 flex items-center gap-1.5">
                      <User size={13} className="text-orange-400" />
                      {lead.name}
                    </span>
                    <span className="text-stone-500">•</span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-stone-400 hover:text-orange-400 flex items-center gap-1 transition"
                    >
                      <Mail size={12} />
                      {lead.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-stone-800 px-2 py-0.5 rounded text-stone-400">
                      Page: {lead.page}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      className="p-1 text-stone-500 hover:text-red-400 transition"
                      title="Delete lead"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed bg-[#171514] p-3 rounded-lg border border-stone-800/80">
                  {lead.message}
                </p>

                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-mono">
                  <Clock size={11} />
                  <span>{new Date(lead.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
