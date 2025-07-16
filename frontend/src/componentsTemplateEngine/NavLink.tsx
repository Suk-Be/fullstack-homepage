import { NavLinkProps, NavLink as RouterNavLink } from 'react-router-dom';

interface CustomNavLinkProps extends NavLinkProps {
    className?: string;
}

export default function NavLink({ className = '', children, ...props }: CustomNavLinkProps) {
    return (
        <RouterNavLink
            {...props}
            className={({ isActive }) =>
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (isActive
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700') +
                ' ' +
                className
            }
        >
            {children}
        </RouterNavLink>
    );
}
