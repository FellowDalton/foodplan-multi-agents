export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Foodplan
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">
          Family Meal Planning
        </p>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track deals from Danish supermarkets and plan your family meals efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}
