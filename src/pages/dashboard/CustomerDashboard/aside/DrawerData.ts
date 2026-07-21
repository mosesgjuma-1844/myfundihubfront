// aside/DrawerData.ts
import { 
  AiOutlineDashboard, 
  AiOutlineCalendar, 
  AiOutlineBook, 
  AiOutlineEnvironment, 
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

export const drawerData: DrawerData[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: AiOutlineDashboard,
    link: "",
  },
  {
    id: "book-service",
    label: "Book Service",
    icon: AiOutlineCalendar,
    link: "book-service",
  },
  {
    id: "my-bookings",
    label: "My Bookings",
    icon: AiOutlineBook,
    link: "my-bookings",
  },
  {
    id: "nearby-techs",
    label: "Nearby Techs",
    icon: AiOutlineEnvironment,
    link: "nearby-techs",
  },
  {
    id: "payments",
    label: "Payments",
    icon: AiOutlineWallet,
    link: "payments",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: AiOutlineBell,
    link: "notifications",
  },
  {
    id: "settings",
    label: "Settings",
    icon: AiOutlineSetting,
    link: "settings",
  },
];