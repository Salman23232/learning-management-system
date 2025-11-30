export const dynamic = 'force-dynamic'
import CallToAction from '@/sections/CallToAction'
import CEO from '@/sections/CEO'
import Footer from '@/sections/Footer'
import Header from '@/sections/Header'
import Hero from '@/sections/Hero'
import LogoTicker from '@/sections/LogoTicker'
import ProductShowcase from '@/sections/ProductShowcase'
import Testimonials from '@/sections/Testimonials'

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <CEO />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default page
