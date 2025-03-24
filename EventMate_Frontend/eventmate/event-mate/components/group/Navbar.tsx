'use client'
import { useParams, usePathname } from 'next/navigation';
import {
  ClockIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { GroupRepository } from '@/repositories/GroupRepository';

interface GroupInfo {
  groupId: string;
  groupName: string;
  img: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await GroupRepository.findGroup(groupId as string);
        if (response.status === 200) {
          setGroupInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching group info:', error);
      }
    };

    if (groupId) {
      fetchGroupInfo();
    }
  }, [groupId]);

  const menuItems = [
    { href: '/group/timeline/'+groupId, icon: CalendarDaysIcon, label: 'Timeline' },
    // { href: '/group/activities'+groupId, icon: ClockIcon, label: 'Activities' },
    { href: '/group/cost/'+groupId, icon: BanknotesIcon, label: 'Cost' },
    { href: '/group/chat/'+groupId, icon: ChatBubbleLeftRightIcon, label: 'Chat' },
    { href: '/group/map/'+groupId, icon: MapIcon, label: 'Map' },
    { href: '/group/share/'+groupId, icon: PhotoIcon, label: 'Video And Image' },
    { href: '/group/member/'+groupId, icon: UserGroupIcon, label: 'GroupMember' },
    { href: '/group/setting/'+groupId, icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-10 text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
            <img 
              src={groupInfo?.img || "/images/default-group-avatar.jpg"} 
              alt="Group Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="tracking-tight">{groupInfo?.groupName || 'Loading...'}</span>
        </h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href} className="transform transition-all duration-200">
                <a
                  href={item.href}
                  className={`flex items-center p-3.5 rounded-xl ${
                    pathname === item.href
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;