import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission & Story | Selah Kids",
  description: "Learn about the purpose, story, and heart behind Selah Kids – a faith-based platform creating Bible songs, Christian cartoons, and worship content for children and families.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
