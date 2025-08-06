import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return <TooltipPrimitive.Provider data-slot='tooltip-provider' delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot='tooltip' {...props} />
        </TooltipProvider>
    );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />;
}

const tooltipContentVariants = cva(
    'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground',
                secondary: 'bg-secondary text-secondary-foreground',
                muted: 'bg-muted text-muted-foreground',
                accent: 'bg-accent text-accent-foreground',
                destructive: 'bg-destructive text-destructive-foreground',
                outline: 'bg-transparent text-muted-foreground border border-muted',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const arrowVariants = cva('z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]', {
    variants: {
        variant: {
            default: 'bg-primary fill-primary',
            secondary: 'bg-secondary fill-secondary',
            muted: 'bg-muted fill-muted',
            accent: 'bg-accent fill-accent',
            destructive: 'bg-destructive fill-destructive',
            outline: 'bg-transparent border border-muted text-muted',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

function TooltipContent({
    className,
    sideOffset = 0,
    children,
    variant,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipContentVariants>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                className={cn(tooltipContentVariants({ variant }), className)}
                data-slot='tooltip-content'
                sideOffset={sideOffset}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className={cn(arrowVariants({ variant }))} />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipContent, tooltipContentVariants, TooltipProvider, TooltipTrigger };