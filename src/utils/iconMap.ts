import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineTool,
  AiOutlineBook,
  AiOutlineWallet,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineCalendar,
  AiOutlineEnvironment,
} from 'react-icons/ai';

export const iconMap = {
  dashboard: AiOutlineDashboard,
  user: AiOutlineUser,
  tool: AiOutlineTool,
  book: AiOutlineBook,
  wallet: AiOutlineWallet,
  'file-text': AiOutlineFileText,
  setting: AiOutlineSetting,
  search: AiOutlineSearch,
  bell: AiOutlineBell,
  calendar: AiOutlineCalendar,
  environment: AiOutlineEnvironment,
} as const;

export type IconKey = keyof typeof iconMap;
