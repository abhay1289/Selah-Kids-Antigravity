import type { Metadata } from 'next';
import HomeClient from "@/components/home/HomeClient";
import { getPageContent, getSeoMetadata } from "@/lib/cms-server";
import { INITIAL_PAGE_HOME } from "@/data/page-content-home";
import { isLocale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/', isLocale(locale) ? locale : 'en');
}

export default async function Home() {
  const fields = await getPageContent('home', INITIAL_PAGE_HOME);
  return <HomeClient fields={fields} />;
}
