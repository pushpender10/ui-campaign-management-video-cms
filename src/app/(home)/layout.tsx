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
        <main className="mx-auto">
          {children}
        </main>
        <PortalFooter />
      </>
  );
}
