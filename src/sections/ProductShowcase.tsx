'use client'
import pyramidImage from '../../public/assets/pyramid.png'
import productImage from '../../public/assets/product-image.png'
import tubeImage from '../../public/assets/tube.png'
import { motion } from 'framer-motion'
import Image from 'next/image'

const ProductShowcase = () => {
  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24">
      <div className="wrapper flex flex-col items-center gap-5">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Boost your learning</div>
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text  uppercase py-5">
            A more effective way to Learn
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E]">
            Our web app helps your generate courses chapters and lessons with video content
            instantly. You can ask any query directly to AI in the Ask AI section. You can practise
            problems in different topics in the Practice with AI section. Finally you can test your
            knowledge in the Exam section.
          </p>
        </div>
        <div className="relative">
          <Image src={productImage} alt="Product Image" className="mt-10" />
          <motion.img
            animate={{
              translateY: [-30, 30],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 3,
              ease: 'easeInOut',
            }}
            src={pyramidImage.src}
            alt="Pyramid Image"
            className="hidden md:block absolute -right-10 -top-32"
            height={262}
            width={262}
          />
          <motion.img
            animate={{
              translateY: [-30, 30],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 3,
              ease: 'easeInOut',
            }}
            src={tubeImage.src}
            alt="Tube Image"
            className="hidden block absolute -left-36 bottom-24"
            height={248}
            width={248}
          />
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase
