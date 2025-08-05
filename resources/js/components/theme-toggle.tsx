import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <Button
            onClick={toggleTheme}
            size='icon'
            variant='ghost'
            className='h-9 w-9 rounded-full border border-border/50 bg-background/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-accent'
        >
            {theme === 'light' ? <Moon className='h-4 w-4 text-muted-foreground' /> : <Sun className='h-4 w-4 text-muted-foreground' />}
            <span className='sr-only'>Toggle theme</span>
        </Button>
    );
}
