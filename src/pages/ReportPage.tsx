import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Trash2,
  AlertCircle,
  HelpCircle,
  Camera
} from 'lucide-react';
import { useT } from '../i18n/useT';
import { useStore } from '../store/useStore';
import { ReportMap } from '../components/report/ReportMap';
import { VoiceRecorder } from '../components/report/VoiceRecorder';
import { AiRoutingSequence } from '../components/report/AiRoutingSequence';
import { classifyGrievance, createComplaintFromSubmission } from '../services/classifier';
import { Complaint, RoutingClassification } from '../types';
import { useToast } from '../components/common/Toast';

export const ReportPage: React.FC = () => {
  const { t, language } = useT();
  const { showToast } = useToast();
  const addComplaint = useStore((state) => state.addComplaint);
  const existingComplaints = useStore((state) => state.complaints);
  const liveWeather = useStore((state) => state.liveWeather);

  // Form states
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number]>([19.3082, 72.8425]);
  const [locationName, setLocationName] = useState('Station West Exit Road, Ward A');
  const [photoPreview, setPhotoPreview] = useState<string>('https://picsum.photos/seed/civic_live_init/600/400');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Routing Modal States
  const [activeClassification, setActiveClassification] = useState<RoutingClassification | null>(null);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // 5 Realistic Example Scenarios with multi-lingual support
  const exampleChips = [
    {
      id: 'potholes',
      label: t('chipPothole'),
      text:
        language === 'hi'
          ? 'स्टेशन के पश्चिम निकास पर बड़े गड्ढे हैं। शाम के समय कई दोपहिया वाहन फिसल चुके हैं।'
          : language === 'mr'
          ? 'स्टेशनच्या पश्चिम बाहेर पडण्याच्या रस्त्यावर खोल खड्डे पडले आहेत. रिक्षा आणि दुचाकी घसरून अपघात होत आहेत.'
          : 'Multiple deep potholes right outside the railway station west gate causing major traffic crawl and two-wheeler skids.',
      coords: [19.3082, 72.8425] as [number, number],
      loc: 'Station West Exit Road, Ward A',
      photo: 'https://picsum.photos/seed/pothole_ex_1/600/400'
    },
    {
      id: 'garbage',
      label: t('chipGarbage'),
      text:
        language === 'hi'
          ? 'सब्जी मंडी के पास पिछले 5 दिनों से कचरा नहीं उठाया गया है। दुर्गंध और मक्खियों की भरमार है।'
          : language === 'mr'
          ? 'भाजी मंडईजवळ मागील ५ दिवसांपासून कचरा उचललेला नाही. दुर्गंधी आणि मोकाट कुत्र्यांचा त्रास वाढला आहे.'
          : 'Huge municipal waste pile uncollected for 5 days near Central Vegetable Market. Extremely foul smell and health hazard.',
      coords: [19.3088, 72.8582] as [number, number],
      loc: 'Near Sabzi Mandi Gate 2, Central Market, Ward B',
      photo: 'https://picsum.photos/seed/garbage_ex_2/600/400'
    },
    {
      id: 'waterleak',
      label: t('chipWaterLeak'),
      text:
        language === 'hi'
          ? 'मुख्य सड़क पर पीने के पानी की मुख्य पाइपलाइन फट गई है और हजारों लीटर साफ पानी बह रहा है।'
          : language === 'mr'
          ? 'मुख्य रस्त्यावर पिण्याच्या पाण्याची पाईपलाईन फुटल्याने हजारो लिटर पाण्याचा अपव्यय होत आहे.'
          : 'High pressure drinking water main pipeline rupture on Tech Park Boulevard. Potable water flooding carriageway.',
      coords: [19.3241, 72.8435] as [number, number],
      loc: 'Tech Park Boulevard, Cyber Zone, Ward C',
      photo: 'https://picsum.photos/seed/water_leak_3/600/400'
    },
    {
      id: 'exposedwire',
      label: t('chipExposedWire'),
      text:
        language === 'hi'
          ? 'प्राथमिक स्कूल के गेट के पास बिजली का खुला तार लटक रहा है और स्पार्क हो रहा है। बहुत बड़ा खतरा है!'
          : language === 'mr'
          ? 'प्राथमिक शाळेच्या प्रवेशद्वाराजवळ उघडी विद्युत तार लटकत असून ठिणग्या उडत आहेत. मुलांच्या जीवाला धोका आहे!'
          : 'Exposed live electrical conductor sparking next to Municipal Primary School gate. High electrocution danger to children!',
      coords: [19.2925, 72.8421] as [number, number],
      loc: 'School Lane, Kotwali Bazaar, Ward E',
      photo: 'https://picsum.photos/seed/wire_spark_4/600/400'
    },
    {
      id: 'multidept',
      label: t('chipMultiDept'),
      text:
        language === 'hi'
          ? 'सड़क पूरी तरह टूट गई है और नीचे की पानी की पाइपलाइन भी फूट गई है। पानी भरने से गड्ढा और गहरा हो रहा है।'
          : language === 'mr'
          ? 'रस्ता खचला असून खालील पाण्याची पाईपलाईन फुटली आहे. पाणी साचून रस्ता पूर्णपणे बंद पडला आहे.'
          : 'Severe asphalt cave-in combined with high pressure burst drinking water supply line undermining the entire road foundation.',
      coords: [19.3085, 72.8721] as [number, number],
      loc: 'Metro Link Road, Metro Junction, Ward G',
      photo: 'https://picsum.photos/seed/burst_road_pipe_5/600/400'
    }
  ];

  const handleApplyChip = (chip: (typeof exampleChips)[0]) => {
    setDescription(chip.text);
    setCoordinates(chip.coords);
    setLocationName(chip.loc);
    setPhotoPreview(chip.photo);
    showToast(`Loaded scenario: ${chip.label}`, 'info');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        showToast('Photo attached successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      showToast('Please describe the civic issue', 'warning');
      return;
    }

    setIsSubmitting(true);

    // 1. Run mock weighted-keyword classifier
    const classification = classifyGrievance({
      text: description,
      coordinates,
      isRaining: liveWeather.isRaining,
      existingComplaints
    });

    // 2. Build official complaint record
    const newComplaint = createComplaintFromSubmission({
      text: description,
      locationName,
      coordinates,
      photoUrl: photoPreview,
      classification,
      userNotifiedViaWhatsApp: true
    });

    // 3. Save to store so it instantly reflects in tracker
    addComplaint(newComplaint);

    setActiveClassification(classification);
    setCreatedComplaint(newComplaint);
    setShowAiModal(true);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DE2C4]/10 border border-[#2DE2C4]/20 text-[#2DE2C4] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero-Dropdown AI Dispatch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
          {t('reportTitle')}
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          {t('reportSubtitle')}
        </p>
      </div>

      {/* 5 Scenario Chips */}
      <div className="mb-8">
        <span className="text-xs font-mono text-slate-400 block mb-2.5">
          {t('exampleChipsTitle')}
        </span>
        <div className="flex flex-wrap gap-2">
          {exampleChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleApplyChip(chip)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#2DE2C4]/40 text-xs text-slate-300 hover:text-white transition active:scale-95 text-left"
            >
              ⚡ {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversational Report Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Step A: Problem Description with Mic */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2DE2C4]/20 text-[#2DE2C4] flex items-center justify-center text-xs font-mono">
                1
              </span>
              <span>Describe the issue in your own words</span>
            </label>
            <VoiceRecorder onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}` : text))} />
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder={t('inputPlaceholder')}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#2DE2C4] transition shadow-inner resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Supports Marathi, Hindi, & English speech or text</span>
            <span className="font-mono">{description.length} chars</span>
          </div>
        </div>

        {/* Step B: Photo Upload */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] flex items-center justify-center text-xs font-mono">
                2
              </span>
              <span>{t('photoUploadTitle')}</span>
            </label>
            <span className="text-xs text-slate-400">Photographic Evidence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Upload Area */}
            <div className="sm:col-span-2 relative border-2 border-dashed border-white/15 hover:border-[#2DE2C4]/50 rounded-2xl p-6 text-center transition cursor-pointer group bg-white/5 flex flex-col items-center justify-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Upload Photo"
              />
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#2DE2C4] group-hover:scale-110 transition">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white">
                {t('photoUploadDesc')}
              </p>
              <span className="text-[11px] text-slate-400">JPG, PNG, HEIC up to 10MB</span>
            </div>

            {/* Photo Preview Card */}
            <div className="relative h-36 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://picsum.photos/seed/civic_fallback_img/600/400';
                }}
              />
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setPhotoPreview(
                      `https://picsum.photos/seed/random_civic_${Date.now()}/600/400`
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-slate-300 hover:text-white font-mono"
                  title="Generate New Sample Photo"
                >
                  Regenerate
                </button>
              </div>
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-200 font-mono">
                Live Evidence
              </span>
            </div>
          </div>
        </div>

        {/* Step C: Location & Interactive Map */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-mono">
                3
              </span>
              <span>{t('locationCardTitle')}</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              Lat: {coordinates[0].toFixed(4)}, Lng: {coordinates[1].toFixed(4)}
            </span>
          </div>

          <ReportMap
            coordinates={coordinates}
            onCoordinatesChange={(newCoords, locName) => {
              setCoordinates(newCoords);
              if (locName) setLocationName(locName);
            }}
          />

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-[#2DE2C4] shrink-0" />
            <span className="font-semibold text-white">Target Address:</span>
            <span className="truncate">{locationName}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[320px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#2DE2C4] text-[#0B1020] font-bold text-base hover:brightness-110 active:scale-95 transition shadow-2xl shadow-[#2DE2C4]/30 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-[#0B1020]" />
            <span>{isSubmitting ? t('analyzingBtn') : t('submitReportBtn')}</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Autonomous multi-lingual routing • 4s max SLA dispatch
          </span>
        </div>
      </form>

      {/* AI Routing Animated Sequence Modal */}
      {showAiModal && activeClassification && createdComplaint && (
        <AiRoutingSequence
          classification={activeClassification}
          complaint={createdComplaint}
          onComplete={() => {
            setShowAiModal(false);
            setDescription('');
          }}
        />
      )}
    </div>
  );
};
