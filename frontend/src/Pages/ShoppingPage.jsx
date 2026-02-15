import React from 'react'
import HoodieProduct from './HoodieProduct'
import Product from './TshirtProduct'

export default function ShoppingPage({ gender }) {
  return (
    <div className="w-full">

          <div className="bg-gray-900">   
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-center text-2xl md:text-3xl tracking-[0.25em] font-semibold text-white">
            SHOP NOW
          </h1>
        </div>
      </div>

      <div className='pt-8'>
      <Product gender={gender} />
      <HoodieProduct gender={gender} />
</div>
    </div>
  )
}
