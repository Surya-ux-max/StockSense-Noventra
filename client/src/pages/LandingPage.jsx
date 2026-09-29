import React from 'react';
import { AnnouncementBar } from '../components/landing/AnnouncementBar';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { ReferenceLogos } from '../components/landing/ReferenceLogos';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { CapabilitiesGrid } from '../components/landing/CapabilitiesGrid';
import { InteractivePreview } from '../components/landing/InteractivePreview';
import { ValidationStats } from '../components/landing/ValidationStats';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF5E8] text-slate-900 font-sans selection:bg-[#005CE6]/15 selection:text-[#005CE6]">
      {/* 1. Top Orange Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Navigation Bar with Pill Nav */}
      <LandingNavbar />

      {/* 3. Hero Section with Encircled Keyword, Tilted Floating Cards, and Lime Yellow Theme */}
      <LandingHero />

      {/* 4. Monitored Network Clusters Strip */}
      <ReferenceLogos />

      {/* 5. What? Why? Action? Framework */}
      <WorkflowSection />

      {/* 6. Capabilities Grid */}
      <CapabilitiesGrid />

      {/* 7. Live Decision Engine Sandbox */}
      <InteractivePreview />

      {/* 8. Verified ML Model Certification */}
      <ValidationStats />

      {/* 9. Lime Yellow Themed Footer */}
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
