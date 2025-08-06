import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'>
            {/* Equipment rack/console base */}
            <rect x='2' y='30' width='36' height='8' rx='2' fill='currentColor' opacity='0.8' />

            {/* Main equipment tower */}
            <rect x='6' y='8' width='28' height='24' rx='3' fill='currentColor' opacity='0.9' />

            {/* Equipment slots/panels */}
            <rect x='9' y='12' width='22' height='2' rx='1' fill='currentColor' opacity='0.4' />
            <rect x='9' y='16' width='22' height='2' rx='1' fill='currentColor' opacity='0.4' />
            <rect x='9' y='20' width='22' height='2' rx='1' fill='currentColor' opacity='0.4' />
            <rect x='9' y='24' width='22' height='2' rx='1' fill='currentColor' opacity='0.4' />

            {/* Control indicators/LEDs */}
            <circle cx='12' cy='13' r='1' fill='currentColor' opacity='0.6' />
            <circle cx='16' cy='13' r='1' fill='currentColor' opacity='0.6' />
            <circle cx='20' cy='13' r='1' fill='currentColor' opacity='0.6' />

            {/* Broadcast antenna/signal */}
            <path d='M20 2 L20 8 M16 4 L24 4 M14 6 L26 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' opacity='0.7' />

            {/* Signal waves */}
            <path d='M12 10 Q20 6 28 10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' fill='none' opacity='0.5' />
            <path d='M10 12 Q20 8 30 12' stroke='currentColor' strokeWidth='1' strokeLinecap='round' fill='none' opacity='0.3' />
        </svg>
    );
}
