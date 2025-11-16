// AtiQr Interface Translations
import { SupportedLanguage } from '../types/wikiindaba';

export interface Translation {
  appTitle: string;
  appSubtitle: string;
  pasteMode: string;
  studyMode: string;
  searchPlaceholder: string;
  textareaLabel: string;
  analyzeButton: string;
  characters: string;
  words: string;
  analyzing: string;
  originalText: string;
  improvedVersion: string;
  critical: string;
  important: string;
  suggestions: string;
  howItHelps: string;
  helpPoint1: string;
  helpPoint2: string;
  helpPoint3: string;
  helpPoint4: string;
  poweredBy: string;
  footer: string;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    appTitle: 'AtiQr',
    appSubtitle: 'Wikipedia Training Tool for School Clubs',
    pasteMode: 'Paste & Analyze',
    studyMode: 'Study Article',
    searchPlaceholder: 'Search Wikipedia articles...',
    textareaLabel: 'Paste your draft paragraph or article:',
    analyzeButton: 'Analyze & Learn',
    characters: 'characters',
    words: 'words',
    analyzing: 'Analyzing your text...',
    originalText: 'Your Original Text',
    improvedVersion: 'Improved Version',
    critical: 'Critical',
    important: 'Important',
    suggestions: 'Suggestions',
    howItHelps: 'How AtiQr helps you learn:',
    helpPoint1: 'Identifies citation issues, biased language, and style problems',
    helpPoint2: 'Shows corrections side-by-side with explanations',
    helpPoint3: 'Links to Wikipedia guidelines for deeper learning',
    helpPoint4: 'Tracks your progress and common mistakes',
    poweredBy: 'Powered by',
    footer: 'Built for Wikipedia Clubs'
  },
  fr: {
    appTitle: 'AtiQr',
    appSubtitle: 'Outil de Formation Wikipedia',
    pasteMode: 'Coller et Analyser',
    studyMode: 'Étudier un Article',
    searchPlaceholder: 'Rechercher des articles...',
    textareaLabel: 'Collez votre brouillon:',
    analyzeButton: 'Analyser et Apprendre',
    characters: 'caractères',
    words: 'mots',
    analyzing: 'Analyse en cours...',
    originalText: 'Votre Texte Original',
    improvedVersion: 'Version Améliorée',
    critical: 'Critique',
    important: 'Important',
    suggestions: 'Suggestions',
    howItHelps: 'Comment AtiQr vous aide:',
    helpPoint1: 'Identifie les problèmes de citation et de style',
    helpPoint2: 'Affiche les corrections avec explications',
    helpPoint3: 'Liens vers les directives Wikipedia',
    helpPoint4: 'Suit vos progrès et erreurs courantes',
    poweredBy: 'Propulsé par',
    footer: 'Construit pour les Clubs Wikipedia'
  },
  ar: {
    appTitle: 'AtiQr',
    appSubtitle: 'أداة تدريب ويكيبيديا',
    pasteMode: 'لصق وتحليل',
    studyMode: 'دراسة مقالة',
    searchPlaceholder: 'ابحث عن مقالات...',
    textareaLabel: 'الصق مسودتك:',
    analyzeButton: 'تحليل وتعلم',
    characters: 'أحرف',
    words: 'كلمات',
    analyzing: 'جاري التحليل...',
    originalText: 'نصك الأصلي',
    improvedVersion: 'النسخة المحسنة',
    critical: 'حرج',
    important: 'مهم',
    suggestions: 'اقتراحات',
    howItHelps: 'كيف يساعدك AtiQr:',
    helpPoint1: 'يحدد مشاكل الاستشهاد واللغة المتحيزة',
    helpPoint2: 'يعرض التصحيحات مع التفسيرات',
    helpPoint3: 'روابط لإرشادات ويكيبيديا',
    helpPoint4: 'يتتبع تقدمك والأخطاء الشائعة',
    poweredBy: 'مدعوم من',
    footer: 'مصمم لنوادي ويكيبيديا'
  },
  sw: {
    appTitle: 'AtiQr',
    appSubtitle: 'Zana ya Mafunzo ya Wikipedia',
    pasteMode: 'Bandika na Chambua',
    studyMode: 'Soma Makala',
    searchPlaceholder: 'Tafuta makala...',
    textareaLabel: 'Bandika rasimu yako:',
    analyzeButton: 'Chambua na Jifunze',
    characters: 'herufi',
    words: 'maneno',
    analyzing: 'Inachambua...',
    originalText: 'Maandishi Yako ya Asili',
    improvedVersion: 'Toleo Lililoboreshwa',
    critical: 'Muhimu Sana',
    important: 'Muhimu',
    suggestions: 'Mapendekezo',
    howItHelps: 'Jinsi AtiQr inavyokusaidia:',
    helpPoint1: 'Inatambua matatizo ya nukuu na lugha',
    helpPoint2: 'Inaonyesha marekebisho na maelezo',
    helpPoint3: 'Viungo vya miongozo ya Wikipedia',
    helpPoint4: 'Inafuatilia maendeleo yako',
    poweredBy: 'Inasaidiwa na',
    footer: 'Imejengwa kwa Vilabu vya Wikipedia'
  },
  ha: {
    appTitle: 'AtiQr',
    appSubtitle: 'Kayan Horar da Wikipedia',
    pasteMode: 'Manna da Bincika',
    studyMode: 'Karanta Labarin',
    searchPlaceholder: 'Nemo labaran...',
    textareaLabel: 'Manna daftarin ku:',
    analyzeButton: 'Bincika da Koya',
    characters: 'haruffa',
    words: 'kalmomi',
    analyzing: 'Ana bincika...',
    originalText: 'Rubutun Ku na Asali',
    improvedVersion: 'Sigar da Aka Inganta',
    critical: 'Mai Muhimmanci',
    important: 'Muhimmi',
    suggestions: 'Shawarwari',
    howItHelps: 'Yadda AtiQr ke taimaka:',
    helpPoint1: 'Yana gano matsalolin ambato da harshe',
    helpPoint2: 'Yana nuna gyare-gyare da bayanai',
    helpPoint3: 'Hanyoyin zuwa jagororin Wikipedia',
    helpPoint4: 'Yana bin ci gaban ku',
    poweredBy: 'Ana tallafawa ta',
    footer: 'An gina don Kungiyoyin Wikipedia'
  },
  yo: {
    appTitle: 'AtiQr',
    appSubtitle: 'Ohun elo Ikeko Wikipedia',
    pasteMode: 'Le ati Se ayewo',
    studyMode: 'Ko Nkan Kiko',
    searchPlaceholder: 'Wa awon nkan kiko...',
    textareaLabel: 'Le apere re:',
    analyzeButton: 'Se ayewo ati Ko',
    characters: 'awon leta',
    words: 'awon oro',
    analyzing: 'N se ayewo...',
    originalText: 'Oro Akoko Re',
    improvedVersion: 'Eya Ti O Dara Julo',
    critical: 'Pataki Pupo',
    important: 'Pataki',
    suggestions: 'Awon Imoran',
    howItHelps: 'Bii AtiQr se n ran o lowo:',
    helpPoint1: 'O n se idanimọ awon iṣoro itọkasi',
    helpPoint2: 'O n ṣafihan awon atunṣe pẹlu alaye',
    helpPoint3: 'Awon ọna asopọ si itọsọna Wikipedia',
    helpPoint4: 'O n tọpa ilọsiwaju re',
    poweredBy: 'Ti a ṣe atilẹyin nipasẹ',
    footer: 'Ti a kọ fun Awọn Ẹgbẹ Wikipedia'
  },
  am: {
    appTitle: 'AtiQr',
    appSubtitle: 'የዊኪፔዲያ ስልጠና መሳሪያ',
    pasteMode: 'ለጥፍ እና ተንትን',
    studyMode: 'ጽሑፍ አጥና',
    searchPlaceholder: 'ጽሑፎችን ፈልግ...',
    textareaLabel: 'ረቂቅዎን ለጥፉ:',
    analyzeButton: 'ተንትን እና ተማር',
    characters: 'ቁምፊዎች',
    words: 'ቃላት',
    analyzing: 'በመተንተን ላይ...',
    originalText: 'የእርስዎ ዋና ጽሑፍ',
    improvedVersion: 'የተሻሻለ ስሪት',
    critical: 'ወሳኝ',
    important: 'አስፈላጊ',
    suggestions: 'ጥቆማዎች',
    howItHelps: 'AtiQr እንዴት ይረዳል:',
    helpPoint1: 'የጥቅስ ችግሮችን እና የአጻጻፍ ችግሮችን ይለያል',
    helpPoint2: 'ማስተካከያዎችን ከማብራሪያዎች ጋር ያሳያል',
    helpPoint3: 'ወደ የዊኪፔዲያ መመሪያዎች አገናኞች',
    helpPoint4: 'እድገትዎን እና የተለመዱ ስህተቶችን ይከታተላል',
    poweredBy: 'የተደገፈው በ',
    footer: 'ለዊኪፔዲያ ክለቦች የተገነባ'
  },
  zu: {
    appTitle: 'AtiQr',
    appSubtitle: 'Ithuluzi Lokuqeqesha i-Wikipedia',
    pasteMode: 'Namathisela Futhi Uhlaziye',
    studyMode: 'Funda I-athikili',
    searchPlaceholder: 'Sesha ama-athikili...',
    textareaLabel: 'Namathisela idrafti yakho:',
    analyzeButton: 'Hlaziya Futhi Ufunde',
    characters: 'izinhlamvu',
    words: 'amagama',
    analyzing: 'Kuhlaziywa...',
    originalText: 'Umbhalo Wakho Wokuqala',
    improvedVersion: 'Inguqulo Ethuthukisiwe',
    critical: 'Kubaluleke Kakhulu',
    important: 'Kubalulekile',
    suggestions: 'Iziphakamiso',
    howItHelps: 'Indlela i-AtiQr ekusiza ngayo:',
    helpPoint1: 'Ikhomba izinkinga zokucaphuna',
    helpPoint2: 'Ibonisa ukulungiswa nezincazelo',
    helpPoint3: 'Izixhumanisi zemihlahlandlela ye-Wikipedia',
    helpPoint4: 'Ilandelela inqubekela phambili yakho',
    poweredBy: 'Kusekelwa ngu',
    footer: 'Yakhelwe Amaklab e-Wikipedia'
  }
};

export const getTranslation = (lang: SupportedLanguage): Translation => {
  return translations[lang] || translations.en;
};
