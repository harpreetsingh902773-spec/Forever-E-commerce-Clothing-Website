import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'

const OurPollcy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-8 sm:gap-4 text-center py-2 text-sm md:text-base text-gray-700">
      <div className="flex-1">
        <img src={assets.exchange_icon} className='w-12 mb-4 mx-auto' alt='Easy Exchange' />
        <p className='font-bold'>Easy Exchange</p>
        <p className='text-gray-500'>We offer hassle-free exchanges for your convenience.</p>
      </div>
      <div className="flex-1">
        <img src={assets.quality_icon} className='w-12 mb-4 mx-auto' alt='Quality Products' />
        <p className='font-bold'>7 day Return Policy</p>
        <p className='text-gray-500'>We have a 7-day return policy for your peace of mind.</p>
      </div>
      <div className="flex-1">
        <img src={assets.support_img} className='w-12 mb-4 mx-auto' alt='Support' />
        <p className='font-bold'>24/7 Support</p>
        <p className='text-gray-500'>Our customer support team is available around the clock to assist you.</p>
      </div>
    </div>
    
  )
}

export default OurPollcy
