import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n/useT';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript }) => {
  const { t } = useT();
  const language = useStore((state) => state.language);
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [waveformBars, setWaveformBars] = useState<number[]>([4, 8, 14, 6, 12, 18, 9, 5]);

  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Map app language to Web Speech recognition language tags
  const getLocaleTag = (lang: string) => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      default:
        return 'en-IN';
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Waveform animation loop
  useEffect(() => {
    if (isRecording) {
      const updateWaveform = () => {
        setWaveformBars(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 26) + 4)
        );
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      const interval = setInterval(updateWaveform, 120);
      return () => {
        clearInterval(interval);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    } else {
      setWaveformBars([4, 6, 8, 5, 10, 7, 4, 6, 8, 4, 7, 5]);
    }
  }, [isRecording]);

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful fallback: simulated voice input in current language
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sampleVoices = {
          en: 'Dangerous deep potholes on Station Road near Auto Stand with stagnant water.',
          hi: 'स्टेशन रोड पर ऑटो स्टैंड के पास बहुत बड़े गड्ढे हो गए हैं और पानी भर गया है।',
          mr: 'स्टेशन रोडवर रिक्षा स्टँडजवळ मोठे खड्डे पडले आहेत आणि पाणी साचले आहे.'
        };
        onTranscript(sampleVoices[language] || sampleVoices.en);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getLocaleTag(language);
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleRecording}
        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm transition shadow-lg active:scale-95 ${
          isRecording
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/20'
            : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
        }`}
        title={isSupported ? t('voiceStart') : t('voiceFallback')}
      >
        {isRecording ? (
          <>
            <MicOff className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{t('voiceStop')}</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-[#2DE2C4] shrink-0" />
            <span>{t('voiceStart')}</span>
          </>
        )}
      </button>

      {/* Live Waveform Indicator */}
      {isRecording && (
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30">
          <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse mr-1" />
          <div className="flex items-center gap-1 h-5">
            {waveformBars.map((height, i) => (
              <span
                key={i}
                className="w-1 bg-rose-400 rounded-full transition-all duration-150"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-rose-300 ml-2 animate-pulse">
            REC ({getLocaleTag(language)})
          </span>
        </div>
      )}
    </div>
  );
};
