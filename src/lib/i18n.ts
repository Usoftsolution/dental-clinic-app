// Two languages: English and Arabic (right-to-left). The language is chosen in the app,
// stored on the phone and applied at start-up (switching it restarts the app so the
// whole layout flips).

export type Lang = 'en' | 'ar';

const en = {
  app_name: 'Dental Clinic',
  sign_in_title: 'Sign in with your clinic account',
  clinic_address: 'Clinic address',
  email: 'Email',
  password: 'Password',
  sign_in: 'Sign in',
  sign_in_hint: 'Uses your Odoo user and access rights. Doctors see their own schedule and figures; reception and managers see the whole clinic.',
  twofa_hint: 'Two-factor sign-in on your account? Use an Odoo API key as the password.',
  language: 'Language',
  english: 'English',
  arabic: 'العربية',

  today: 'Today',
  patients: 'Patients',
  lab: 'Lab',
  my_figures: 'My figures',
  good_morning: 'Good morning, {name}',
  good_afternoon: 'Good afternoon, {name}',
  good_evening: 'Good evening, {name}',
  sessions_today: 'sessions',
  waiting: 'waiting',
  in_chair_now: 'in chair',
  done_count: 'done',
  my_patients: 'My patients',
  whole_clinic: 'Whole clinic',
  nothing_today: 'No appointments on this day.',
  previous_day: 'Previous day',
  next_day: 'Next day',
  medical_alert_short: 'Medical alert',

  st_draft: 'Draft',
  st_confirmed: 'Confirmed',
  st_arrived: 'Arrived',
  st_in_chair: 'In Chair',
  st_done: 'Done',
  st_cancelled: 'Cancelled',

  appointment: 'Appointment',
  doctor: 'Doctor',
  time: 'Time',
  chair: 'Chair',
  procedure: 'Procedure',
  phone: 'Phone',
  balance_due: 'Balance due',
  nothing_due: 'Nothing due',
  medical_alert: 'Medical alert',
  call: 'Call',
  whatsapp: 'WhatsApp',
  lab_request: 'Lab request',
  last_visit: 'Last visit · {date}',
  next_plan: 'Plan',
  open_session: 'Open session',
  view_session: 'View session',
  patient_file: 'Patient file',
  set_to: 'Set to {s}',
  status_changed: '{p} is now {s}',

  chart: 'Chart',
  history: 'History',
  invoices: 'Invoices',
  tooth: 'Tooth {n}',
  no_treatment: 'No treatment recorded',
  upper_right: 'Upper right',
  upper_left: 'Upper left',
  lower_right: 'Lower right',
  lower_left: 'Lower left',
  upcoming: 'Next appointments',
  no_visits: 'No completed visits yet.',
  no_invoices: 'No invoices yet.',
  paid: 'Paid',
  not_paid: 'Not paid',
  due_amount: 'Due {a}',
  years: '{n} y',
  file_no: 'File {c}',

  ts_healthy: 'Healthy',
  ts_caries: 'Caries',
  ts_filled: 'Filled',
  ts_rct: 'Root canal',
  ts_crown: 'Crown',
  ts_implant: 'Implant',
  ts_planned: 'Planned',
  ts_missing: 'Missing',

  session: 'Session',
  step_teeth: '1 · Teeth',
  tap_teeth: 'Tap the teeth treated',
  selected: 'Selected: {t}',
  step_diagnosis: '2 · Diagnosis',
  step_procedure: '3 · Procedure',
  search_procedures: 'Search procedures',
  show_all: 'Show all ({n})',
  step_notes: '4 · Notes',
  entry_note: 'Note for this entry (optional)',
  plan_only: 'Planned only (not done today)',
  add_entry: 'Add to case sheet',
  this_session: 'This session',
  session_notes: 'Session notes',
  session_notes_ph: 'Findings, materials, what was done…',
  session_total: 'Session total',
  finish: 'Finish & invoice',
  finish_confirm: 'Close this session and draft the invoice?',
  finished: 'Session closed. Invoice drafted: {amount}',
  closed: 'This session is closed.',
  remove: 'Remove',
  remove_confirm: 'Remove this entry?',
  need_tooth: 'Select at least one tooth.',
  need_choice: 'Choose a diagnosis or a procedure.',
  planned_tag: 'planned',

  lab_title: 'Laboratory',
  tab_at_lab: 'At lab',
  tab_back: 'Back',
  tab_warranty: 'Warranty',
  due_on: 'Due {d}',
  days_late: '{n} days late',
  day_late: '1 day late',
  back_on: 'Back {d} · check against the request',
  warranty_until: 'Warranty until {d}',
  w_active: 'Active',
  w_expiring: 'Ends soon',
  w_expired: 'Expired',
  lab_sent: 'At lab',
  lab_overdue: 'Overdue',
  lab_received: 'Received – OK',
  lab_rejected: 'Not matching',
  lab_delivered: 'Fitted',
  mark_fitted: 'Fitted to patient',
  fitted_confirm: 'Mark this work as fitted? The patient warranty starts today.',
  no_lab: 'Nothing here.',
  new_lab: 'New lab request',
  work_type: 'Work type',
  laboratory: 'Laboratory',
  shade: 'Shade (e.g. A2)',
  instructions: 'Instructions to the lab',
  send_to_lab: 'Send to lab',
  save_draft: 'Save as draft',
  lab_created: 'Lab request {ref} saved',
  need_lab: 'Choose the work type and the laboratory.',
  remakes: 'sent back ×{n}',

  this_month: 'This month',
  last_month: 'Last month',
  this_year: 'This year',
  income_invoiced: 'Income invoiced',
  collected_due: '{c} collected · {d} still due',
  all_collected: 'All collected',
  my_share: 'My share ({r}%)',
  outstanding: 'Outstanding',
  sessions_done: 'Sessions done',
  income_by_week: 'Income by week',
  top_procedures: 'Top procedures',
  clinic_figures: 'Whole clinic',
  not_linked: 'Your user is not linked to a doctor yet. Ask the clinic manager.',
  no_data: 'No figures for this period.',

  settings: 'Settings',
  notifications: 'Notifications',
  notif_arrived: 'Patient arrived',
  notif_booking: 'New appointment',
  notif_lab: 'Lab work back or overdue',
  send_test: 'Send a test notification',
  test_sent: 'Test sent. It should arrive in a few seconds.',
  notif_off: 'Notifications are off for this app. Turn them on in the phone settings.',
  notif_unavailable: 'Notifications work in the installed app on a real phone.',
  signed_in_as: 'Signed in as',
  server: 'Clinic',
  sign_out: 'Sign out',
  sign_out_confirm: 'Sign out of this phone?',
  version: 'Version {v}',
  restart_lang: 'The app restarts to switch language.',

  network: 'Cannot reach the clinic server. Check the address and your internet connection.',
  retry: 'Try again',
  cancel: 'Cancel',
  confirm: 'Confirm',
  ok: 'OK',
  search_patients: 'Name, phone or file number',
  no_patients: 'No patient found.',
  type_to_search: 'Search the clinic patients.',
  back: 'Back',
};

