import React from 'react';
import { Menu as MenuIcon, X, Home, Mail, User, Settings } from 'lucide-react';
import { MenuItem, MenuContainer } from '../ui/fluid-menu';

export function FluidNavigation() {
  return (
    <MenuContainer>
      <MenuItem 
        icon={
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
              <MenuIcon size={24} strokeWidth={1.5} className="text-white" />
            </div>
            <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
              <X size={24} strokeWidth={1.5} className="text-white" />
            </div>
          </div>
        } 
      />
      <MenuItem icon={<Home size={24} strokeWidth={1.5} className="text-white" />} />
      <MenuItem icon={<Mail size={24} strokeWidth={1.5} className="text-white" />} />
      <MenuItem icon={<User size={24} strokeWidth={1.5} className="text-white" />} />
      <MenuItem icon={<Settings size={24} strokeWidth={1.5} className="text-white" />} />
    </MenuContainer>
  );
}