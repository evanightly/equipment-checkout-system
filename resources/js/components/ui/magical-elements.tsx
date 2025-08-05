'use client';

import { cn } from '@/lib/utils';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect } from 'react';

interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    amplitude?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({ children, className, delay = 0, duration = 6, amplitude = 20 }) => {
    const y = useMotionValue(0);
    const rotate = useMotionValue(0);

    useEffect(() => {
        const controls = animate(y, [0, -amplitude, 0], {
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
        });

        const rotateControls = animate(rotate, [0, 360], {
            duration: duration * 3,
            repeat: Infinity,
            ease: 'linear',
            delay,
        });

        return () => {
            controls.stop();
            rotateControls.stop();
        };
    }, [y, rotate, duration, delay, amplitude]);

    return (
        <motion.div
            className={cn('absolute', className)}
            style={{
                y,
                rotate,
            }}
        >
            {children}
        </motion.div>
    );
};

interface OrbitingElementProps {
    children: React.ReactNode;
    radius?: number;
    duration?: number;
    delay?: number;
    reverse?: boolean;
    className?: string;
}

export const OrbitingElement: React.FC<OrbitingElementProps> = ({ children, radius = 100, duration = 10, delay = 0, reverse = false, className }) => {
    const angle = useMotionValue(0);
    const x = useTransform(angle, (value) => Math.cos(value) * radius);
    const y = useTransform(angle, (value) => Math.sin(value) * radius);

    useEffect(() => {
        const controls = animate(angle, reverse ? [-Math.PI * 2, 0] : [0, Math.PI * 2], {
            duration,
            repeat: Infinity,
            ease: 'linear',
            delay,
        });

        return () => controls.stop();
    }, [angle, duration, delay, reverse]);

    return (
        <motion.div
            className={cn('absolute', className)}
            style={{
                x,
                y,
            }}
        >
            {children}
        </motion.div>
    );
};

interface PulsingElementProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    scaleRange?: [number, number];
}

export const PulsingElement: React.FC<PulsingElementProps> = ({ children, className, delay = 0, duration = 2, scaleRange = [1, 1.2] }) => {
    return (
        <motion.div
            className={cn('absolute', className)}
            animate={{
                scale: scaleRange,
            }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};

interface GlowingOrbProps {
    size?: number;
    color?: string;
    intensity?: number;
    className?: string;
}

export const GlowingOrb: React.FC<GlowingOrbProps> = ({ size = 20, color = '#9E7AFF', intensity = 0.8, className }) => {
    return (
        <div
            className={cn('rounded-full', className)}
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color}${Math.floor(intensity * 255).toString(16)} 0%, transparent 70%)`,
                boxShadow: `0 0 ${size}px ${color}${Math.floor(intensity * 128).toString(16)}`,
            }}
        />
    );
};
