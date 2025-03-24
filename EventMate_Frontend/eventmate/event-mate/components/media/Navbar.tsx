

// export default Navbar; 
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

const Navbar = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: '/g/timeline', icon: CalendarDaysIcon, label: 'Hồ Sơ' },
    { href: '/group/activities', icon: ClockIcon, label: 'Thư viện ảnh' },
    { href: '/group/cost', icon: BanknotesIcon, label: 'Ví' },
    { href: '/group/chat', icon: ChatBubbleLeftRightIcon, label: 'Nhóm của bạn' },
    { href: '/group/map', icon: MapIcon, label: 'Đơn hàng' },
    { href: '/group/share', icon: PhotoIcon, label: 'Cài đặt' },

  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-10 text-gray-800 flex items-center gap-3">
          <ClockIcon className="w-8 h-8 text-gray-700" />
          <span className="tracking-tight">Khách hàng</span>
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