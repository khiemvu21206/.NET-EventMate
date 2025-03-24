import React, { useMemo } from "react";
import Link from "next/link";

import { useLanguage } from "@/providers/LanguageProvider";
import AccountSettingMenu from "./AccountSettingMenu";
import { useUserContext } from "@/providers/UserProvider";
import { EM_STATUS } from "@/constants/constant";
import { StarIcon, TicketIcon, UserGroupIcon } from "@heroicons/react/24/outline";


export default function Header() {
    const { t } = useLanguage();
    const {status} = useUserContext();
    const isLoggedIn = useMemo(() => status === EM_STATUS.authenticated, [status]); 
    return (
        <>
            {/* Top Row */}
            <header className="bg-gray-100 border-b fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/home" className="flex items-center space-x-3"> {/* Đảm bảo nằm cùng hàng */}
                            <img
                                src="/images/icon.png"
                                alt="Event Mate Logo"
                                className="h-10 w-auto object-contain" // Điều chỉnh kích thước logo
                            />
                            <span className="text-2xl font-bold text-gray-600 whitespace-nowrap">Event Mate</span> {/* Đảm bảo không bị xuống dòng */}
                        </Link>


                        {/* Các nút bên phải với khoảng cách rộng hơn */}
                        <div className="flex items-center space-x-8">
                           

                            <Link
                                href="#"
                                className="hover:text-gray-700 flex items-center space-x-1 text-lg"
                            >
                             <TicketIcon className="w-6 h-6 text-gray-700" />
                                <span>{t("exchange-item")}</span>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-gray-700 flex items-center space-x-1 text-lg"
                            >
                             <StarIcon className="w-6 h-6 text-gray-700" />
                                <span>{t("event")} </span>
                            </Link>
                            <Link
                                href="/friend"
                                className="hover:text-gray-700 flex items-center space-x-1 text-lg"
                            >
                             <UserGroupIcon className="w-6 h-6 text-gray-700" />
                                <span>Friends </span>
                            </Link>
                         

                            {/* User Menu */}
                            {isLoggedIn ? (
                                <AccountSettingMenu />
                            ) : (
                                <>
                              
                                <Link href="/login" className="hover:text-gray-700 text-lg">
                                    {t("login")}
                                </Link> 
                             </>
                            )}
                           

                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
