export default function PageWrapper({ children }: { children: any }) {
  return (
    <div className="animate-fadeIn min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
