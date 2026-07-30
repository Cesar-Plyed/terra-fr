import { useEffect, useState } from 'react';
import { HamburgerButton } from '@components/ui/HamburgerButton';
import { getNavItems } from '@components/modules/Sidebar';

export interface NavbarProps {
  title?: string;
  className?: string;
  lang?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, className = '', lang }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show navbar when:
          // 1. At the top of the page (scrollY < 10)
          // 2. Scrolling up (currentScrollY < lastScrollY)
          if (currentScrollY < 10) {
            setIsVisible(true);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down and past 100px
            setIsVisible(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

    // derive language prefix from current location (client-side)
  const [langPrefix, setLangPrefix] = useState('/es-MX');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/en-GB')) setLangPrefix('/en-GB');
    else if (path.startsWith('/es-MX')) setLangPrefix('/es-MX');
    else setLangPrefix('/es-MX');
  }, []);

  const navItems = getNavItems(langPrefix);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-transform duration-300 ease-in-out h-full ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${className}`}
    >
      <div className="border-b shadow-sm bg-transparent border-none backdrop-blur-sm dark:border-neutral-700">
        <div className="px-4 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-25">
            {/* Logo/Title */}
            <div className="shrink-0">
              <a
                href={lang === 'en-GB' ? '/en-GB/' : '/es-MX/'}
                className="text-2xl font-semibold tracking-tight transition-colors duration-200 text-title hover:text-dark-title border-none"
              >
                {title}
              </a>
            </div>

            <nav>
              <ul className=" items-center gap-2 list-none hidden md:flex">
                {navItems.map((item) => (
                  <li 
                    key={item.href}
                    className="px-3 py-2 transition-colors duration-200 rounded-sm cursor-pointer text-sidebar-text hover:bg-sidebar-item-bg-active hover:text-sidebar-text-active"
                  >
                    <a
                      href={item.href}
                      className="flex items-center gap-3 font-medium focus-ring"
                    >
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hamburger Button */}
            <div className="flex items-center md:hidden">
              <HamburgerButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
