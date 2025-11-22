import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

window.Pusher = Pusher;

// If the Vite env doesn't provide a REVERB key, don't attempt to instantiate Echo/Pusher
const REVERB_KEY = import.meta.env.VITE_REVERB_APP_KEY as string | undefined;

let echo: any;
if (!REVERB_KEY) {
    // Provide a tiny no-op fallback so imports of `echo` won't crash when broadcasting isn't configured.
    console.warn('Reverb/Echo not configured: VITE_REVERB_APP_KEY is missing. Broadcasting is disabled.');

    echo = {
        channel: () => ({ listen: () => ({}) }),
        private: () => ({ listen: () => ({}) }),
        join: () => ({ listen: () => ({}) }),
        leave: () => {},
        disconnect: () => {},
    } as unknown;
} else {
    //test environment
    const options = {
        broadcaster: 'reverb',
        key: REVERB_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss']
    }
    console.log('options', options);

    echo = new Echo({
        broadcaster: 'reverb',
        key: REVERB_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss']
    });
}

export default echo;
