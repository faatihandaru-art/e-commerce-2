import React from 'react';
import { SidebarProvider } from '@/components/admin/SidebarContext';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export interface AdminLayoutProps {
    children: React.ReactNode;
    /**
     * Optional. Jika diisi, AdminLayout otomatis merender <Header title={...} />
     * di bagian atas area konten. Jika tidak, masing-masing halaman bebas
     * meletakkan <Header title="..." /> sendiri sebagai child pertama.
     */
    title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-vgs-black-void text-vgs-silver-bright font-sans antialiased selection:bg-vgs-blue-electric selection:text-white">
                <Sidebar />

                {/* Main content area (offset by fixed sidebar on desktop) */}
                <div className="md:pl-[260px] min-h-screen">
                    <main className="min-h-screen flex flex-col">
                        {title && <Header title={title} />}
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;
