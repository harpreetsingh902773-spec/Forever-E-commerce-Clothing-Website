import React, { useContext } from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../contex/ShopContext'
import { toast } from 'react-toastify'

function Navbar() {
  const [visible, setVisible] = React.useState(false)
  const { setShowSearch, cartCount, user, logoutUser } = useContext(ShopContext);

  return (
    <div className='flex items-center justify-between py-5 font-medium'>

      <Link to="/"><img src={assets.logo} className='w-32' alt='Logo' /> </Link>

      <ul className='hidden sm:flex items-center gap-6 text-sm text-gray-700'>
        <NavLink to='/'>
          <li>HOME</li>
        </NavLink>

        <NavLink to='/Collection'>
          <li>COLLECTION</li>
        </NavLink>

        <NavLink to='/About'>
          <li>ABOUT</li>
        </NavLink>

        <NavLink to='/contact'>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img   onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt='Search'
        />

        <div className='group relative'>
          <Link to={user ? '/Orders' : '/Login'} aria-label={user ? 'Account orders' : 'Sign in'}>
            <img
              src={assets.profile_icon}
              className='w-5 cursor-pointer'
              alt='Profile'
            />
          </Link>

          <div className='group-hover:block hidden absolute right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 px-5 py-3 bg-slate-100 text-gray-500 rounded-2xl'>
              {user ? (
                <>
                  <p className='truncate text-gray-800'>Hi, {user.name}</p>
                  <Link to='/Orders' className='cursor-pointer hover:text-black'>Orders</Link>
                  {user.isAdmin && <Link to='/Dashboard' className='cursor-pointer hover:text-black'>Product dashboard</Link>}
                  <button
                    type='button'
                    onClick={() => logoutUser().catch(() => toast.error('Could not sign out.'))}
                    className='text-left cursor-pointer hover:text-black'
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to='/Login' className='cursor-pointer hover:text-black'>Sign in</Link>
                  <Link to='/Orders' className='cursor-pointer hover:text-black'>Orders</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <Link to='/Card' className='relative'>
          <img
            src={assets.cart_icon}
            className='w-5 min-w-5'
            alt='Cart'
          />
          <p className='absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center'>
            {cartCount}
          </p>
        </Link>

        <img
          onClick={() => setVisible(!visible)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt='Menu'
        />
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white z-50 transform ${
          visible ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className='flex flex-col p-5'>

          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-3 cursor-pointer mb-8'
          >
            <span className='text-2xl'>←</span>
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            to='/'
            className='py-3 border-b'
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to='/Collection'
            className='py-3 border-b'
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to='/About'
            className='py-3 border-b'
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to='/contact'
            className='py-3 border-b'
          >
            CONTACT
          </NavLink>

        </div>
      </div>

    </div>
  )
}

export default Navbar
