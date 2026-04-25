import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { Logo } from "../shared/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-background-dark py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 mb-20">
          <div className="col-span-1 lg:col-span-2">
            <Logo />
            <p className="mt-6 max-w-sm text-sm font-medium text-zinc-500 leading-relaxed">
              Industrial-grade forensic layer for digital media verification. 
              Powered by EfficientNet-B4 with 96.8% validated precision.
            </p>
            <div className="mt-8 flex space-x-6">
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <GithubIcon size={20} />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <TwitterIcon size={20} />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <LinkedinIcon size={20} />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-2">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">
                Capabilities
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/detect-image" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    Image Forensics
                  </Link>
                </li>
                <li>
                  <Link href="/detect-video" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    Video Consistency
                  </Link>
                </li>
                <li>
                  <Link href="/detect-audio" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    Audio Synthesis
                  </Link>
                </li>
                <li>
                  <Link href="/detect-text" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    NLP Artifacts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8">
                Platform
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/dashboard" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    Neural Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    SLA Plans
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    API Protocol
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-medium text-zinc-500 transition-colors hover:text-primary">
                    Forensic Whitepaper
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            &copy; {currentYear} DEEPFAKE_CORE // ALL_RIGHTS_RESERVED
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-mono text-zinc-600 hover:text-primary transition-colors uppercase tracking-widest">
              Privacy_Policy
            </Link>
            <Link href="#" className="text-[10px] font-mono text-zinc-600 hover:text-primary transition-colors uppercase tracking-widest">
              Terms_Of_Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
