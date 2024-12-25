import { Inter } from "next/font/google";
import "./globals.css";

// Correct import (no curly braces for default export)
import { NavBar, Footer } from '../../Components';
import {CrowdFundingProvider} from '../../Context/CrowdFunding';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crowdfund Dapp Project",
  description: "Created by Angela Taylor LLC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <CrowdFundingProvider>
        <body className={inter.className}>
          <NavBar />
          {children}
          <Footer />
        </body>
      </CrowdFundingProvider>
    </html>
  );
}
