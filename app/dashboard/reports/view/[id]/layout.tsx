import React from 'react';

// Layout ini hanya berfungsi sebagai "pembungkus" bersih tanpa elemen lain
// seperti sidebar atau header dashboard.
export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
