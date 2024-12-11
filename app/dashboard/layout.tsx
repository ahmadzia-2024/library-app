import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex">
        <div className="w-[15%] mt-20">
          <Sidebar />
        </div>
        <div className="w-[85%] mt-20">{children}</div>
      </main>
    </>
  );
}
