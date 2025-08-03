import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '../components/UI/AIAssistant'; // update the path if needed

const Layout = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Floating Chatbot Assistant */}
      <AIAssistant />

      <Footer />
    </div>
  );
};

export default Layout;
