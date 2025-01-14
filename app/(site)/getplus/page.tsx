import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-screen flex justify-center items-center font-bold text-xl text-white gap-5">
      <div className="h-4/5 w-1/5 flex flex-col items-center text-black bg-white rounded-lg p-5 hover:border hover:border-2 hover:border-blue-500 hover:scale-110 transition ease-in-out duration-500 cursor-pointer">
        <h3 className="text-2xl font-semibold mb-4 bg-red-500 w-full rounded-lg text-white text-center p-2 tracking-widest">
          Starter
        </h3>
        <p className="text-gray-600 mb-6 text-center text-lg">
          Perfect for individuals getting started.
        </p>
        <ul className="space-y-2 text-gray-700 mb-6 text-sm">
          <li>- Upload up to 10 PDFs/month</li>
          <li>- 100 Chats</li>
          <li>- Basic Support</li>
        </ul>
        <p className="text-xl font-bold text-gray-800 mt-auto">Free</p>
        <Link
          href={"/dashboard"}
          className="bg-blue-500 text-white px-6 py-2 rounded-full mt-auto shadow hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </div>
      <div className="h-4/5 w-1/5 flex flex-col items-center text-black bg-white rounded-lg p-5 hover:border hover:border-2 hover:border-blue-500 hover:scale-110 transition ease-in-out duration-500 cursor-pointer">
        <h3 className="text-2xl font-semibold mb-4 bg-red-500 w-full rounded-lg text-white text-center p-2 tracking-widest">
          PRO
        </h3>
        <p className="text-gray-600 mb-6 text-center text-lg">
          Best for small teams and frequent users.
        </p>
        <ul className="space-y-2 text-gray-700 mb-6 text-sm">
          <li>- Unlimited PDFs for pro users</li>
          <li>- 1,000 Chats</li>
          <li>- Priority Support</li>
        </ul>
        <p className="text-xl font-bold text-gray-800 mt-auto">
          $19<span className="text-lg text-gray-600">/mo</span>
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition mt-auto">
          Upgrade
        </button>
      </div>
      <div className="h-4/5 w-1/5 flex flex-col items-center text-black bg-white rounded-lg p-5 hover:border hover:border-2 hover:border-blue-500 hover:scale-110 transition ease-in-out duration-500 cursor-pointer">
        <h3 className="text-2xl font-semibold mb-4 bg-red-500 w-full rounded-lg text-white text-center p-2 tracking-widest">
          Enterprise
        </h3>
        <p className="text-gray-600 mb-6 text-center text-lg">
          For businesses with advanced needs.
        </p>
        <ul className="space-y-2 text-gray-700 mb-6 text-sm">
          <li>- Unlimited PDFs</li>
          <li>- Unlimited Chats</li>
          <li>- Dedicated Support</li>
          <li>- Team Collaboration Features</li>
        </ul>
        <p className="text-xl font-bold text-gray-800 mb-4 mt-auto">
          $49<span className="text-lg text-gray-600">/mo</span>
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition mt-auto">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default page;
