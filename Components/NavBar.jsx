"use client";
import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Logo, Menu } from "../Components/index";

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = ["White Paper", "Project", "Donation", "About Us"];

  return (
    <div className="bg-black text-white">
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="flex items-center justify-between">

          <div className="flex items-center">

            <a href="/" aria-label="Company" title="Company" className="inline-flex items-center mr-8" >
              <Logo color="text-white" />
              <span className="ml-2 text-xl font-bold tracking-wide text-white uppercase">  Company  </span>
            </a>

            {/* Menu Items for Medium Screens and Above */}
            <ul className="hidden space-x-8 md:flex"> {/* Visible from md screens and up */}
              {menuList.map((el, i) => (  
                <li key={i + 1}>
                  <a  href="/"  aria-label={el}  title={el}
                    className="font-medium tracking-wide text-white transition-colors duration-200 hover:text-teal-400" >
                    {el}  </a>
                </li>
              ))}
            </ul>

          </div>

          {!currentAccount && (
            <ul className="hidden space-x-8 md:flex"> {/* Visible from md screens and up */}
              <li>
                <button
                  onClick={connectWallet} className="inline-flex items-center justify-center h-12 px-6 font-semibold
                  tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-500 hover:bg-indigo-700 focus:shadow-outline focus:outline-none"
                  aria-label="Connect Wallet" title="Connect Wallet" > Connect Wallet
                </button>
              </li>
            </ul>
          )}

          {/* Mobile Menu (hamburger) */}
          <div className="md:hidden z-40"> {/* Hidden on medium and larger screens */}

            <button aria-label="Open Menu" title="Open Menu" className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsMenuOpen(true)}>
              <Menu />
            </button>

            {isMenuOpen && (
              <div className="absolute top-0 left-0 w-full">
                <div className="p-5 bg-white border rounded shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <a href="/" aria-label="Company"title="Company" className="inline-flex items-center"> <Logo color="text-black"/>
                      <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase"> Company </span>
                    </a>

                    <button aria-label="Close Menu" title="Close Menu"
                      className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                      onClick={() => setIsMenuOpen(false)}>
                      <svg className="w-5 text-gray-600" viewBox="0 0 24 24"> <path fill="currentColor"
                        d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L11.6,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"/>
                      </svg>
                    </button>

                  </div>

                  <nav>

                    <ul className="space-y-4">
                      {menuList.map((el, i) => (
                        <li key={i + 1}>
                          <a href="/" aria-label={el} title={el} className="font-medium tracking-wide text-gray-700 transition-colors duration-200
                          hover:text-indigo-500"> {el} </a>
                        </li>
                      ))}
                      <li>
                        <button onClick={connectWallet} className="inline-flex items-center justify-center w-full h-12 px-6 font-semibold
                        tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-500 hover:bg-indigo-700 focus:shadow-outline 
                        focus:outline-none" aria-label="Connect Wallet" title="Connect Wallet">  Connect Wallet </button>
                      </li>
                    </ul>

                  </nav>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default NavBar;
