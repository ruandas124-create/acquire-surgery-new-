import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;
    setSubmitting(true);
    await api.createLead({
      name,
      mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
      treatment: 'General Patient Inquiry',
      budget: 'Flexible',
      city: 'Bangalore',
      source: 'Contact Page Inquiry',
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div id="contact-us-view" className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2.5 border border-emerald-200">
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Patient Support Helpline</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Talk to the Acquire Surgery Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Have questions regarding surgery costs, hospital options, or cashless mediclaim support in Bangalore? We’re here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A3B75] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-[#0A3B75]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Phone Helpline</h4>
              <p className="text-xs text-slate-500 mt-0.5">Speak with a Bangalore hospital coordinator</p>
              <a
                href="tel:+919429693887"
                className="text-base font-extrabold text-[#0A3B75] hover:underline mt-1 block"
              >
                +91 94296 93887
              </a>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Email Inquiries</h4>
              <p className="text-xs text-slate-500 mt-0.5">Send doctor prescriptions or query details</p>
              <a
                href="mailto:acquireopd@gmail.com"
                className="text-base font-extrabold text-emerald-700 hover:underline mt-1 block"
              >
                acquireopd@gmail.com
              </a>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Bangalore Office</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                12th Main Rd, HAL 2nd Stage, Indiranagar,<br />
                Bengaluru, Karnataka 560038
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Support Hours: Mon – Sat: 8:00 AM – 9:00 PM | Sun: 9:00 AM – 5:00 PM</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Thank You for Reaching Out</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                An Acquire Surgery patient coordinator has received your message and will call you on <strong>{mobile}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Request a Callback from Our Coordinator</h3>
              <p className="text-xs text-slate-500">
                Leave your details below and an experienced hospital navigator will contact you.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-bold text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-r-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">How Can We Help?</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what treatment or surgery you need assistance with..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-5 bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-300" />
                <span>{submitting ? 'Sending Request...' : 'Request Free Callback'}</span>
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your contact info is strictly confidential and never shared with advertisers.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
