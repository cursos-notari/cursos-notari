'use client';

import { GeistProvider } from "@geist-ui/core";
import type { ReactNode } from "react";

export default function GeistProviderClient({ children }: { children: ReactNode }) {
  return (
    <GeistProvider>
      {children}
    </GeistProvider>
  );
}