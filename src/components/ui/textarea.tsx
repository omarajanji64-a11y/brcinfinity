import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[160px] w-full rounded-[1rem] border border-white/10 bg-[rgba(12,12,14,0.74)] px-4 py-3 text-base text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ring-offset-background transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-muted-foreground/85 focus-visible:border-[rgba(209,174,117,0.46)] focus-visible:bg-[rgba(14,14,16,0.92)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(209,174,117,0.18)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
