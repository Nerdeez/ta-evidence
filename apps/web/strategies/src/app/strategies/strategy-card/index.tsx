import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@ta/ui/card';
import Image from 'next/image';
import Link from 'next/link';

import { StrategyCardDescription } from './strategy-card-description';
import type { StrategyCardProps } from './types';
import { getEfficacyFromScore, getStrategyHref, verdictClassName } from './utils';

export function StrategyCard({ slug, title, description, image, score }: StrategyCardProps) {
  const { level, verdict } = getEfficacyFromScore(score);
  const href = getStrategyHref(slug);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-border pt-0 shadow-md">
      <Image
        src={image.src}
        alt={image.alt}
        width={400}
        height={225}
        className="aspect-video w-full rounded-t-xl object-cover"
      />
      <CardHeader className="gap-3">
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
        <StrategyCardDescription description={description} />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Efficacy Level:</span>
          <span
            data-testid="efficacy-badge"
            className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold tracking-wide ${verdictClassName[verdict]}`}
          >
            {level}
          </span>
        </div>
      </CardContent>
      <CardFooter className="w-full border-t-0 bg-transparent">
        <Link
          href={href}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View evidence →
        </Link>
      </CardFooter>
    </Card>
  );
}
