export default function Loading() {
  return (
    <div className="px-4 pb-24 pt-24">
      <div className="mx-auto max-w-5xl animate-pulse space-y-4">
        <div className="h-32 rounded-3xl bg-[#E8F5E0]" />
        <div className="h-28 rounded-3xl bg-white" />
        <div className="h-6 w-28 rounded-full bg-[#E8F5E0]" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-[#D4EBC5]" />
              <div className="h-5 flex-1 rounded-full bg-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
