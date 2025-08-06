import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Camera, CheckCircle, Clock, Headphones, Mic, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { AnimatedLoginButton } from '@/components/ui/animated-login-button';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { FloatingElement, GlowingOrb, OrbitingElement, PulsingElement } from '@/components/ui/magical-elements';
import { Meteors } from '@/components/ui/meteors';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Particles } from '@/components/ui/particles';
import { ShineBorder } from '@/components/ui/shine-border';
import { type WelcomeStats } from '@/services/welcome-api';

interface WelcomePageProps extends SharedData {
    stats: WelcomeStats[];
    equipmentTypes: Array<{
        name: string;
        count: number;
        icon: string;
        status: string;
    }>;
    features: Array<{
        title: string;
        description: string;
        icon: string;
        color: string;
        benefits: string[];
    }>;
}

export default function Welcome() {
    const { auth, stats, equipmentTypes, features } = usePage<WelcomePageProps>().props;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [animatedStats, setAnimatedStats] = useState(stats.map((stat) => ({ ...stat, value: 0 })));

    useEffect(() => {
        // Set initial theme state and listen for theme changes
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        checkDarkMode();

        // Listen for theme changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Animate stats from 0 to actual values
        const timer = setTimeout(() => {
            setAnimatedStats(stats);
        }, 800);

        // Optional: Set up real-time updates for stats (uncomment to enable)
        // const cleanup = WelcomeApiService.setupRealTimeUpdates(
        //     (updatedStats) => {
        //         setAnimatedStats(updatedStats);
        //     },
        //     60000 // Update every 60 seconds
        // );

        return () => {
            clearTimeout(timer);
            // cleanup?.(); // Uncomment if using real-time updates
        };
    }, [stats]);

    // Map icon strings to actual icon components
    const getIconComponent = (iconName: string) => {
        const iconMap: Record<string, any> = {
            Camera,
            Users,
            Activity,
            Shield,
            Mic,
            BarChart3,
            Clock,
            TrendingUp,
            Headphones,
        };
        return iconMap[iconName] || Camera;
    };

    return (
        <>
            <Head title='Welcome - Asset Management System'>
                <link href='https://fonts.bunny.net' rel='preconnect' />
                <link href='https://fonts.bunny.net/css?family=instrument-sans:400,500,600' rel='stylesheet' />
            </Head>

            <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900'>
                {/* Theme Toggle */}
                <div className='absolute top-4 right-4 z-50'>
                    <ThemeToggle />
                </div>

                {/* Multi-layer Background Effects */}
                <Particles
                    className='absolute inset-0 z-0'
                    color={isDarkMode ? '#ffffff' : '#8b5cf6'}
                    ease={80}
                    quantity={150}
                    size={1.2}
                    staticity={30}
                />

                {/* Meteors shower */}
                <Meteors maxDelay={3} maxDuration={10} minDelay={0.5} minDuration={5} number={30} />

                {/* Floating Equipment Icons */}
                <FloatingElement className='absolute top-20 left-20 text-purple-400 opacity-40' duration={12}>
                    <Mic size={24} />
                </FloatingElement>
                <FloatingElement className='absolute top-32 right-32 text-blue-400 opacity-50' duration={8}>
                    <Camera size={20} />
                </FloatingElement>
                <FloatingElement className='absolute bottom-40 left-32 text-cyan-400 opacity-45' duration={15}>
                    <Headphones size={22} />
                </FloatingElement>
                <FloatingElement className='absolute right-20 bottom-20 text-green-400 opacity-40' duration={10}>
                    <Activity size={18} />
                </FloatingElement>

                {/* Orbiting Elements */}
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <OrbitingElement className='text-purple-400 opacity-30' radius={400}>
                        <Shield size={24} />
                    </OrbitingElement>
                    <OrbitingElement className='text-blue-400 opacity-40' delay={2} radius={450}>
                        <BarChart3 size={28} />
                    </OrbitingElement>
                    <OrbitingElement className='text-cyan-400 opacity-35' delay={1} radius={380}>
                        <TrendingUp size={26} />
                    </OrbitingElement>
                </div>

                {/* Glowing Orbs */}
                <GlowingOrb className='absolute top-1/4 left-1/4' color='rgb(147, 51, 234)' intensity={0.6} size={80} />
                <GlowingOrb className='absolute right-1/4 bottom-1/4' color='rgb(59, 130, 246)' intensity={0.8} size={60} />
                <GlowingOrb className='absolute top-3/4 left-1/6' color='rgb(16, 185, 129)' intensity={0.7} size={45} />

                {/* Pulsing Elements */}
                <PulsingElement className='absolute top-1/3 right-1/3 text-purple-300 opacity-50' duration={4} scaleRange={[1, 1.4]}>
                    <div className='h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50'></div>
                </PulsingElement>
                <PulsingElement className='absolute bottom-1/3 left-1/5 text-blue-300 opacity-60' duration={6} scaleRange={[1, 1.3]}>
                    <div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-60'></div>
                </PulsingElement>

                {/* Navigation Header */}
                <motion.header
                    animate={{ opacity: 1, y: 0 }}
                    className='relative z-40 flex items-center justify-between p-6 lg:p-8'
                    initial={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -30 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <h1 className='bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent lg:text-3xl'>
                            Asset Management System
                        </h1>
                        <p className='text-slate-600 dark:text-slate-300'>Broadcast Equipment Management</p>
                    </motion.div>

                    <motion.nav
                        animate={{ opacity: 1, x: 0 }}
                        className='flex items-center gap-4'
                        initial={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {auth.user ? (
                            <AnimatedLoginButton
                                className='px-6 py-2'
                                isDarkMode={isDarkMode}
                                onClick={() => (window.location.href = route('dashboard'))}
                            >
                                <Activity className='mr-2 h-4 w-4' />
                                Dashboard
                            </AnimatedLoginButton>
                        ) : (
                            <div className='flex gap-3'>
                                <Link href={route('login')}>
                                    <Button className='border border-purple-400/30 bg-white/10 text-slate-700 backdrop-blur-sm transition-all duration-300 hover:bg-purple-50 dark:text-slate-200 dark:hover:bg-purple-900/30'>
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <AnimatedLoginButton className='h-9 px-4 py-2 has-[>svg]:px-3' isDarkMode={isDarkMode}>
                                        Get Started
                                    </AnimatedLoginButton>
                                </Link>
                            </div>
                        )}
                    </motion.nav>
                </motion.header>

                {/* Content will be added in next steps */}
                <div className='relative z-30 flex flex-col items-center justify-center px-6 py-12 lg:px-8 lg:py-20'>
                    {/* Hero Section */}
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-20 text-center'
                        initial={{ opacity: 0, y: 50 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <h1 className='mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent lg:text-7xl'>
                            Broadcast Equipment
                            <br />
                            <span className='bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent'>
                                Management System
                            </span>
                        </h1>
                        <p className='mx-auto mb-8 max-w-3xl text-xl text-slate-600 lg:text-2xl dark:text-slate-300'>
                            Streamline your broadcast operations with intelligent asset tracking, user management, and real-time insights. From
                            microphones to cameras, manage every piece of equipment with precision.
                        </p>

                        <motion.div
                            animate={{ opacity: 1, scale: 1 }}
                            className='flex flex-col items-center justify-center gap-4 sm:flex-row'
                            initial={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            {!auth.user && (
                                <Link href={route('register')}>
                                    <AnimatedLoginButton className='h-12 px-8 py-3 text-lg' isDarkMode={isDarkMode}>
                                        <Zap className='mr-2 h-5 w-5' />
                                        Get Started Free
                                    </AnimatedLoginButton>
                                </Link>
                            )}
                            <Link href={auth.user ? route('dashboard') : route('login')}>
                                <Button
                                    className='h-12 border-2 border-purple-400/50 bg-white/10 px-8 py-3 text-lg text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-purple-400 hover:bg-purple-50 dark:text-slate-200 dark:hover:bg-purple-900/30'
                                    variant='outline'
                                >
                                    {auth.user ? 'Go to Dashboard' : 'View Demo'}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-20 w-full max-w-6xl'
                        initial={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <div className='grid grid-cols-2 gap-6 lg:grid-cols-4'>
                            {animatedStats.map((stat, index) => {
                                const IconComponent = getIconComponent(stat.icon);
                                return (
                                    <motion.div
                                        animate={{ opacity: 1, scale: 1 }}
                                        className='group relative'
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        key={stat.label}
                                        transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                                    >
                                        <NeonGradientCard
                                            borderRadius={16}
                                            borderSize={2}
                                            className='overflow-hidden !bg-background p-0 [&>*]:!bg-background'
                                            neonColors={{
                                                firstColor: '#8b5cf6',
                                                secondColor: '#3b82f6',
                                            }}
                                        >
                                            <ShineBorder borderWidth={1} duration={6} shineColor={['#a855f7', '#3b82f6']} />
                                            <div className='relative bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 dark:bg-white/5 dark:group-hover:bg-white/10'>
                                                <IconComponent className='mb-4 h-8 w-8 text-purple-500 dark:text-purple-400' />
                                                <div className='mb-2 text-3xl font-bold text-slate-800 dark:text-white'>
                                                    <NumberTicker value={stat.value} />
                                                    {stat.suffix || ''}
                                                </div>
                                                <div className='text-sm text-slate-600 dark:text-slate-300'>{stat.label}</div>
                                                {stat.trend && <div className='mt-1 text-xs text-green-600 dark:text-green-400'>{stat.trend}</div>}
                                            </div>
                                        </NeonGradientCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-20 w-full max-w-7xl'
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                    >
                        <div className='mb-12 text-center'>
                            <h2 className='mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl'>
                                Powerful Features
                            </h2>
                            <p className='mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-300'>
                                Everything you need to manage your broadcast equipment efficiently and professionally.
                            </p>
                        </div>

                        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                            {features.map((feature, index) => {
                                const IconComponent = getIconComponent(feature.icon);
                                return (
                                    <motion.div
                                        animate={{ opacity: 1, y: 0 }}
                                        className='group relative'
                                        initial={{ opacity: 0, y: 30 }}
                                        key={feature.title}
                                        transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                                    >
                                        <NeonGradientCard
                                            borderRadius={20}
                                            borderSize={2}
                                            className='h-full overflow-hidden bg-background [&>*]:!bg-background'
                                            neonColors={{
                                                firstColor: '#8b5cf6',
                                                secondColor: '#3b82f6',
                                            }}
                                        >
                                            <BorderBeam colorFrom='#8b5cf6' colorTo='#3b82f6' duration={15} size={150} />
                                            <div className='relative h-full bg-white/80 p-8 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 dark:bg-white/5 dark:group-hover:bg-white/10'>
                                                <div
                                                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${feature.color} shadow-lg`}
                                                >
                                                    <IconComponent className='h-8 w-8 text-white' />
                                                </div>
                                                <h3 className='mb-4 text-xl font-bold text-slate-800 dark:text-white'>{feature.title}</h3>
                                                <p className='text-slate-600 dark:text-slate-300'>{feature.description}</p>
                                            </div>
                                        </NeonGradientCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Equipment Types Showcase */}
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-20 w-full max-w-6xl text-center'
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.8, delay: 2.2 }}
                    >
                        <h2 className='mb-8 bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl'>
                            Equipment We Track
                        </h2>
                        <div className='flex flex-wrap items-center justify-center gap-4'>
                            {equipmentTypes.map((type, index) => (
                                <motion.div
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='group'
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    key={type.name}
                                    transition={{ duration: 0.5, delay: 2.4 + index * 0.1 }}
                                >
                                    <div className='relative overflow-hidden rounded-full bg-white/80 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20'>
                                        <ShineBorder borderWidth={1} duration={8} shineColor={['#06b6d4', '#10b981']} />
                                        <div className='relative z-10 flex items-center gap-2'>
                                            <span className='font-medium text-slate-700 dark:text-slate-200'>{type.name}</span>
                                            <span className='rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-800 dark:text-purple-200'>
                                                {type.count}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        className='relative text-center'
                        initial={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8, delay: 2.8 }}
                    >
                        <NeonGradientCard
                            borderRadius={24}
                            borderSize={3}
                            className='overflow-hidden'
                            neonColors={{
                                firstColor: '#8b5cf6',
                                secondColor: '#06b6d4',
                            }}
                        >
                            <BorderBeam colorFrom='#8b5cf6' colorTo='#06b6d4' duration={12} size={200} />
                            <div className='relative bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-12 backdrop-blur-sm dark:from-purple-500/10 dark:to-cyan-500/10'>
                                <h2 className='mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl'>
                                    Ready to Get Started?
                                </h2>
                                <p className='mb-8 text-xl text-slate-600 dark:text-slate-300'>
                                    Join broadcast teams already managing their equipment efficiently with our platform.
                                </p>

                                {!auth.user && (
                                    <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                                        <Link href={route('register')}>
                                            <AnimatedLoginButton className='h-12 px-8 py-3 text-lg' isDarkMode={isDarkMode}>
                                                <CheckCircle className='mr-2 h-5 w-5' />
                                                Start Free Trial
                                            </AnimatedLoginButton>
                                        </Link>
                                        <Link href={route('login')}>
                                            <Button
                                                className='h-12 border-2 border-cyan-400/50 bg-white/10 px-8 py-3 text-lg text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-900/30'
                                                variant='outline'
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {auth.user && (
                                    <Link href={route('dashboard')}>
                                        <AnimatedLoginButton className='h-12 px-8 py-3 text-lg' isDarkMode={isDarkMode}>
                                            <Activity className='mr-2 h-5 w-5' />
                                            Go to Dashboard
                                        </AnimatedLoginButton>
                                    </Link>
                                )}
                            </div>
                        </NeonGradientCard>
                    </motion.div>
                </div>

                {/* Additional magical atmosphere */}
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20'></div>
                <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent'></div>
            </div>
        </>
    );
}
