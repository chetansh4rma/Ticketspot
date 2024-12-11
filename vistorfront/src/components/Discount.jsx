import React from 'react';


const DiscountCoupon = () => {
  return (
    <div className="flex justify-center items-center bg-[#f4f4f4] h-[300px]">
      <div className="relative bg-white w-[900px] h-[200px] flex items-center justify-between border-dashed border-4 border-[#faa935] p-6 rounded-lg shadow-lg">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center bg-[#faa935] text-white h-full w-[120px] rounded-lg shadow-md">
          <p className="text-xl font-bold">30% OFF</p>
        </div>

         {/* Middle Section */}
         <div className="flex flex-col items-center justify-center flex-grow pl-6">
          <p className="text-lg font-light text-[#a05c27] mb-1 text-center">TicketSpot</p>
          <p className="text-3xl font-bold text-[#a05c27] text-center">DISCOUNT COUPON</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 text-[#a05c27] text-2xl">
          <i className="fas fa-coffee"></i>
        </div>
        <div className="absolute bottom-4 right-4 text-[#a05c27] text-2xl">
          <i className="fas fa-leaf"></i>
        </div>
      </div>
    </div>
  );
};

export default DiscountCoupon;
