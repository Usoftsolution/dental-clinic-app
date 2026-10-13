import { t } from './i18n';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let server = '';
let token: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function normalizeServer(input: string) {
  let s = (input || '').trim().replace(/\/+$/, '');
  if (!s) {
    return '';
  }
  if (!/^https?:\/\//i.test(s)) {
    s = 'https://' + s;
  }
  return s;
}

export function configureApi(opts: { server?: string; token?: string | null; onUnauthorized?: () => void }) {
  if (opts.server !== undefined) {
    server = normalizeServer(opts.server);
  }
  if (opts.token !== undefined) {
    token = opts.token;
  }
  if (opts.onUnauthorized !== undefined) {
    onUnauthorized = opts.onUnauthorized;
  }
}

export async function call<T = any>(endpoint: string, body: Record<string, unknown> = {}): Promise<T> {
  if (!server) {
    throw new ApiError(t('network'), 0, 'network');
  }
  let res: Response;
  try {
    res = await fetch(server + '/dental_mobile/api/' + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(t('network'), 0, 'network');
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // an HTML page means the address is not an Odoo with the dental_mobile add-on
    throw new ApiError(t('network'), res.status, 'network');
  }
  if (!res.ok) {
    const err = new ApiError(data?.error || t('network'), res.status, data?.code || 'error');
    if (res.status === 401 && endpoint !== 'login' && onUnauthorized) {
      onUnauthorized();
    }
    throw err;
  }
  return data as T;
}

// ------------------------------------------------------------------ types
export type Money = { value: number; label: string };

export type Me = {
  api: number;
  name: string;
  company: string;
  currency: string;
  doctor: { id: number; name: string; specialty: string; rate: number } | false;
  is_reception: boolean;
  is_manager: boolean;
  show_lab: boolean;
  tz: string;
};

export type DeviceSettings = {
  push: boolean;
  notify_arrived: boolean;
  notify_booking: boolean;
  notify_lab: boolean;
  lang: string;
};

export type ApptRow = {
  id: number;
  ref: string;
  state: string;
  start: string;
  stop: string;
  patient: string;
  patient_id: number;
  procedure: string;
  type: string;
  doctor: string;
  chair: string;
  alert: boolean;
};

export type TodayData = {
  date: string;
  scope: 'mine' | 'all';
  can_see_all: boolean;
  counts: { total: number; waiting: number; in_chair: number; done: number };
  appointments: ApptRow[];
};

export type Card = {
  id: number;
  name: string;
  patient: string;
  patient_id: number;
  state: string;
  state_label: string;
  steps: { key: string; label: string }[];
  moves: string[];
  doctor: string;
  specialty: string;
  chair: string;
  type: string;
  procedure: string;
  phone: string;
  alert: string;
  balance: number;
  balance_label: string;
  start: string;
  stop: string;
  chief_complaint: string;
  last_visit: { date: string; notes: string; plan: string } | false;
  lab_count: number;
};

export type Patient = {
  id: number;
  name: string;
  code: string;
  phone: string;
  age: number | false;
  gender: string | false;
  blood_group: string | false;
  alert: string;
  teeth: string[];
  states: Record<string, string>;
  history: Record<string, { date: string; text: string; status: string; doctor: string }[]>;
  visits: { id: number; date: string; doctor: string; title: string; notes: string; amount: string }[];
  balance: Money;
  invoices: { id: number; name: string; date: string; amount: string; due: string; paid: boolean }[];
  next: ApptRow[];
};

export type SessionData = {
  appointment: ApptRow;
  closed: boolean;
  teeth: string[];
  states: Record<string, string>;
  diagnoses: { id: number; name: string }[];
  procedures: { id: number; name: string; price: number; price_label: string }[];
  lines: { id: number; teeth: string[]; diagnosis: string; procedure: string; note: string; status: string; amount: string }[];
  notes: string;
  total: Money;
};

export type LabOrder = {
  id: number;
  ref: string;
  state: string;
  lab: string;
  work: string;
  teeth: string[];
  shade: string;
  patient: string;
  patient_id: number;
  doctor: string;
  appointment_id: number | false;
  date_sent: string | false;
  date_due: string | false;
  date_received: string | false;
  overdue: boolean;
  warranty_end: string | false;
  warranty_status: string;
  mismatch: string;
  remakes: number;
};

export type Figures = {
  period: string;
  whole_clinic: boolean;
  linked: boolean;
  doctors: string[];
  invoiced: Money;
  collected: Money;
  due: Money;
  my_share: Money | false;
  my_rate: number | null;
  sessions_done: number;
  upcoming: number;
  weeks: { from: string; to: string; value: number }[];
  procedures: { name: string; count: number; amount: number; label: string }[];
};
