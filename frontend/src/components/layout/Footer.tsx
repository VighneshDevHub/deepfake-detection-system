import Link from "next/link";
import { ShieldCheck, Mail, ExternalLink, X, Globe } from "lucide-react";
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
                <ExternalLink size={20} />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <X size={20} />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-primary transition-colors">
                <Globe size={20} />
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
