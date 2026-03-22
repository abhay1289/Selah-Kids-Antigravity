import React from 'react';
import { ParentsHero } from '../../components/parents/ParentsHero';
import { ParentsTrustBadges } from '../../components/parents/ParentsTrustBadges';
import { ParentsAccordion } from '../../components/parents/ParentsAccordion';

export default function ParentsPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-36 md:pt-44 pb-20 relative overflow-hidden">
      {/* Soft Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-selah-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-selah-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <ParentsHero />
      <ParentsTrustBadges />
      <ParentsAccordion />
    </div>
  );
}
