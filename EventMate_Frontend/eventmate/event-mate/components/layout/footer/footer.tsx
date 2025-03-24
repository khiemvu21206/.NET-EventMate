import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8 mt-0 z-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thông tin liên hệ */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Hotline</h4>
            <p className="text-gray-600 mb-6">0123 456789</p>
            <h4 className="font-semibold text-gray-800 mb-4">Email</h4>
            <p className="text-gray-600 mb-6">abc@xyz.com</p>
            <h4 className="font-semibold text-gray-800 mb-4">Office</h4>
            <p className="text-gray-600">Hanoi, Vietnam</p>
          </div>

          {/* Cột 2: Điều khoản và đăng ký nhận tin */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">For Customers</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link
                  href="/terms-of-use-customers"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Terms of Use for Customers
                </Link>
              </li>
            </ul>
            <h4 className="font-semibold text-gray-800 mb-4">For Organizers</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link
                  href="/terms-of-use-organizers"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Terms of Use for Organizers
                </Link>
              </li>
            </ul>
            <h4 className="font-semibold text-gray-800 mb-4">
              Sign up to receive emails about the hottest events
            </h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 rounded-l-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
              />
              <button className="bg-gray-700 text-white px-6 py-2 rounded-r-full hover:bg-gray-800">
                Sign Up
              </button>
            </div>
          </div>

          {/* Cột 3: About us */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">About us</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about/operating-regulations"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Operating regulations
                </Link>
              </li>
              <li>
                <Link
                  href="/about/information-security-policy"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Information security policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about/dispute-resolution"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Dispute/complaint resolution mechanism
                </Link>
              </li>
              <li>
                <Link
                  href="/about/payment-security-policy"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Payment security policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about/return-inspection-policy"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Return and inspection policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about/shipping-delivery"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Shipping and delivery conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/about/payment-methods"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Payment methods
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t mt-8 pt-4 text-center text-gray-600">
        <p>© 2025 EventMate. All rights reserved.</p>
      </div>
    </footer>
  );
}
