import React from 'react';
import { Phone } from 'lucide-react';

interface TreatmentFloatingContactBarProps {
  phoneNumber?: string;
  whatsAppNumber?: string;
  defaultWhatsAppMessage?: string;
}

export const TreatmentFloatingContactBar: React.FC<TreatmentFloatingContactBarProps> = ({
  phoneNumber = '+919429693887',
  whatsAppNumber = '919429693887',
  defaultWhatsAppMessage = 'Hi Acquire Surgery, I would like guidance regarding surgical treatments and hospital options in Bangalore.',
}) => {
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  const cleanWhatsApp = whatsAppNumber.replace(/\D+/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(defaultWhatsAppMessage)}`;

  return (
    <aside
      id="treatment-floating-contact-bar"
      aria-label="Direct Patient Contact Desk"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-3 sm:px-6 py-2.5 sm:py-3 transition-transform"
    >
      <div className="max-w-md sm:max-w-lg mx-auto w-full grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* 1. CALL NOW - White with purple border, purple phone icon, purple text */}
        <a
          id="btn-floating-call-now"
          href={`tel:${cleanPhone}`}
          className="h-12 sm:h-13 bg-white hover:bg-purple-50/80 active:bg-purple-100 text-[#7C3AED] border-2 border-[#7C3AED] rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 sm:gap-2.5 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          title="Call Acquire Surgery Directly"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED] shrink-0 fill-purple-100" />
          <span className="whitespace-nowrap font-extrabold">CALL NOW</span>
        </a>

        {/* 2. WHATSAPP - Green with white WhatsApp icon, white text */}
        <a
          id="btn-floating-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 sm:h-13 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1da851] text-white border border-[#20ba5a]/30 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 sm:gap-2.5 shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          title="Chat on WhatsApp with Acquire Surgery"
        >
          {/* Official WhatsApp Vector Icon */}
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="whitespace-nowrap font-extrabold">WHATSAPP</span>
        </a>
      </div>
    </aside>
  );
};
