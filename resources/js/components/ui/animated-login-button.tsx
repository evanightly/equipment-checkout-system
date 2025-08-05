'use client';

import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';
import React, { forwardRef } from 'react';

interface AnimatedLoginButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    isDarkMode?: boolean;
}

export const AnimatedLoginButton = forwardRef<HTMLButtonElement, AnimatedLoginButtonProps>(
    ({ children, className, isLoading = false, isDarkMode = false, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(
                    'group relative h-11 w-full overflow-hidden rounded-lg font-medium text-primary-foreground',
                    'transition-all duration-300 ease-out',
                    'focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                }}
                {...props}
            >
                {/* Animated Background Gradient */}
                <motion.div
                    className={cn(
                        'absolute inset-0 bg-gradient-to-r',
                        isDarkMode ? 'from-violet-600 via-purple-600 to-pink-600' : 'from-blue-600 via-purple-600 to-indigo-600',
                    )}
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{
                        backgroundSize: '200% 200%',
                    }}
                />

                {/* Shine effect */}
                <motion.div
                    className='absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0'
                    animate={{
                        x: ['-100%', '100%'],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: 'easeInOut',
                    }}
                />

                {/* Pulse effect on hover */}
                <motion.div
                    className={cn(
                        'absolute inset-0 rounded-lg opacity-0',
                        isDarkMode ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20' : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20',
                    )}
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Button content */}
                <motion.div
                    className='relative z-10 flex h-full items-center justify-center px-6'
                    animate={isLoading ? { opacity: 0.8 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>

                {/* Loading overlay */}
                {isLoading && (
                    <motion.div
                        className='absolute inset-0 rounded-lg bg-black/10'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* Inner glow */}
                <div
                    className='absolute inset-0 rounded-lg shadow-inner'
                    style={{
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)',
                    }}
                />
            </motion.button>
        );
    },
);

AnimatedLoginButton.displayName = 'AnimatedLoginButton';
