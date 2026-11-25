export type ApplicantProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  narrative: string;
};

export type Application = {
  id: string;
  grantId: string;
  grantTitle: string;
  status: "Draft" | "Submitted";
  createdAt: string;
  updatedAt: string;
  data: Record<string, string | boolean>;
};

const keys = {
  profile: "nga_vprofile",
  applications: "nga_applications",
  session: "nga_session",
  messages: "nga_messages",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getProfile: () => read<ApplicantProfile | null>(keys.profile, null),
  saveProfile: (profile: ApplicantProfile) => write(keys.profile, profile),
  getApplications: () => read<Application[]>(keys.applications, []),
  saveApplications: (items: Application[]) => write(keys.applications, items),
  getSession: () => read<{ email: string; name: string } | null>(keys.session, null),
  saveSession: (session: { email: string; name: string }) => write(keys.session, session),
  clearSession: () => localStorage.removeItem(keys.session),
  saveMessage: (message: Record<string, string>) => {
    const existing = read<Record<string, string>[]>(keys.messages, []);
    write(keys.messages, [{ ...message, createdAt: new Date().toISOString() }, ...existing]);
  },
};
