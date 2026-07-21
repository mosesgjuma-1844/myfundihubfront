import { APIDomain } from './APIDomain';

export type MenuItem = {
  id: string;
  label: string;
  link: string;
  icon: string;
};

export type UserProfile = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  specialization: string;
  yearsOfExperience: number;
};

export type BookingSummary = {
  id: number;
  serviceType: string;
  location: string;
  county: string;
  townOrEstate: string;
  landmark: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  serviceWindow: string;
  status: string;
  estimatedCost: number;
  customer: {
    id: number;
    name: string;
  } | null;
  assignedTechnician: {
    id: number;
    name: string;
  } | null;
};

export async function apiGet<T>(path: string) {
  const response = await fetch(`${APIDomain}${path}`);
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data as T;
}

export async function apiPost<T>(path: string, payload: unknown) {
  const response = await fetch(`${APIDomain}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data as T;
}

export const iconMapping: Record<string, string> = {
  dashboard: 'AiOutlineDashboard',
  users: 'AiOutlineUser',
  tool: 'AiOutlineTool',
  book: 'AiOutlineBook',
  wallet: 'AiOutlineWallet',
  'file-text': 'AiOutlineFileText',
  setting: 'AiOutlineSetting',
  search: 'AiOutlineSearch',
  bell: 'AiOutlineBell',
  calendar: 'AiOutlineCalendar',
  environment: 'AiOutlineEnvironment',
};
