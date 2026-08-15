export type LocaleId = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'ko' | 'zh' | 'ar';

export type LocaleOption = { id: LocaleId; label: string; tag: string };

export const LOCALE_OPTIONS: LocaleOption[] = [
  { id: 'en', label: 'English', tag: 'en-IN' },
  { id: 'hi', label: 'हिन्दी', tag: 'hi-IN' },
  { id: 'es', label: 'Español', tag: 'es-ES' },
  { id: 'fr', label: 'Français', tag: 'fr-FR' },
  { id: 'de', label: 'Deutsch', tag: 'de-DE' },
  { id: 'pt', label: 'Português', tag: 'pt-BR' },
  { id: 'ja', label: '日本語', tag: 'ja-JP' },
  { id: 'ko', label: '한국어', tag: 'ko-KR' },
  { id: 'zh', label: '中文', tag: 'zh-CN' },
  { id: 'ar', label: 'العربية', tag: 'ar' },
];

export const DEFAULT_LOCALE: LocaleId = 'en';

export function localeTag(locale: LocaleId): string {
  return LOCALE_OPTIONS.find((option) => option.id === locale)?.tag ?? 'en-IN';
}

export type UiCopy = {
  theme: string; free: string; pro: string; chooseTheme: string; language: string; showingTime: (city: string) => string;
  sunrise: string; sunset: string; daylight: string; plannedEvents: string; temperature: string; precipitation: string; snow: string; rain: string; previousDay: string; nextDay: string; chooseDate: string; plannerDate: string; addPlan: string;
  newMoment: string; addToDay: string; close: string; timezone: string; chooseTimezone: string; addTimezone: string; closeTimezoneList: string; add: string; startTime: string; endTime: string; label: string; labelPlaceholder: string; planType: string; repeatEvent: string; date: string; today: string; tomorrow: string; customDate: string; repeatOn: string; dayOfMonth: string; month: string; day: string; manageTimezones: string; remove: string; hardStop: string; hardStopHelp: string; cancel: string; save: string; chooseTimezoneToAdd: string; customEventDate: string; closeModal: string; untitledPlan: string;
  types: Record<string, string>; repeats: Record<string, string>; categories: Record<string, string>;
};

const english: UiCopy = {
  theme:'Theme', free:'Free', pro:'Pro', chooseTheme:'Choose theme', language:'Language', showingTime:(city) => `Showing ${city} time`, sunrise:'Sunrise', sunset:'Sunset', daylight:'daylight', plannedEvents:'Planned events', temperature:'Temperature', precipitation:'Precipitation', snow:'snow', rain:'rain', previousDay:'Previous day', nextDay:'Next day', chooseDate:'Choose date', plannerDate:'Choose planner date', addPlan:'Add a new plan', newMoment:'New moment', addToDay:'Add to your day', close:'Close', timezone:'Timezone', chooseTimezone:'Choose a timezone', addTimezone:'Add a timezone', closeTimezoneList:'Close timezone list', add:'Add', startTime:'Start time', endTime:'End time', label:'Label', labelPlaceholder:'What is this time for?', planType:'Plan type', repeatEvent:'Repeat event', date:'Date', today:'Today', tomorrow:'Tomorrow', customDate:'Custom date', repeatOn:'Repeat on', dayOfMonth:'Day of month', month:'Month', day:'Day', manageTimezones:'Manage saved timezones', remove:'Remove', hardStop:'Hard stop', hardStopHelp:'Protect this time from overrun', cancel:'Cancel', save:'Save', chooseTimezoneToAdd:'Choose a timezone to add', customEventDate:'Custom event date', closeModal:'Close modal', untitledPlan:'Untitled plan', types:{meeting:'Meeting',event:'Event','sync-up':'Sync-up','stand-up':'Stand-up'}, repeats:{none:'Does not repeat',daily:'Daily',weekdays:'Weekdays',weekends:'Weekends',weekly:'Weekly',monthly:'Monthly',annual:'Annual'}, categories:{low:'low',moderate:'moderate',high:'high','very high':'very high',extreme:'extreme'},
};

