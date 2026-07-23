import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';
import './admin.css';

export const metadata: Metadata = {
    title: 'Blog Admin — NextCharge',
    robots: 'noindex, nofollow',
};

export default function AdminPage() {
    return <AdminDashboard />;
}
