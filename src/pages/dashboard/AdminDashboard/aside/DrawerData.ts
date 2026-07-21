// aside/DrawerData.ts
import { 
  AiOutlineDashboard, 
  AiOutlineUser, 
  AiOutlineTool, 
  AiOutlineBook, 
  AiOutlineWallet, 
  AiOutlineFileText,
  AiOutlineSetting
} from "react-icons/ai";

export type DrawerData = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
};

export const adminDrawerData: DrawerData[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: AiOutlineDashboard,
    link: "",
  },
  {
    id: "users",
    label: "Users",
    icon: AiOutlineUser,
    link: "users",
  },
  {
    id: "fundis",
    label: "Fundis",
    icon: AiOutlineTool,
    link: "fundis",
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: AiOutlineBook,
    link: "bookings",
  },
  {
    id: "payments",
    label: "Payments",
    icon: AiOutlineWallet,
    link: "payments",
  },
  {
    id: "reports",
    label: "Reports",
    icon: AiOutlineFileText,
    link: "reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: AiOutlineSetting,
    link: "settings",
  },
];