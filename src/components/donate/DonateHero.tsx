"use client";

import React from 'react';
import { Badge } from '../UI';
import { useFieldResolver } from '../../lib/page-fields';
import type { PageFieldMap } from '../../lib/cms-server';

export const DonateHero = ({ fields }: { fields?: PageFieldMap } = {}) => {
  const f = useFieldResolver(fields);
  return (
    <section className="text-center px-6 mb-12 relative z-10">
      <Badge color="orange" className="mb-8 shadow-sm bg-white border border-selah-orange/20 !text-selah-orange">{f('general.badge', 'MAKE A DIFFERENCE', 'HAZ LA DIFERENCIA')}</Badge>
      <h1 className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        {f('general.title1', 'Support', 'Apoya')} <span className="text-selah-orange">{f('general.title_accent', 'Selah Kids', 'Selah Kids')}</span>
      </h1>
      <p className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        {f(
          'general.desc',
          "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.",
          "Tu generosidad nos ayuda a crear contenido de alta calidad y lleno de fe que enseña a los niños sobre el amor de Dios."
        )}
      </p>
    </section>
  );
};
