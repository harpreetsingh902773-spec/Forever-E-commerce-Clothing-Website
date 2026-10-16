import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'

const Footer = () => {
  return (
    <footer>
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr_1fr] gap-8 py-10 px-5 sm:px-10 md:px-20 bg-gray-">

        <div>
          <img
            src={assets.logo}
            alt="logo"
            className="w-32 m-auto sm:m-0"
          />

          <p className="text-gray-500 text-sm mt-4 max-w-md">
            Discover the latest fashion and lifestyle products at the best
            prices. Shop with us for a simple and enjoyable shopping experience.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">COMPANY</h3>

          <ul className="text-gray-500 text-sm space-y-2">
            <li className="cursor-pointer hover:text-black">Home</li>
            <li className="cursor-pointer hover:text-black">About Us</li>
            <li className="cursor-pointer hover:text-black">Delivery</li>
            <li className="cursor-pointer hover:text-black">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">GET IN TOUCH</h3>

          <ul className="text-gray-500 text-sm space-y-2">
            <li>+91 9027739217</li>
            <li>smeet3070@gmail.com</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">FOLLOW US</h3>

          <div className="flex gap-4 text-gray-500">
            <span className="cursor-pointer hover:text-black">Facebook</span>
            <span className="cursor-pointer hover:text-black">Instagram</span>
            <span className="cursor-pointer hover:text-black">Twitter</span>
          </div>
        </div>

      </div>

      <div className="bg-gray-100 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm py-5">
          Copyright © 2026 Shopper. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer