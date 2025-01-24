"use client";

import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthCard({
  children,
  title,
  description,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-600 mb-8 text-lg">{description}</p>
      {children}
    </motion.div>
  );
}
