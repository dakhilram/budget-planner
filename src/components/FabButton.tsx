import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function FabButton({ onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-24 right-6 bg-black text-white p-4 rounded-full shadow-xl"
      onClick={onClick}
    >
      <Plus size={28} />
    </motion.button>
  );
}
