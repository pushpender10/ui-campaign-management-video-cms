import {
  CalendarCog,
  ChartArea,
  LayoutDashboard,
  Settings,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const navigationItems = [
  {
    title: "Dashboard",
    url: "/portal", //createPageUrl("Portal"),
    icon: LayoutDashboard,
  },
  { title: "Campaigns Management", url: "/campaigns", icon: CalendarCog },
  {
    title: "Create Video",
    url: "/upload", //createPageUrl("Upload"),
    icon: Upload,
  },
  { title: "Analytics", url: "/analytics", icon: ChartArea },
  //   { title: "Profile", url: "/settings", icon: Settings },
];

// export const UserProfileButton = () => {
//   const router = useRouter();

//   return (
//     <Button
//       variant={"link"}
//       onClick={() => router.push("/settings")}
//       // className="text-gray-700 text-center hover:text-indigo-600 font-medium"
//     >
//       Profile
//     </Button>
//   );
// };
