import type { ReactNode } from "react";
import MuseAppLayout from "@/components/muse/AppLayout";
import "./muse.css";

export default function MuseLayout({ children }: { children: ReactNode }) {
  return (
    <section className="muse-theme">
      <MuseAppLayout>{children}</MuseAppLayout>
    </section>
  );
}
