import Link from "next/link";
import logo from "../../public/assets/Agricultural_Market_Price.png";
import Image from "next/image";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center sm:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center md:justify-items-start">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={logo}
                width={50}
                height={50}
                className="rounded-full"
                alt="logo"
              />
              <h3 className="text-lg font-bold">ផលិតផលកសិកម្មនៅកម្ពុជា</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-center md:text-left">
              កម្មវិធីតាមដានតម្លៃផលិតផលកសិកម្មនៅទីផ្សារផ្សេងៗ ដើម្បីជួយដល់កសិករ
              និងអ្នកដើរទិញផលិតផលកសិកម្ម។
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <Link
                href="https://www.facebook.com/profile.php?id=100072511796260&mibextid=LQQJ4d"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook />
              </Link>
              <Link
                href="https://www.youtube.com/@Tengchantola"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Youtube />
              </Link>
              <Link
                href="http://linkedin.com/in/teng-chantola-09b292297"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4">តំណភ្ជាប់រហ័ស</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <Link
                  href="/prices"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  តម្លៃផលិតផល
                </Link>
              </li>
              <li>
                <Link
                  href="/markets"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ទីផ្សារ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ប្រភេទផលិតផល
                </Link>
              </li>
              <li>
                <Link
                  href="/statistics"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ស្ថិតិ
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4">ទំនាក់ទំនង</h4>
            <ul className="space-y-2 text-gray-300 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>ភ្នំពេញ, កម្ពុជា</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+855 16 638 377</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>agricultural@agriprice.gov.kh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-center md:justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-300 text-sm text-center md:text-left">
            © {currentYear} ផលិតផលកសិកម្មនៅកម្ពុជា. រក្សាសិទ្ធិគ្រប់យ៉ាង.
          </p>
          <div className="flex space-x-6 justify-center md:justify-end">
            <Link
              href="/privacy"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              គោលការណ៍ភាពឯកជន
            </Link>
            <Link
              href="/terms"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              លក្ខខណ្ឌសេវាកម្ម
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
