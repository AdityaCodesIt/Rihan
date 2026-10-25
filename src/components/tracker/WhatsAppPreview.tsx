import React from 'react';
import { Complaint } from '../../types';
import { useT } from '../../i18n/useT';
import { MessageSquare, CheckCheck, ShieldCheck } from 'lucide-react';

interface WhatsAppPreviewProps {
  complaint: Complaint;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ complaint }) => {
  const { t, language } = useT();

  const getChatMessages = () => {
    const list = [
      {
        id: 1,
        sender: 'CivicRoute Bot',
        time: 'At Registration',
        text:
          language === 'hi'
            ? `नमस्ते! आपकी शिकायत ${complaint.id} दर्ज कर ली गई है। एआई विश्लेषण द्वारा इसे संबंधित वार्ड में भेज दिया गया है।`
            : language === 'mr'
            ? `नमस्कार! आपली तक्रार ${complaint.id} नोंदवली गेली आहे. एआय प्रणालीने संबंधित प्रभागात काम वर्ग केले आहे.`
            : `Namaste Citizen. Grievance ${complaint.id} received. Our autonomous AI engine routed it with real-time GPS coordinates.`
      },
      {
        id: 2,
        sender: 'CivicRoute Bot',
        time: 'After Routing',
        text:
          language === 'hi'
            ? `अपडेट: आपकी शिकायत वार्ड इंजीनियर ${complaint.assignedOfficer.name} को आवंटित की गई है। तय समय-सीमा (SLA) शुरू हो चुकी है।`
            : language === 'mr'
            ? `अपडेट: आपली तक्रार प्रभाग अभियंता ${complaint.assignedOfficer.name} यांच्याकडे सोपवण्यात आली आहे. कामाची मुदत (SLA) सुरू झाली आहे.`
            : `Update: Dispatched to Field Officer ${complaint.assignedOfficer.name}. Official SLA countdown clock is now active.`
      }
    ];

    if (complaint.isEscalated) {
      list.push({
        id: 3,
        sender: 'CivicRoute Bot',
        time: 'Escalation Notice',
        text:
          language === 'hi'
            ? `अलर्ट: समय-सीमा पार होने के कारण यह मामला कार्यपालक अभियंता ${complaint.escalatedTo || 'वरिष्ठ अधिकारी'} को अग्रेषित किया गया है।`
            : language === 'mr'
            ? `सतर्कता: वेळेत काम न झाल्याने ही तक्रार थेट कार्यकारी अभियंत्यांकडे वर्ग करण्यात आली आहे.`
            : `Priority Alert: SLA window elapsed. Automatically escalated to ${complaint.escalatedTo || 'Executive Engineer'} for immediate action.`
      });
    }

    if (complaint.status === 'fixed' || complaint.status === 'verified') {
      list.push({
        id: 4,
        sender: 'CivicRoute Bot',
        time: 'Completion Check',
        text:
          language === 'hi'
            ? `अधिकारी द्वारा काम पूरा कर लिया गया है और फोटो अपलोड की गई है। कृपया पोर्टल पर जाकर समाधान सत्यापित करें।`
            : language === 'mr'
            ? `अभियंत्यांनी काम पूर्ण करून नवीन फोटो टाकला आहे. कृपया कामाची खात्री करून तक्रार बंद करा.`
            : `Site team completed work and uploaded after-photo evidence. Please review and confirm resolution in the portal.`
      });
    }

    if (complaint.status === 'verified') {
      list.push({
        id: 5,
        sender: 'CivicRoute Bot',
        time: 'Closed',
        text:
          language === 'hi'
            ? `पुष्टि करने के लिए धन्यवाद! शिकायत ${complaint.id} आधिकारिक रूप से बंद कर दी गई है।`
            : language === 'mr'
            ? `खात्री केल्याबद्दल धन्यवाद! तक्रार ${complaint.id} अधिकृतपणे पूर्ण घोषित करण्यात आली आहे.`
            : `Thank you for verifying! Ticket ${complaint.id} is officially verified and closed. Municipal record updated.`
      });
    }

    return list;
  };

  const messages = getChatMessages();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a101d] overflow-hidden shadow-2xl flex flex-col">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center font-bold text-xs">
            MC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs sm:text-sm">Municipal Grievance Bot</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <span className="text-[10px] text-emerald-200">Official Municipal WhatsApp Gateway</span>
          </div>
        </div>
        <MessageSquare className="w-4 h-4 text-emerald-200" />
      </div>

      {/* Chat Messages Body with WhatsApp background tint */}
      <div className="p-4 space-y-3 bg-[#0d1424] bg-opacity-95 min-h-[220px] max-h-[340px] overflow-y-auto">
        <div className="flex justify-center mb-1">
          <span className="text-[10px] bg-slate-800/80 border border-white/5 text-slate-400 px-3 py-0.5 rounded-full uppercase font-mono">
            Encrypted Civic Notice
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col items-start max-w-[92%]">
            <div className="bg-[#122b27] border border-emerald-500/20 rounded-2xl rounded-tl-sm p-3 text-slate-100 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-semibold text-emerald-400">{msg.sender}</span>
                <span className="text-[10px] font-mono text-slate-400">{msg.time}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">{msg.text}</p>
              <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-emerald-400">
                <CheckCheck className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
