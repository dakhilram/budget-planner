import { Plus } from "lucide-react";

export default function FabButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-20 right-6 
        bg-blue-600 text-white rounded-full 
        h-14 w-14 flex items-center justify-center shadow-lg 
        hover:bg-blue-700 active:scale-95 transition-all
      "
    >
      <Plus size={28} />
    </button>
  );
}
