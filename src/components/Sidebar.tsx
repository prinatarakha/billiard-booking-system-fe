'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavLink = ({ href, children, icon, isOpen }: { href: string; children: React.ReactNode; icon: string; isOpen: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center py-2 px-4 rounded transition duration-150 ease-in-out ${
        isActive
          ? "bg-zinc-700 text-white"
          : "text-gray-300 hover:bg-zinc-700 hover:text-white"
      }`}
    >
      <span className="">{icon}</span>
      <span className={`sidebar-link-text ${isOpen ? 'ml-3 inline' : 'hidden'}`}>{children}</span>
    </Link>
  );
};

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex">
      <nav 
        className={`bg-zinc-800 h-full transition-all duration-300 ${
          isHovered ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ul className="p-4 space-y-2">
          <li>
            <NavLink href="/" icon="🏠" isOpen={isHovered}>Home</NavLink>
          </li>
          <li>
            <NavLink href="/tables" icon="🎱" isOpen={isHovered}>Tables</NavLink>
          </li>
          <li>
            <NavLink href="/table-occupations" icon="👥" isOpen={isHovered}>Table Occupations</NavLink>
          </li>
          <li>
            <NavLink href="/waiting-list" icon="⏳" isOpen={isHovered}>Waiting List</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
