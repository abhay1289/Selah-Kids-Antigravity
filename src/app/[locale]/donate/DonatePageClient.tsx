'use client';

import React, { useState, useMemo } from 'react';
import { Music, Video, Globe } from 'lucide-react';
import { DonateHero } from '@/components/donate/DonateHero';
import { DonateCard } from '@/components/donate/DonateCard';
import { DonateImpact } from '@/components/donate/DonateImpact';
import { PageShell } from '@/components/design';
import { useFieldResolver } from '@/lib/page-fields';
import type { PageFieldMap } from '@/lib/cms-server';

const AMOUNTS = [10, 20, 30, 50];

/**
 * Build the three impact tiers from CMS fields, falling back to the
 * hardcoded copy when the admin hasn't edited the row yet. Keeping the
 * assembly inline here (instead of pushing it into DonateImpact) means
 * the icons/colors stay colocated with the page's other presentation
 * decisions while the copy stays editable from the admin.
 */
function useImpacts(fields?: PageFieldMap) {
  const f = useFieldResolver(fields);
  return useMemo(
    () => [
      {
        amount: 10,
        icon: Music,
        title: f('general.impact_1_title', 'Funds one worship song lyric sheet', 'Financia una hoja de letras de adoración'),
        desc: f('general.impact_1_body', 'Your gift underwrites the lyric typography, illustration, and bilingual translation for one original song.', 'Tu donación financia la tipografía, ilustración y traducción bilingüe de una canción original.'),
        color: 'text-selah-orange',
        bg: 'bg-selah-orange/10',
      },
      {
        amount: 20,
        icon: Video,
        title: f('general.impact_2_title', 'Sponsors a minute of animation', 'Patrocina un minuto de animación'),
        desc: f('general.impact_2_body', 'Animation is our most expensive craft. $20/month funds a minute of story-grade 2D animation.', 'La animación es nuestro oficio más costoso. $20/mes financia un minuto de animación 2D de calidad.'),
        color: 'text-selah-blue',
        bg: 'bg-selah-blue/10',
      },
      {
        amount: 30,
        icon: Globe,
        title: f('general.impact_3_title', 'Unlocks a family in a new language', 'Alcanza a una familia en un nuevo idioma'),
        desc: f('general.impact_3_body', 'Bilingual production doubles our cost. Your gift keeps every song and story accessible in English and Spanish.', 'La producción bilingüe duplica el costo. Tu donación mantiene cada canción e historia en inglés y español.'),
        color: 'text-selah-light',
        bg: 'bg-selah-light/10',
      },
    ],
    [f],
  );
}

export default function DonatePageClient({ fields }: { fields?: PageFieldMap }) {
  const [frequency, setFrequency] = useState<'One-Time' | 'Monthly' | 'Annual'>('Monthly');
  const [amount, setAmount] = useState<number>(30);
  const impacts = useImpacts(fields);

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      <DonateHero fields={fields} />
      <DonateCard
        frequency={frequency}
        setFrequency={setFrequency}
        amount={amount}
        setAmount={setAmount}
        amounts={AMOUNTS}
      />
      <DonateImpact impacts={impacts} amount={amount} />
    </PageShell>
  );
}
