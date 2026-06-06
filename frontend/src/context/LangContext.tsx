import { createContext, useContext, useState, ReactNode } from 'react';
import { Lang } from '../types';
import { T, TranslationKey } from '../data/translations';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangCtx>({} as LangCtx);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru');

  const t = (key: TranslationKey): string => T[lang][key] ?? T.ru[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
