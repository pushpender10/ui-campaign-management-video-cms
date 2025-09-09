import PortalFooter from "@/components/PortalFooter";
import PortalHeader from "@/components/PortalHeader";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PortalHeader />
      <div className="mx-auto">{children}</div>
      <PortalFooter />
    </>
  );
}
