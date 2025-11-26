import Image from "next/image";
import { teamMembers } from "../data/team-Members";
import Link from "next/link";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-khmer-heading mb-4">
            អំពីពួកយើង
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
            ស្វែងយល់ពីបេសកកម្ម និងវិស័យរបស់យើងក្នុងការជួយសម្រួលដល់សហគមន៍កសិកម្ម
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading mb-4">
              បេសកកម្មរបស់យើង
            </h2>
          </div>
          <div className="prose text-center prose-lg dark:prose-invert max-w-none font-khmer-content">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              យើងខ្ញុំត្រូវបានបង្កើតវេបសាយនេះឡើងដើម្បីជួយដល់កសិករ អ្នកលក់ដុំ
              អ្នកលក់រាយ
              និងអ្នកប្រើប្រាស់ទូទៅក្នុងការតាមដានតម្លៃផលិតផលកសិកម្មនៅទីផ្សារផ្សេងៗនៅក្នុងប្រទេសកម្ពុជា។
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              តារាងតម្លៃរបស់យើងផ្តល់នូវទិន្នន័យអាប់ដេតជាប្រចាំថ្ងៃ
              ដែលអាចជួយអ្នកធ្វើការសម្រេចចិត្តលើការទិញ ការលក់
              និងការវិនិយោគក្នុងវិស័យកសិកម្ម។
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-khmer-heading">
              ភាពអាចទុកចិត្តបាន
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
              ទិន្នន័យតម្លៃរបស់យើងត្រូវបានផ្ទៀងផ្ទាត់ និងអាប់ដេតជាប្រចាំថ្ងៃ
              ដើម្បីធានាបាននូវភាពត្រឹមត្រូវ និងពេលវេលាសមស្រប។
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-khmer-heading">
              ភាពសាមញ្ញ
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
              យើងរចនាកម្មវិធីរបស់យើងឱ្យងាយស្រួលប្រើប្រាស់
              ដើម្បីអោយអ្នកគ្រប់រូបអាចចូលទៅកាន់ទិន្នន័យតម្លៃបានយ៉ាងងាយស្រួល។
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-khmer-heading">
              ការចូលរួមសហគមន៍
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
              យើងជឿជាក់លើការអភិវឌ្ឍសហគមន៍កសិកម្ម
              តាមរយៈការផ្តល់នូវព័ត៌មានដែលអាចទុកចិត្តបានដល់អ្នកពាក់ព័ន្ធទាំងអស់។
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-khmer-heading">
              ការច្នៃប្រឌិត
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
              យើងបន្តអភិវឌ្ឍ និងកែលម្អកម្មវិធីរបស់យើង
              ដើម្បីបំពេញតម្រូវការប្រែប្រួលរបស់សហគមន៍កសិកម្ម។
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8 font-khmer-heading">
            ក្រុមការងាររបស់យើង
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-[130px] h-[130px] mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt="image"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-content">
                  {member.name}
                </h3>
                <p className="text-green-600 dark:text-green-400 mb-2 font-khmer-content">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-khmer-heading">
            ចង់ចូលរួមជាមួយពួកយើង?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-khmer-content">
            ទាក់ទងមកពួកយើងដើម្បីស្វែងយល់ពីរបៀបដែលអ្នកអាចចូលរួមជាមួយសហគមន៍កសិកម្មរបស់យើង។
          </p>
          <Link
            href="https://t.me/Tengchantola"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
          >
            ទាក់ទងពួកយើង
          </Link>
        </div>
      </div>
    </div>
  );
}
