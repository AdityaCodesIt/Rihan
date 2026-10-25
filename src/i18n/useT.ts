import { useStore } from '../store/useStore';
import { TRANSLATIONS } from './translations';

export const useT = () => {
  const language = useStore((state) => state.language);
  
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return { t, language };
};
