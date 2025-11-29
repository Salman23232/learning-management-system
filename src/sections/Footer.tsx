import Image from 'next/image'
import logo from '../../public/assets/logosaas.png'
import { Github, Instagram, Linkedin, Twitter, X, Youtube } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <Image src={logo} height={40} alt="SaaS logo" className="relative" />
        </div>

        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#customers">Customers</a>
          <a href="#pricing">Pricing</a>
          <a href="#help">Help</a>
          <a href="#careers">Careers</a>
        </nav>

        <div className="flex justify-center gap-6 mt-10">
          <Link href={'https://x.com/SalmanAhmedDev'}>
            <Twitter />
          </Link>
          <Link href={'https://www.instagram.com/_salman_x_leo/'}>
            <Instagram />
          </Link>
          <Link href={'https://x.com/SalmanAhmedDev'}>
            <Linkedin />
          </Link>
          <Link href={'https://github.com/salman23232'}>
            <Github />
          </Link>
          <Link href={'https://www.youtube.com/@programmingwithsalmanahmed'}>
            <Youtube />
          </Link>
        </div>

        <p className="mt-6">&copy; 2024 Your Company, Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
