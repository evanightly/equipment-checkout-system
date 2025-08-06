import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LoaderCircle, Mail, User } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { ThemeToggle } from '@/components/theme-toggle';
import { AnimatedLoginButton } from '@/components/ui/animated-login-button';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FloatingElement, GlowingOrb, OrbitingElement, PulsingElement } from '@/components/ui/magical-elements';
import { Meteors } from '@/components/ui/meteors';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { Particles } from '@/components/ui/particles';
import { ShineBorder } from '@/components/ui/shine-border';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title='Register' />
            <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900'>
                {/* Theme Toggle in corner */}
                <div className='absolute top-4 right-4 z-50'>
                    <ThemeToggle />
                </div>

                {/* Multi-layer Background Effects */}
                <Particles
                    className='absolute inset-0 z-0'
                    color={isDarkMode ? '#ffffff' : '#8b5cf6'}
                    ease={80}
                    quantity={200}
                    size={1.2}
                    staticity={30}
                />

                {/* Meteors shower */}
                <Meteors maxDelay={2} maxDuration={8} minDelay={0.1} minDuration={3} number={50} />

                {/* Floating Elements */}
                <FloatingElement className='absolute top-20 left-20 text-purple-400 opacity-60' duration={8}>
                    ✨
                </FloatingElement>
                <FloatingElement className='absolute top-40 right-32 text-blue-400 opacity-50' duration={6}>
                    🌟
                </FloatingElement>
                <FloatingElement className='absolute bottom-40 left-32 text-pink-400 opacity-70' duration={10}>
                    💫
                </FloatingElement>
                <FloatingElement className='absolute right-20 bottom-20 text-yellow-400 opacity-60' duration={7}>
                    ⭐
                </FloatingElement>

                {/* Orbiting Elements around the center */}
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <OrbitingElement className='text-purple-400 opacity-40' radius={300}>
                        🔮
                    </OrbitingElement>
                    <OrbitingElement className='text-blue-400 opacity-50' delay={2} radius={350}>
                        🌙
                    </OrbitingElement>
                    <OrbitingElement className='text-pink-400 opacity-45' delay={1} radius={280}>
                        💎
                    </OrbitingElement>
                </div>

                {/* Glowing Orbs */}
                <GlowingOrb className='absolute top-32 left-40' color='rgb(147, 51, 234)' intensity={0.6} size={60} />
                <GlowingOrb className='absolute right-40 bottom-32' color='rgb(59, 130, 246)' intensity={0.8} size={45} />
                <GlowingOrb className='absolute top-1/2 left-20' color='rgb(236, 72, 153)' intensity={0.7} size={35} />

                {/* Pulsing Elements */}
                <PulsingElement className='absolute top-64 right-64 text-purple-300 opacity-50' duration={3} scaleRange={[1, 1.5]}>
                    <div className='h-8 w-8 rounded-full bg-purple-500'></div>
                </PulsingElement>
                <PulsingElement className='absolute bottom-64 left-64 text-blue-300 opacity-60' duration={4} scaleRange={[1, 1.3]}>
                    <div className='h-6 w-6 rounded-full bg-blue-500'></div>
                </PulsingElement>

                {/* Main Content */}
                <div className='relative z-10 flex min-h-screen items-center justify-center p-8'>
                    <motion.div
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        className='w-full max-w-md'
                        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                        transition={{
                            duration: 1.2,
                            type: 'spring',
                            stiffness: 100,
                            damping: 15,
                        }}
                    >
                        {/* Neon Card with multiple effects */}
                        <NeonGradientCard
                            borderRadius={20}
                            borderSize={3}
                            className='relative overflow-hidden p-0'
                            neonColors={{
                                firstColor: '#8b5cf6',
                                secondColor: '#3b82f6',
                            }}
                        >
                            {/* Shine Border */}
                            <ShineBorder borderWidth={2} duration={8} shineColor={['#a855f7', '#3b82f6', '#ec4899']} />

                            {/* Border Beam */}
                            <BorderBeam colorFrom='#8b5cf6' colorTo='#3b82f6' duration={10} size={200} />

                            <div className='relative rounded-[16px] p-8 backdrop-blur-sm'>
                                <motion.div
                                    animate={{ y: 0, opacity: 1 }}
                                    className='mb-8 text-center'
                                    initial={{ y: -20, opacity: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                >
                                    <h1 className='mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent'>
                                        Asset Management
                                    </h1>
                                    <p className='text-slate-600 dark:text-slate-300'>Create your account</p>
                                </motion.div>

                                <form className='space-y-6' onSubmit={submit}>
                                    <motion.div
                                        animate={{ x: 0, opacity: 1 }}
                                        initial={{ x: -50, opacity: 0 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                    >
                                        <Label className='mb-2 block text-slate-700 dark:text-slate-200' htmlFor='name'>
                                            Full Name
                                        </Label>
                                        <div className='group relative'>
                                            <Input
                                                autoComplete='name'
                                                autoFocus
                                                className='w-full border-purple-400/30 bg-white/10 pl-10 text-slate-800 placeholder-slate-500 transition-all duration-300 focus:border-purple-400 focus:ring-purple-400/50 dark:bg-black/30 dark:text-white dark:placeholder-slate-400'
                                                disabled={processing}
                                                id='name'
                                                name='name'
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder='Enter your full name'
                                                required
                                                tabIndex={1}
                                                type='text'
                                                value={data.name}
                                            />
                                            <div className='absolute top-1/2 left-3 -translate-y-1/2 transform text-purple-400'>
                                                <User size={18} />
                                            </div>
                                        </div>
                                        <InputError className='mt-2 text-pink-400' message={errors.name} />
                                    </motion.div>

                                    <motion.div
                                        animate={{ x: 0, opacity: 1 }}
                                        initial={{ x: 50, opacity: 0 }}
                                        transition={{ delay: 0.9, duration: 0.6 }}
                                    >
                                        <Label className='mb-2 block text-slate-700 dark:text-slate-200' htmlFor='email'>
                                            Email Address
                                        </Label>
                                        <div className='group relative'>
                                            <Input
                                                autoComplete='email'
                                                className='w-full border-purple-400/30 bg-white/10 pl-10 text-slate-800 placeholder-slate-500 transition-all duration-300 focus:border-purple-400 focus:ring-purple-400/50 dark:bg-black/30 dark:text-white dark:placeholder-slate-400'
                                                disabled={processing}
                                                id='email'
                                                name='email'
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder='your.email@company.com'
                                                required
                                                tabIndex={2}
                                                type='email'
                                                value={data.email}
                                            />
                                            <div className='absolute top-1/2 left-3 -translate-y-1/2 transform text-purple-400'>
                                                <Mail size={18} />
                                            </div>
                                        </div>
                                        <InputError className='mt-2 text-pink-400' message={errors.email} />
                                    </motion.div>

                                    <motion.div
                                        animate={{ x: 0, opacity: 1 }}
                                        initial={{ x: -50, opacity: 0 }}
                                        transition={{ delay: 1.1, duration: 0.6 }}
                                    >
                                        <Label className='mb-2 block text-slate-700 dark:text-slate-200' htmlFor='password'>
                                            Password
                                        </Label>
                                        <div className='group relative'>
                                            <Input
                                                autoComplete='new-password'
                                                className='w-full border-purple-400/30 bg-white/10 pr-10 text-slate-800 placeholder-slate-500 transition-all duration-300 focus:border-purple-400 focus:ring-purple-400/50 dark:bg-black/30 dark:text-white dark:placeholder-slate-400'
                                                disabled={processing}
                                                id='password'
                                                name='password'
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder='Create a strong password'
                                                required
                                                tabIndex={3}
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                            />
                                            <Button
                                                className='absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 text-purple-400 hover:text-purple-300'
                                                onClick={() => setShowPassword(!showPassword)}
                                                size='sm'
                                                type='button'
                                                variant='ghost'
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </Button>
                                        </div>
                                        <InputError className='mt-2 text-pink-400' message={errors.password} />
                                    </motion.div>

                                    <motion.div
                                        animate={{ x: 0, opacity: 1 }}
                                        initial={{ x: 50, opacity: 0 }}
                                        transition={{ delay: 1.3, duration: 0.6 }}
                                    >
                                        <Label className='mb-2 block text-slate-700 dark:text-slate-200' htmlFor='password_confirmation'>
                                            Confirm Password
                                        </Label>
                                        <div className='group relative'>
                                            <Input
                                                autoComplete='new-password'
                                                className='w-full border-purple-400/30 bg-white/10 pr-10 text-slate-800 placeholder-slate-500 transition-all duration-300 focus:border-purple-400 focus:ring-purple-400/50 dark:bg-black/30 dark:text-white dark:placeholder-slate-400'
                                                disabled={processing}
                                                id='password_confirmation'
                                                name='password_confirmation'
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder='Confirm your password'
                                                required
                                                tabIndex={4}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                            />
                                            <Button
                                                className='absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0 text-purple-400 hover:text-purple-300'
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                size='sm'
                                                type='button'
                                                variant='ghost'
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </Button>
                                        </div>
                                        <InputError className='mt-2 text-pink-400' message={errors.password_confirmation} />
                                    </motion.div>

                                    <motion.div
                                        animate={{ scale: 1, opacity: 1 }}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
                                    >
                                        <AnimatedLoginButton
                                            className='w-full'
                                            disabled={processing}
                                            isDarkMode={isDarkMode}
                                            isLoading={processing}
                                            tabIndex={5}
                                            type='submit'
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </AnimatedLoginButton>
                                    </motion.div>

                                    <motion.div
                                        animate={{ opacity: 1 }}
                                        className='space-y-2 text-center'
                                        initial={{ opacity: 0 }}
                                        transition={{ delay: 1.7, duration: 0.6 }}
                                    >
                                        <div className='text-sm text-slate-600 dark:text-slate-300'>
                                            Already have an account?{' '}
                                            <TextLink
                                                className='text-purple-400 transition-colors hover:text-purple-300'
                                                href={route('login')}
                                                tabIndex={6}
                                            >
                                                Sign in
                                            </TextLink>
                                        </div>
                                    </motion.div>
                                </form>
                            </div>
                        </NeonGradientCard>
                    </motion.div>
                </div>

                {/* Additional magical atmosphere */}
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20'></div>
                <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent'></div>
            </div>
        </>
    );
}
