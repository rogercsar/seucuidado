import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-neutral dark:bg-dark-bg border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-poppins font-bold text-dark-text dark:text-white">
              Cuidar.<span className="text-primary">me</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Conectando você ao cuidado certo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-dark-text dark:text-white">Navegação</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-primary dark:text-gray-400">Home</Link></li>
              <li><Link href="/find" className="text-gray-600 hover:text-primary dark:text-gray-400">Encontrar Profissionais</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-primary dark:text-gray-400">Sobre Nós</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark-text dark:text-white">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-600 hover:text-primary dark:text-gray-400">Termos de Serviço</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-primary dark:text-gray-400">Política de Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark-text dark:text-white">Siga-nos</h4>
            {/* Social media icons can be added here */}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Cuidar.me. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
