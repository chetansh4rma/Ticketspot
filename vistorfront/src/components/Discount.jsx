import React from 'react';
import yourImage from './assets/LogoTicketspot.jpg'; // Adjust the path and filename as necessary

const DiscountCoupon = () => {
  return (
    <div className="flex justify-center items-center bg-white h-[300px]">
      <div className="relative bg-white w-[900px] h-[200px] flex items-center justify-between border-dashed border-4 border-[#faa935] p-6 rounded-lg shadow-lg">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center bg-[#faa935] text-white h-full w-[120px] rounded-lg shadow-md">
          <p className="text-xl font-bold">Rs 30 OFF</p>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col items-center justify-center flex-grow pl-6">
          <p className="text-xl font-light text-[#a05c27] mb-1 text-center">Get Rs 30 discount on first booking</p>
          <p className="text-3xl font-bold text-[#faa935] text-center"> COUPEN CODE - "WELCOME30"</p>
        </div>

        {/* Image Section */}
        <div className="flex-shrink-0 w-[120px] h-[120px]">
          <img src={yourImage} alt="Coupon Decoration" className="w-full h-full object-cover rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default DiscountCoupon;