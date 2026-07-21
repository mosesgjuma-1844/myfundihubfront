// aside/DrawerData.ts
import { 
  AiOutlineDashboard, 
  AiOutlineSearch, 
  AiOutlineBook, 
  AiOutlineWallet, 
  AiOutlineBell,
  AiOutlineSetting
} from "react-icons/ai";

export type DrawerData = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
};

export const technicianDrawerData: DrawerData[] = [
  {
    id: "techdashboard",
    label: "Dashboard",
    icon: AiOutlineDashboard,
    link: "",
  },
  {
    id: "techavailablejobs",
    label: "Available Jobs",
    icon: AiOutlineSearch,
    link: "techavailablejobs",
  },
  {
    id: "techmyjobs",
    label: "My Jobs",
    icon: AiOutlineBook,
    link: "techmyjobs",
  },
  {
    id: "techearnings",
    label: "Earnings",
    icon: AiOutlineWallet,
    link: "techearnings",
  },
  {
    id: "technotifications",
    label: "Notifications",
    icon: AiOutlineBell,
    link: "technotifications",
  },
  {
    id: "techsettings",
    label: "Settings",
    icon: AiOutlineSetting,
    link: "techsettings",
  },
];