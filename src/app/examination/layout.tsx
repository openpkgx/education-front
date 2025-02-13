import { Suspense } from "react";

export default function ExamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-row overflow-hidden">
      {children}
    </div>
  )
}