export type Key = keyof typeof en;

const ar: Record<Key, string> = {
  app_name: 'عيادة الأسنان',
  sign_in_title: 'سجّل الدخول بحساب العيادة',
  clinic_address: 'عنوان العيادة',
  email: 'البريد الإلكتروني',
  password: 'كلمة المرور',
  sign_in: 'تسجيل الدخول',
  sign_in_hint: 'يستخدم مستخدم أودو وصلاحياته. يرى الطبيب جدوله وأرقامه فقط، وترى الاستقبال والإدارة العيادة كاملة.',
  twofa_hint: 'هل التحقق بخطوتين مفعّل في حسابك؟ استخدم مفتاح API من أودو بدل كلمة المرور.',
  language: 'اللغة',
  english: 'English',
  arabic: 'العربية',

  today: 'اليوم',
  patients: 'المرضى',
  lab: 'المختبر',
  my_figures: 'أرقامي',
  good_morning: 'صباح الخير، {name}',
  good_afternoon: 'مساء الخير، {name}',
  good_evening: 'مساء الخير، {name}',
  sessions_today: 'جلسات',
  waiting: 'في الانتظار',
  in_chair_now: 'على الكرسي',
  done_count: 'منتهية',
  my_patients: 'مرضاي',
  whole_clinic: 'العيادة كاملة',
  nothing_today: 'لا توجد مواعيد في هذا اليوم.',
  previous_day: 'اليوم السابق',
  next_day: 'اليوم التالي',
  medical_alert_short: 'تنبيه طبي',

  st_draft: 'مسودة',
  st_confirmed: 'مؤكد',
  st_arrived: 'وصل',
  st_in_chair: 'على الكرسي',
  st_done: 'منتهي',
  st_cancelled: 'ملغى',

  appointment: 'الموعد',
  doctor: 'الطبيب',
  time: 'الوقت',
  chair: 'الكرسي',
  procedure: 'الإجراء',
  phone: 'الهاتف',
  balance_due: 'المبلغ المستحق',
  nothing_due: 'لا يوجد مستحق',
  medical_alert: 'تنبيه طبي',
  call: 'اتصال',
  whatsapp: 'واتساب',
  lab_request: 'طلب مختبر',
  last_visit: 'الزيارة السابقة · {date}',
  next_plan: 'الخطة',
  open_session: 'فتح الجلسة',
  view_session: 'عرض الجلسة',
  patient_file: 'ملف المريض',
  set_to: 'تغيير إلى {s}',
  status_changed: 'حالة {p} الآن: {s}',

  chart: 'المخطط',
  history: 'السجل',
  invoices: 'الفواتير',
  tooth: 'السن {n}',
  no_treatment: 'لا يوجد علاج مسجّل',
  upper_right: 'العلوي الأيمن',
  upper_left: 'العلوي الأيسر',
  lower_right: 'السفلي الأيمن',
  lower_left: 'السفلي الأيسر',
  upcoming: 'المواعيد القادمة',
  no_visits: 'لا توجد زيارات منتهية بعد.',
  no_invoices: 'لا توجد فواتير بعد.',
  paid: 'مدفوعة',
  not_paid: 'غير مدفوعة',
  due_amount: 'المتبقي {a}',
  years: '{n} سنة',
  file_no: 'ملف {c}',

  ts_healthy: 'سليم',
  ts_caries: 'تسوس',
  ts_filled: 'حشوة',
  ts_rct: 'علاج عصب',
  ts_crown: 'تاج',
  ts_implant: 'زرعة',
  ts_planned: 'مخطط',
  ts_missing: 'مفقود',

  session: 'الجلسة',
  step_teeth: '١ · الأسنان',
  tap_teeth: 'اضغط على الأسنان المعالجة',
  selected: 'المحدد: {t}',
  step_diagnosis: '٢ · التشخيص',
  step_procedure: '٣ · الإجراء',
  search_procedures: 'ابحث في الإجراءات',
  show_all: 'عرض الكل ({n})',
  step_notes: '٤ · ملاحظات',
  entry_note: 'ملاحظة لهذا الإدخال (اختياري)',
  plan_only: 'مخطط فقط (لم يُنفّذ اليوم)',
  add_entry: 'إضافة إلى ملف الحالة',
  this_session: 'هذه الجلسة',
  session_notes: 'ملاحظات الجلسة',
  session_notes_ph: 'الفحص، المواد، ما تم إنجازه…',
  session_total: 'مجموع الجلسة',
  finish: 'إنهاء وإصدار الفاتورة',
  finish_confirm: 'إغلاق هذه الجلسة وإنشاء مسودة الفاتورة؟',
  finished: 'أُغلقت الجلسة. مسودة الفاتورة: {amount}',
  closed: 'هذه الجلسة مغلقة.',
  remove: 'حذف',
  remove_confirm: 'حذف هذا الإدخال؟',
  need_tooth: 'اختر سناً واحدة على الأقل.',
  need_choice: 'اختر تشخيصاً أو إجراءً.',
  planned_tag: 'مخطط',

  lab_title: 'المختبر',
  tab_at_lab: 'في المختبر',
  tab_back: 'عادت',
  tab_warranty: 'الضمان',
  due_on: 'موعد العودة {d}',
  days_late: 'متأخر {n} يوم',
  day_late: 'متأخر يوماً واحداً',
  back_on: 'عادت {d} · طابقها مع الطلب',
  warranty_until: 'الضمان حتى {d}',
  w_active: 'ساري',
  w_expiring: 'ينتهي قريباً',
  w_expired: 'منتهي',
  lab_sent: 'في المختبر',
  lab_overdue: 'متأخر',
  lab_received: 'استُلم – مطابق',
  lab_rejected: 'غير مطابق',
  lab_delivered: 'رُكّب',
  mark_fitted: 'تم التركيب للمريض',
  fitted_confirm: 'تأكيد تركيب العمل؟ يبدأ ضمان المريض من اليوم.',
  no_lab: 'لا يوجد شيء هنا.',
  new_lab: 'طلب مختبر جديد',
  work_type: 'نوع العمل',
  laboratory: 'المختبر',
  shade: 'اللون (مثال A2)',
  instructions: 'تعليمات للمختبر',
  send_to_lab: 'إرسال إلى المختبر',
  save_draft: 'حفظ كمسودة',
  lab_created: 'تم حفظ طلب المختبر {ref}',
  need_lab: 'اختر نوع العمل والمختبر.',
  remakes: 'أُعيد ×{n}',

  this_month: 'هذا الشهر',
  last_month: 'الشهر الماضي',
  this_year: 'هذه السنة',
  income_invoiced: 'الإيراد المفوتر',
  collected_due: 'المحصّل {c} · المتبقي {d}',
  all_collected: 'تم تحصيل الكل',
  my_share: 'حصتي ({r}%)',
  outstanding: 'غير محصّل',
  sessions_done: 'الجلسات المنتهية',
  income_by_week: 'الإيراد حسب الأسبوع',
  top_procedures: 'أكثر الإجراءات',
  clinic_figures: 'العيادة كاملة',
  not_linked: 'مستخدمك غير مرتبط بطبيب بعد. راجع مدير العيادة.',
  no_data: 'لا توجد أرقام لهذه الفترة.',

  settings: 'الإعدادات',
  notifications: 'الإشعارات',
  notif_arrived: 'وصول المريض',
  notif_booking: 'موعد جديد',
  notif_lab: 'عودة عمل المختبر أو تأخره',
  send_test: 'إرسال إشعار تجريبي',
  test_sent: 'أُرسل الإشعار التجريبي، سيصل خلال ثوانٍ.',
  notif_off: 'الإشعارات متوقفة لهذا التطبيق. فعّلها من إعدادات الهاتف.',
  notif_unavailable: 'تعمل الإشعارات في التطبيق المثبّت على هاتف حقيقي.',
  signed_in_as: 'مسجّل الدخول باسم',
  server: 'العيادة',
  sign_out: 'تسجيل الخروج',
  sign_out_confirm: 'تسجيل الخروج من هذا الهاتف؟',
  version: 'الإصدار {v}',
  restart_lang: 'سيُعاد تشغيل التطبيق لتغيير اللغة.',

  network: 'تعذّر الوصول إلى خادم العيادة. تحقق من العنوان واتصال الإنترنت.',
  retry: 'إعادة المحاولة',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  ok: 'حسناً',
  search_patients: 'الاسم أو الهاتف أو رقم الملف',
  no_patients: 'لم يُعثر على مريض.',
  type_to_search: 'ابحث في مرضى العيادة.',
  back: 'رجوع',
};

