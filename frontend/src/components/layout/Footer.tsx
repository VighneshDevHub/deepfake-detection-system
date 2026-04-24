import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-black/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                DeepFake<span className="text-blue-600">Detect</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-base text-zinc-500 dark:text-zinc-400">
              State-of-the-art deepfake detection powered by EfficientNet-B4. Protecting the truth in a digital world.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400">
                <span className="h-6 w-6 font-bold">GH</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400">
                <span className="h-6 w-6 font-bold">X</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400">
                <span className="h-6 w-6 font-bold">IN</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Mail className="h-6 w-6" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/dashboard" className="text-base text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="#" className="text-base text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {currentYear} DeepFakeDetect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
