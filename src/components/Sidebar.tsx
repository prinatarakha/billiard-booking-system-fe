'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative flex h-screen">
      <nav className={`bg-zinc-800 h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-auto'}`}>
        <ul className="p-4 space-y-2">
          <li>
            <NavLink href="/" icon="🏠" isOpen={isOpen}>Home</NavLink>
          </li>
          <li>
            <NavLink href="/tables" icon="🎱" isOpen={isOpen}>Tables</NavLink>
          </li>
          <li>
            <NavLink href="/table-occupations" icon="👥" isOpen={isOpen}>Table Occupations</NavLink>
          </li>
          <li>
            <NavLink href="/waiting-list" icon="⏳" isOpen={isOpen}>Waiting List</NavLink>
          </li>
        </ul>
      </nav>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-zinc-800 text-white w-6 h-6 rounded-full flex items-center justify-center focus:outline-none"
      >
        {isOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
      </button>
    </div>
  );
}
