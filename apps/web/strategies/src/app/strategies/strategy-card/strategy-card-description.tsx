'use client';

import { useState } from 'react';

type StrategyCardDescriptionProps = {
  description: string;
};

export function StrategyCardDescription({ description }: StrategyCardDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      <div
        data-testid="strategy-description"
        className={`space-y-2 text-sm text-muted-foreground [&_p]:leading-relaxed${
          expanded ? '' : ' max-h-24 overflow-hidden'
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <button
        type="button"
        data-testid="read-more-button"
        onClick={() => setExpanded((current) => !current)}
        className="self-start text-sm font-medium text-primary hover:underline"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
}
