import { useState, useEffect, Fragment } from "react";
import { useMatches, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/app-sidebar";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false); // 2. State untuk scroll
  const matches = useMatches();
  const navigate = useNavigate();
  const location = useLocation();

  // 3. Logic untuk mendeteksi posisi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const breadcrumbs = matches
    .filter((match) => (match.handle as any)?.breadcrumb)
    .map((match) => ({
      label: (match.handle as any).breadcrumb as string,
      href: match.pathname,
    }));

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Toaster richColors position="top-right" closeButton theme="light" />

        {/* HEADER DENGAN KONDISI SCROLL */}
        <header
          className={`sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-in-out ${
            isScrolled
              ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
              : "bg-transparent border-transparent"
          }`}
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <Fragment key={item.href}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => navigate(item.href)}
                          className="cursor-pointer"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {/* Separator diletakkan DI LUAR BreadcrumbItem */}
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col w-full">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <AnimatePresence mode="wait">
                <motion.main
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="px-4 lg:px-6 w-full"
                >
                  {children}
                </motion.main>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
