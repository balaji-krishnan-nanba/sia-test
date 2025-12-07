import React from 'react';

export interface SidebarRoute {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SidebarProps {
  activeRoute: string;
  onNavigate: (href: string) => void;
  routes: SidebarRoute[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const Sidebar = React.memo<SidebarProps>(({
  activeRoute,
  onNavigate,
  routes,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  const isRouteActive = (href: string): boolean => {
    return activeRoute === href || activeRoute.startsWith(href + '/');
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full flex items-center justify-center transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {routes.map((route) => {
              const active = isRouteActive(route.href);
              return (
                <li key={route.href}>
                  <button
                    onClick={() => onNavigate(route.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    title={isCollapsed ? route.label : undefined}
                  >
                    {route.icon && (
                      <span className="flex-shrink-0 h-5 w-5">
                        {route.icon}
                      </span>
                    )}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{route.label}</span>
                        {route.badge !== undefined && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-primary-600 text-white rounded-full">
                            {route.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
