// components/game-controls.tsx

"use client"

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type GameControlsProps = {
  onAnswer: (answer: boolean) => void;
  disabled: boolean;
};

export function GameControls({ onAnswer, disabled }: GameControlsProps) {


  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-center space-x-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => {
              console.log("[GameControls] Inline True click. Disabled:", disabled); // Keep log here temporarily if needed
              if (!disabled) onAnswer(true);
            }}
            disabled={disabled}
            type="button" // Add type attribute
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg shadow-md"
            size="lg"
          >
            <Check className="mr-2 h-6 w-6" />
            True
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => {
              console.log("[GameControls] Inline False click. Disabled:", disabled); // Keep log here temporarily if needed
              if (!disabled) onAnswer(false);
            }}
            disabled={disabled}
            type="button" // Add type attribute
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-lg shadow-md"
            size="lg"
          >
            <X className="mr-2 h-6 w-6" />
            False
          </Button>
        </motion.div>
      </div>
    </div>
  );
}