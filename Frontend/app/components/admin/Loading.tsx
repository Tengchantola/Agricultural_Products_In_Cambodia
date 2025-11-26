export default function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
