import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login | Painel Administrativo',
  description: 'Acesse sua conta para gerenciar o sistema.',
}

const Layout = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default Layout;