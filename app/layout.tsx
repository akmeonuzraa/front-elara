import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'elaraMed - Plateforme d\'aide au diagnostic medical',
  description: 'Plateforme pedagogique utilisant l\'intelligence artificielle pour orienter les patients vers la bonne specialite medicale. Projet Data Science - Universite Polytechnique Agadir.',
  keywords: ['maladies rares', 'diagnostic medical', 'intelligence artificielle', 'sante', 'symptomes', 'IRM', 'chatbot medical'],
  authors: [{ name: 'elaraMed Team - Universiapolis' }],
  openGraph: {
    title: 'elaraMed - Intelligence Artificielle au service de la sante',
    description: 'Plateforme pedagogique d\'aide a l\'orientation medicale utilisant des modeles ML et l\'API Claude.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
