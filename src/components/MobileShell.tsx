import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Mic, LayoutGrid, Utensils, Settings } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/',        icon: Home,        label: 'Home'    },
  { path: '/habits',  icon: LayoutGrid,  label: 'Habits'  },
  { path: '/coach',   icon: Mic,         label: 'Coach'   },
  { path: '/meals',   icon: Utensils,    label: 'Meals'   },
  { path: '/settings',icon: Settings,    label: 'More'    },
];

export default function MobileShell({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const isOnboarded = user?.onboardingComplete;

  const showNav = isOnboarded &&
    location.pathname !== '/onboarding' &&
    location.pathname !== '/';

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-900">
      {/* Phone frame on large screens */}
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px] bg-dark-900 overflow-hidden flex flex-col shadow-2xl">
        {/* Content area */}
        <div className={clsx('flex-1 overflow-hidden', showNav ? 'pb-20' : '')}>
          {children}
        </div>

        {/* Bottom Navigation */}
        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex items-center justify-around px-2 py-2">
              {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={clsx(
                      'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200',
                      active
                        ? 'text-gold-400'
                        : 'text-dark-300 active:text-dark-100'
                    )}
                  >
                    {path === '/coach' ? (
                      <div className={clsx(
                        'w-12 h-12 rounded-full flex items-center justify-center -mt-6',
                        active
                          ? 'bg-gold-500 glow-gold shadow-lg'
                          : 'bg-dark-700 border border-white/10'
                      )}>
                        <Icon size={22} className={active ? 'text-dark-900' : 'text-dark-200'} />
                      </div>
                    ) : (
                      <>
                        <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
                        <span className={clsx('text-[10px] font-medium', active ? 'text-gold-400' : '')}>
                          {label}
                        </span>
                      </>
                    )}
                    {path === '/coach' && (
                      <span className={clsx('text-[10px] font-medium mt-1', active ? 'text-gold-400' : 'text-dark-300')}>
                        {label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
