import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ChevronDownIcon, TicketIcon, UserCircleIcon, UserGroupIcon, StarIcon, GlobeAltIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useUserContext } from "@/providers/UserProvider";
import * as Avatar from "@radix-ui/react-avatar";
import { useLanguage } from "@/providers/LanguageProvider";
import USFlag from "@/public/header/USFlag.svg";
import VNFlag from "@/public/header/VNFlag.svg";
import { useRouter } from 'next/navigation';


const AccountSettingMenu = () => {
  const router = useRouter();
  const {id, email, name, logout, avatar } = useUserContext();
  const { t, language, changeLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen((prev) => !prev);

  const languageMenuItems = [
    {
      label: t('lang-vi'),
      value: 'vi',
      icon: (
        <span role="img" aria-label="Vietnamese" className="mr-2">
          <VNFlag />
        </span>
      ),
    },
    {
      label: t('lang-en'),
      value: 'en',
      icon: (
        <span role="img" aria-label="English" className="mr-2">
          <USFlag />
        </span>
      ),
    },
  ];
  const currentLanguageOption = languageMenuItems.find((option) => option.value === language);


  return (
    <div className="w-auto">
      <Menu as="div" className="relative flex items-center">
        {({ open }) => (
          <>
            {/* Nút mở menu */}
            <Menu.Button className="flex items-center hover:text-primary-500">
              {/* Avatar hoặc icon */}
              <div>
                <Avatar.Root className="inline-flex h-[30px] w-[30px] select-none items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  <Avatar.Image
                    className="h-full w-full object-cover"
                    src={avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
                    alt={name}
                  />
                  <Avatar.Fallback className="leading-7 font-semibold text-violet-500 bg-violet-100" delayMs={600}>
                    {name?.charAt(0)?.toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
              </div>

              {/* Icon dropdown */}
              <ChevronDownIcon className={`w-5 h-5 stroke-2 transition-transform ${open ? "rotate-180" : ""}`} />
            </Menu.Button>

            {/* Menu dropdown */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="z-[9999] absolute right-1 top-full p-2 mt-2 w-[300px] bg-bglight rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              >
                <div className="flex items-center gap-3 p-3 border-gray-200 ">
                  {/* Cột Avatar */}
                  <div className="flex-shrink-0">
                  <div>
                <Avatar.Root className="inline-flex h-[40px] w-[40px] select-none items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  <Avatar.Image
                    className="h-full w-full object-cover"
                    src={avatar || ''}
                    alt={name}
                  />
                  <Avatar.Fallback className="leading-7 font-semibold text-violet-500 bg-violet-100" delayMs={600}>
                    {name?.charAt(0)?.toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
              </div>
                  </div>

                  {/* Cột Tên và Email */}
                  <div className="flex flex-col truncate w-full">
                    <span className="truncate font-semibold text-[14px]">
                      {email || name}
                    </span>
                    {name && (
                      <span className="truncate text-subtitle text-[10px]">
                        {email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full border-t border-gray-300 shadow-md"></div>
                <div className="p-3 flex items-center cursor-pointer gap-2"
                onClick={() => router.push(`/profile/${id}`)}>                           
                  <UserCircleIcon className="w-6 h-6 text-gray-700" />
                  <p className="text-gray-700 text-sm ">{t('account-setting')}</p>
                </div>

                <div className="p-3 flex cursor-pointer items-center gap-2"
                  onClick={() => {
                    router.push('/group/invitation-list/'); 
                  }}
                >
                  <UserGroupIcon className="w-6 h-6 text-gray-700" />
                  <p className="text-gray-700 text-sm ">Your Invitation</p>
                </div>

                <div className="p-3 flex cursor-pointer items-center gap-2" 
                onClick={() => router.push('/event/createEvent/')}>
                  <StarIcon className="w-6 h-6 text-gray-700" />
                  <p className="text-gray-700 text-sm ">{t('your-event')}</p>
                </div>

                <div className="relative">
                  {/* Nút bấm để mở menu */}
                  <div className="p-3 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <GlobeAltIcon className="w-6 h-6 text-gray-700" />
                      <p className="text-gray-700 text-sm">{t('language')}</p>
                    </div>
                    <div className="flex items-center gap-2"
                      onClick={() => {
                        toggleLanguageMenu()
                      }}>

                      {currentLanguageOption?.icon || ''}
                      <span className="text-sm">{currentLanguageOption?.label || ''}</span>
                    </div>


                    {isLanguageMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 min-w-max bg-gray-50 border rounded shadow-md z-50">
                        {languageMenuItems.map((item, idx) => (
                          <button
                            key={idx}
                            className="block w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100 text-lg flex items-center"
                            onClick={() => {
                              setIsLanguageMenuOpen((prev) => !prev);
                              changeLanguage(item.value)
                            }}
                          >
                            {item.icon}
                            <span className="ml-2 text-sm">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>



                </div>
                <div className="w-full border-t border-gray-300 shadow-md"></div>
                <div className="p-3 flex items-center cursor-pointer gap-2"
                  onClick={logout}>
                  <ArrowRightEndOnRectangleIcon className="w-6 h-6 text-gray-700" />
                  <p className="text-gray-700 text-sm ">{t("logout")}</p>
                </div>

              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default AccountSettingMenu;
