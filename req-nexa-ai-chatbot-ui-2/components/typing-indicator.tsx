"use client"

import { motion } from "framer-motion"

export function TypingIndicator() {
  const dotVariants = {
    hidden: { opacity: 0.4 },
    visible: { opacity: 1 },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        repeatDelay: 1,
      },
    },
  }

  return (
    <div className="flex justify-start">
      <motion.div
        className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full bg-muted-foreground"
            variants={dotVariants}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