const dictionaries: Record<Lang, Record<Key, string>> = { en, ar };

let current: Lang = 'en';

export function setLang(lang: Lang) {
  current = lang;
}

export function getLang(): Lang {
  return current;
}

export function isRTL() {
  return current === 'ar';
}

export function t(key: Key, vars?: Record<string, string | number>): string {
  let s = dictionaries[current][key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split('{' + k + '}').join(String(v));
    }
  }
  return s;
}

export function stateLabel(state: string) {
  return t(('st_' + state) as Key) || state;
}

// ---------------------------------------------------------------- dates
const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
};
const DAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};
const DAYS_SHORT = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ar: DAYS.ar,
};

const sep = () => (current === 'ar' ? '، ' : ', ');
const pad = (n: number) => (n < 10 ? '0' + n : String(n));

export function parseDate(value?: string | false | null): Date | null {
  if (!value) {
    return null;
  }
  // plain dates (YYYY-MM-DD) are calendar days, not instants
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/** Keep numbers, codes and time ranges left-to-right inside Arabic text. */
export function ltr(value: string) {
  // no-break spaces/joiners so a phone number or a time range never wraps in the middle
  const glued = (value || '').replace(/ /g, '\u00a0').replace(/–/g, '\u2060–\u2060');
  return current === 'ar' && glued ? '\u2066' + glued + '\u2069' : glued;
}

export function fmtTime(value?: string | false | null) {
  const d = parseDate(value);
  return d ? pad(d.getHours()) + ':' + pad(d.getMinutes()) : '';
}

export function fmtDate(value?: string | false | null, withYear = true) {
  const d = parseDate(value);
  if (!d) {
    return '';
  }
  const s = d.getDate() + ' ' + MONTHS[current][d.getMonth()];
  return withYear ? s + ' ' + d.getFullYear() : s;
}

export function fmtDayLong(d: Date) {
  return DAYS[current][d.getDay()] + sep() + d.getDate() + ' ' + MONTHS[current][d.getMonth()];
}

export function fmtDayTime(start?: string | false, stop?: string | false) {
  const d = parseDate(start);
  if (!d) {
    return '';
  }
  const day = DAYS_SHORT[current][d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[current][d.getMonth()];
  return day + sep() + ltr(fmtTime(start) + (stop ? '–' + fmtTime(stop) : ''));
}

/** Short label for a date range inside one month: "1–7 Oct" / "1–7/10". */
export function fmtRange(from?: string | false, to?: string | false) {
  const a = parseDate(from);
  const b = parseDate(to);
  if (!a || !b) {
    return '';
  }
  if (current === 'ar') {
    return ltr(a.getDate() + '–' + b.getDate() + '/' + (b.getMonth() + 1));
  }
  return a.getDate() + '–' + b.getDate() + ' ' + MONTHS.en[b.getMonth()];
}

export function isoDay(d: Date) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

export function greeting(name: string) {
  const h = new Date().getHours();
  const key: Key = h < 12 ? 'good_morning' : h < 18 ? 'good_afternoon' : 'good_evening';
  return t(key, { name });
}
