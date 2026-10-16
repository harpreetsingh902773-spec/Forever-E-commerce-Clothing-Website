import React from 'react'

const Newsletter = () => {
    const onSubmitHandler = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & save up to 20%!
      </p>

      <p className="text-gray-400 mt-3">
        Join our newsletter to receive the latest updates and offers.
      </p>

      <form  onSubmit={onSubmitHandler}
       className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-300 rounded-md p-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default Newsletter
