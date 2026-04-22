import { redirect } from 'next/navigation';

// Sidebar's "Content" category header targets /admin/content. Redirect to the
// first child (blog) so a direct click doesn't 404.
export default function ContentIndex() {
  redirect('/admin/content/blog');
}
