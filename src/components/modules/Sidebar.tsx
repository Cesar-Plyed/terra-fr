import { useEffect, useState } from 'react';
// import { ThemeChangeButton } from '@components/atoms/buttons/ThemeChangeButton';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const getNavItems = (langPrefix: string): NavItem[] => {
  if (langPrefix === '/es-MX') {
    return [
      { label: 'Inicio', href: `${langPrefix}/` },
      { label: 'Acerca de Mi', href: `${langPrefix}/about` },
      { label: 'Contacto', href: `${langPrefix}/contact` },
    ];
  }

  // default en-GB
  return [
    { label: 'Home', href: `${langPrefix}/` },
    { label: 'About Me', href: `${langPrefix}/about` },
    { label: 'Contact', href: `${langPrefix}/contact` },
  ];
};

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for sidebar toggle events
    const handleToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
    };

    window.addEventListener('sidebar-toggle' as any, handleToggle);

    return () => {
      window.removeEventListener('sidebar-toggle' as any, handleToggle);
    };
  }, []);

  // Close sidebar when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false);
    // Dispatch close event
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isOpen: false } }));
  };

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isOpen: false } }));
  };

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
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 bg-black/40 backdrop-blur-xs"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar-bg border-r border-none z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
        aria-label="Navigation sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-none">
            <h2 className="text-xl font-semibold text-subtitle ">
              Menu
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-hidden">
            {/* Using same classes as configured Ul component (variant='minimal') */}
            <ul className="space-y-1 list-none">
              {navItems.map((item) => (
                /* Using same classes as configured Li component (interactive=true) */
                <li 
                  key={item.href}
                  className="px-3 py-2 transition-colors duration-200 rounded-sm cursor-pointer text-sidebar-text hover:bg-sidebar-item-bg-active hover:text-sidebar-text-active"
                >
                  <a
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 font-medium focus-ring"
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};
