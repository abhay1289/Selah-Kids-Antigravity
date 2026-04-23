import HomeClient from "@/components/home/HomeClient";
import { getPageContent } from "@/lib/cms-server";
import { INITIAL_PAGE_HOME } from "@/data/page-content-home";

export default async function Home() {
  const fields = await getPageContent('home', INITIAL_PAGE_HOME);
  return <HomeClient fields={fields} />;
}