const overrides: Partial<Record<LocaleId, Partial<UiCopy>>> = {
  hi:{theme:'थीम',free:'मुफ़्त',pro:'प्रो',chooseTheme:'थीम चुनें',language:'भाषा',showingTime:(city)=>`${city} का समय`,sunrise:'सूर्योदय',sunset:'सूर्यास्त',plannedEvents:'नियोजित कार्यक्रम',previousDay:'पिछला दिन',nextDay:'अगला दिन',addPlan:'नई योजना जोड़ें',newMoment:'नया क्षण',addToDay:'अपने दिन में जोड़ें',timezone:'समय क्षेत्र',chooseTimezone:'समय क्षेत्र चुनें',addTimezone:'समय क्षेत्र जोड़ें',startTime:'आरंभ समय',endTime:'समाप्ति समय',label:'लेबल',planType:'योजना प्रकार',repeatEvent:'दोहराएँ',date:'तारीख',today:'आज',tomorrow:'कल',customDate:'कस्टम तारीख',hardStop:'हार्ड स्टॉप',cancel:'रद्द करें',save:'सहेजें'},
  es:{theme:'Tema',free:'Gratis',pro:'Pro',chooseTheme:'Elegir tema',language:'Idioma',showingTime:(city)=>`Hora de ${city}`,sunrise:'Amanecer',sunset:'Atardecer',plannedEvents:'Eventos previstos',previousDay:'Día anterior',nextDay:'Día siguiente',addPlan:'Añadir un plan',newMoment:'Nuevo momento',addToDay:'Añadir a tu día',timezone:'Zona horaria',chooseTimezone:'Elegir una zona horaria',addTimezone:'Añadir zona horaria',startTime:'Hora de inicio',endTime:'Hora de fin',label:'Etiqueta',planType:'Tipo de plan',repeatEvent:'Repetición',date:'Fecha',today:'Hoy',tomorrow:'Mañana',customDate:'Fecha personalizada',hardStop:'Límite estricto',cancel:'Cancelar',save:'Guardar'},
  fr:{theme:'Thème',free:'Gratuit',pro:'Pro',chooseTheme:'Choisir un thème',language:'Langue',showingTime:(city)=>`Heure de ${city}`,sunrise:'Lever du soleil',sunset:'Coucher du soleil',plannedEvents:'Événements planifiés',previousDay:'Jour précédent',nextDay:'Jour suivant',addPlan:'Ajouter un plan',newMoment:'Nouveau moment',addToDay:'Ajouter à votre journée',timezone:'Fuseau horaire',chooseTimezone:'Choisir un fuseau horaire',addTimezone:'Ajouter un fuseau',startTime:'Début',endTime:'Fin',label:'Libellé',planType:'Type de plan',repeatEvent:'Répétition',date:'Date',today:"Aujourd’hui",tomorrow:'Demain',customDate:'Date personnalisée',hardStop:'Arrêt strict',cancel:'Annuler',save:'Enregistrer'},
  de:{theme:'Thema',free:'Kostenlos',pro:'Pro',chooseTheme:'Thema wählen',language:'Sprache',showingTime:(city)=>`Zeit in ${city}`,sunrise:'Sonnenaufgang',sunset:'Sonnenuntergang',plannedEvents:'Geplante Ereignisse',previousDay:'Vorheriger Tag',nextDay:'Nächster Tag',addPlan:'Plan hinzufügen',newMoment:'Neuer Moment',addToDay:'Zum Tag hinzufügen',timezone:'Zeitzone',chooseTimezone:'Zeitzone wählen',addTimezone:'Zeitzone hinzufügen',startTime:'Startzeit',endTime:'Endzeit',label:'Bezeichnung',planType:'Plantyp',repeatEvent:'Wiederholen',date:'Datum',today:'Heute',tomorrow:'Morgen',customDate:'Benutzerdefiniertes Datum',hardStop:'Harter Stopp',cancel:'Abbrechen',save:'Speichern'},
  pt:{theme:'Tema',free:'Grátis',pro:'Pro',chooseTheme:'Escolher tema',language:'Idioma',showingTime:(city)=>`Hora de ${city}`,sunrise:'Nascer do sol',sunset:'Pôr do sol',plannedEvents:'Eventos planejados',previousDay:'Dia anterior',nextDay:'Próximo dia',addPlan:'Adicionar plano',newMoment:'Novo momento',addToDay:'Adicionar ao seu dia',timezone:'Fuso horário',chooseTimezone:'Escolher fuso horário',addTimezone:'Adicionar fuso horário',startTime:'Início',endTime:'Fim',label:'Rótulo',planType:'Tipo de plano',repeatEvent:'Repetição',date:'Data',today:'Hoje',tomorrow:'Amanhã',customDate:'Data personalizada',hardStop:'Parada rígida',cancel:'Cancelar',save:'Salvar'},
  ja:{theme:'テーマ',free:'無料',pro:'Pro',chooseTheme:'テーマを選択',language:'言語',showingTime:(city)=>`${city}の時刻`,sunrise:'日の出',sunset:'日の入り',plannedEvents:'予定',previousDay:'前の日',nextDay:'次の日',addPlan:'予定を追加',newMoment:'新しい時間',addToDay:'一日に追加',timezone:'タイムゾーン',chooseTimezone:'タイムゾーンを選択',addTimezone:'タイムゾーンを追加',startTime:'開始時刻',endTime:'終了時刻',label:'ラベル',planType:'予定の種類',repeatEvent:'繰り返し',date:'日付',today:'今日',tomorrow:'明日',customDate:'カスタム日付',hardStop:'ハードストップ',cancel:'キャンセル',save:'保存'},
  ko:{theme:'테마',free:'무료',pro:'Pro',chooseTheme:'테마 선택',language:'언어',showingTime:(city)=>`${city} 시간`,sunrise:'일출',sunset:'일몰',plannedEvents:'예정된 이벤트',previousDay:'이전 날짜',nextDay:'다음 날짜',addPlan:'계획 추가',newMoment:'새 순간',addToDay:'하루에 추가',timezone:'시간대',chooseTimezone:'시간대 선택',addTimezone:'시간대 추가',startTime:'시작 시간',endTime:'종료 시간',label:'라벨',planType:'계획 유형',repeatEvent:'반복',date:'날짜',today:'오늘',tomorrow:'내일',customDate:'사용자 지정 날짜',hardStop:'하드 스톱',cancel:'취소',save:'저장'},
  zh:{theme:'主题',free:'免费',pro:'Pro',chooseTheme:'选择主题',language:'语言',showingTime:(city)=>`显示${city}时间`,sunrise:'日出',sunset:'日落',plannedEvents:'计划事件',previousDay:'前一天',nextDay:'后一天',addPlan:'添加计划',newMoment:'新时刻',addToDay:'添加到今天',timezone:'时区',chooseTimezone:'选择时区',addTimezone:'添加时区',startTime:'开始时间',endTime:'结束时间',label:'标签',planType:'计划类型',repeatEvent:'重复',date:'日期',today:'今天',tomorrow:'明天',customDate:'自定义日期',hardStop:'硬停止',cancel:'取消',save:'保存'},
  ar:{theme:'المظهر',free:'مجاني',pro:'Pro',chooseTheme:'اختر مظهراً',language:'اللغة',showingTime:(city)=>`توقيت ${city}`,sunrise:'شروق الشمس',sunset:'غروب الشمس',plannedEvents:'الأحداث المخطط لها',previousDay:'اليوم السابق',nextDay:'اليوم التالي',addPlan:'إضافة خطة',newMoment:'لحظة جديدة',addToDay:'أضف إلى يومك',timezone:'المنطقة الزمنية',chooseTimezone:'اختر منطقة زمنية',addTimezone:'إضافة منطقة زمنية',startTime:'وقت البدء',endTime:'وقت الانتهاء',label:'التسمية',planType:'نوع الخطة',repeatEvent:'التكرار',date:'التاريخ',today:'اليوم',tomorrow:'غداً',customDate:'تاريخ مخصص',hardStop:'توقف صارم',cancel:'إلغاء',save:'حفظ'},
};

export function copy(locale: LocaleId): UiCopy {
  return { ...english, ...overrides[locale] };
}
