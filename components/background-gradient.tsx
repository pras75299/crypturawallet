"use client";

import { motion } from "framer-motion";

export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.5, 1],
          transition: { duration: 5, repeat: Infinity, repeatType: "reverse" },
        }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 opacity-30" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </motion.div>
    </div>
  );
}