"use client";

import { Outlet } from 'react-router-dom';
import BottomBar from './BottomBar';
import Sidebar from './Sidebar';
import { motion } from 'motion/react';

export default function Layout() {
  return (
    <div className="relative min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar is hidden on mobile and shown on desktop via its own internal classes */}
        <Sidebar />

        <main className="flex-1 flex flex-col pb-24 lg:pb-0">
          <div className="max-w-5xl mx-auto w-full p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>

        {/* BottomBar is visible only on mobile */}
        <div className="lg:hidden">
          <BottomBar />
        </div>
      </div>
    </div>
  );
}