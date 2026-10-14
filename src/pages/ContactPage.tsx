import React from 'react';
import { ContactView } from '../components/ContactView';

export const ContactPage: React.FC = () => {
  return (
    <div id="contact-page-container" className="bg-slate-50/50 min-h-[85vh]">
      <ContactView />
    </div>
  );
};
