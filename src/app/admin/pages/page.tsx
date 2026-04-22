import { redirect } from 'next/navigation';

// Sidebar's "Pages" category header targets /admin/pages. Redirect to the
// first child (home) so a direct click doesn't 404.
export default function PagesIndex() {
  redirect('/admin/pages/home');
}
