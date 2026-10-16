import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPollcy from '../components/OurPollcy'
import NewLatter from '../components/NewLatter'

function Home() {
  return (
    <div>
        <Hero/>
        <LatestCollection/>
        <BestSeller/>
        <OurPollcy/>
        <NewLatter/>

      
    </div>
  )
}

export default Home
