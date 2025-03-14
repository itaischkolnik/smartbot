import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WizardContainerProps {
  children: ReactNode;
  isActive: boolean;
  direction: number;
}

export default function WizardContainer({ children, isActive, direction }: WizardContainerProps) {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4
      }
    })
  };

  return (
    <div className="relative w-full">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {isActive && (
          <motion.div
            className="w-full"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 