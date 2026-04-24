"use client";

import React, { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Bell, 
  Save, 
  RefreshCw,
  Server,
  Activity,
  User as UserIcon,
  Mail,
  Shield,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThresholdSlider } from "@/components/ui/ThresholdSlider";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, displayName, email, roleLabel, avatarUrl } = useCurrentUser();
  const [threshold, setThreshold] = useState(0.5);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api/v1");

  const handleSave = () => {
    toast.success("Forensic parameters updated successfully.");
  };

  const sections = [
    { id: "account", label: "Profile", icon: UserIcon },
    { id: "api", label: "Engine", icon: Server },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
  ];

  const [activeSection, setActiveSection] = useState("account");

  return (
    <div className="flex flex-col gap-10">
      <header>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
        >
          SYSTEM PREFERENCES
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black tracking-tighter text-white sm:text-5xl"
        >
          CONFIG <span className="text-primary">PROTOCOL</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        {/* Nav */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest transition-all",
                activeSection === section.id
                  ? "bg-primary text-background-dark glow-primary"
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <section.icon size={20} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-white/5 bg-white/2 backdrop-blur-3xl p-10"
          >
            {activeSection === "account" && (
              <div className="space-y-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="relative">
                    <div className="h-32 w-32 overflow-hidden rounded-[2.5rem] border-2 border-primary/20 bg-zinc-800 p-1">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="h-full w-full rounded-[2.2rem] object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-[2.2rem] bg-zinc-900 text-4xl font-black text-primary">
                          {displayName[0]}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-background-dark glow-primary">
                      <UserIcon size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{displayName}</h3>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">{roleLabel}</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
                        <Mail size={14} /> {email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">
                        <Shield size={14} /> Verified Account
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <Input value={displayName} readOnly icon={<UserIcon size={18} />} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                    <Input value={email} readOnly icon={<Mail size={18} />} />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Account Created</h4>
                      <p className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-widest">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "api" && (
              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">INFERENCE ENGINE</h3>
                  <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Manage your backend API and model thresholds.</p>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Endpoint URI</label>
                    <Input 
                      value={apiUrl} 
                      onChange={(e) => setApiUrl(e.target.value)} 
                      icon={<Server size={18} />}
                    />
                    <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">Points to the FastAPI forensic service.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Engine Health</label>
                    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success glow-success">
                        <Activity size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">System Online</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">v2.0.0-FORENSIC</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Default Forensic Sensitivity</h4>
                    <p className="text-xs font-medium text-zinc-500 mb-6 uppercase tracking-widest">Sets the baseline threshold for all new media scans.</p>
                    <ThresholdSlider value={threshold} onChange={setThreshold} className="max-w-xl" />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 text-zinc-400">
                    <RefreshCw size={18} className="mr-2" /> REVERT
                  </Button>
                  <Button className="rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary" onClick={handleSave}>
                    <Save size={18} className="mr-2" /> COMMIT CHANGES
                  </Button>
                </div>
              </div>
            )}

            {activeSection !== "api" && activeSection !== "account" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 text-zinc-800">
                  <Zap size={40} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">ENCRYPTED MODULE</h3>
                <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">This section is restricted to higher clearance levels.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
