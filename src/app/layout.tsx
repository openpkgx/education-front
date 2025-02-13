import type { Metadata } from "next";
import "./globals.css";
import { GlobalProvider } from "@/components/global-context";
import { NotificationProvider } from "@/components/notification";
import { Suspense } from "react";
import Spinner from "@/components/spinner";

export const metadata: Metadata = {
  title: "四海学堂",
  description: "www.sihaixuetang.com",
  icons: {
    icon: '/book.png', // /public path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body monica-locale="zh_CN">
        <GlobalProvider>
          <NotificationProvider>
            <Suspense fallback={<div> <Spinner></Spinner> </div>}>
              <div className="bg-white text-gray-950">
                {children}
              </div>
            </Suspense>
          </NotificationProvider>
        </GlobalProvider>
      </body>
    </html>

  );
}
