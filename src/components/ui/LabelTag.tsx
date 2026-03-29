export default function LabelTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex mb-4 w-auto">
      <div className="w-1 bg-orange-400"></div>
      <div className="bg-teal-50 px-3 py-1 flex-1">
        <h3 className="font-bold text-teal-700 text-lg">{children}</h3>
      </div>
    </div>
  );
}
