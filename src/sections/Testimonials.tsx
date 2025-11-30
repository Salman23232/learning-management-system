'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import avatar1 from '../../public/assets/avatar-1.png'
import avatar2 from '../../public/assets/avatar-2.png'
import avatar3 from '../../public/assets/avatar-3.png'
import avatar4 from '../../public/assets/avatar-4.png'
import avatar5 from '../../public/assets/avatar-5.png'
import avatar6 from '../../public/assets/avatar-6.png'
import avatar7 from '../../public/assets/avatar-7.png'
import avatar8 from '../../public/assets/avatar-8.png'
import avatar9 from '../../public/assets/avatar-9.png'

const testimonials = [
  {
    text: 'As a seasoned designer always on the lookout for innovative tools, Framer.com instantly grabbed my attention.',
    imageSrc: avatar1.src,
    name: 'Jamie Rivera',
    username: '@jamietechguru00',
  },
  {
    text: "Our team's productivity has skyrocketed since we started using this tool.",
    imageSrc: avatar2.src,
    name: 'Josh Smith',
    username: '@jjsmith',
  },
  {
    text: 'This app has completely transformed how I manage my projects and deadlines.',
    imageSrc: avatar3.src,
    name: 'Morgan Lee',
    username: '@morganleewhiz',
  },
  {
    text: 'I was amazed at how quickly we were able to integrate this app into our workflow.',
    imageSrc: avatar4.src,
    name: 'Casey Jordan',
    username: '@caseyj',
  },
  {
    text: 'Planning and executing events has never been easier. This app helps me keep track of everything.',
    imageSrc: avatar5.src,
    name: 'Taylor Kim',
    username: '@taylorkimm',
  },
  {
    text: 'The customizability and integration capabilities of this app are top-notch.',
    imageSrc: avatar6.src,
    name: 'Riley Smith',
    username: '@rileysmith1',
  },
  {
    text: 'Adopting this app for our team has streamlined our project management greatly.',
    imageSrc: avatar7.src,
    name: 'Jordan Patels',
    username: '@jpatelsdesign',
  },
  {
    text: 'We can easily assign tasks, track progress, and manage documents all in one place.',
    imageSrc: avatar8.src,
    name: 'Sam Dawson',
    username: '@dawsontechtips',
  },
  {
    text: 'Its user-friendly interface and robust features support our diverse needs.',
    imageSrc: avatar9.src,
    name: 'Casey Harper',
    username: '@casey09',
  },
]

const Testimonial = ({
  text,
  name,
  username,
  imageSrc,
}: {
  text: string
  name: string
  username: string
  imageSrc: string
}) => (
  <div className="card w-[380px]">
    <div>{text}</div>

    <div className="flex items-center gap-2 mt-5">
      <Image src={imageSrc} alt={name} width={40} height={40} className="h-10 w-10 rounded-full" />
      <div className="flex flex-col">
        <div className="font-medium tracking-tight leading-5">{name}</div>
        <div className="leading-5 tracking-tight text-black/60">{username}</div>
      </div>
    </div>
  </div>
)

const Testimonials = () => {
  const first = testimonials.slice(0, 3)
  const second = testimonials.slice(3, 6)
  const third = testimonials.slice(6, 9)

  return (
    <section className="bg-white py-30">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>

          <h2 className="section-title mt-5">What our users say</h2>

          <p className="section-description mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        {/* VERTICAL SCROLL */}
        <div className="flex justify-center gap-6 mt-10 max-h-[738px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
          {/* Column 1 */}
          <motion.div
            className="flex flex-col gap-6"
            animate={{ y: ['0%', '-100%'] }}
            transition={{
              duration: 22, // medium speed
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {first.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
            {first.map((t, i) => (
              <Testimonial key={`dup1-${i}`} {...t} />
            ))}
          </motion.div>

          {/* Column 2 (slightly different speed for premium feel) */}
          <motion.div
            className="flex flex-col gap-6"
            animate={{ y: ['0%', '-100%'] }}
            transition={{
              duration: 26,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {second.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
            {second.map((t, i) => (
              <Testimonial key={`dup2-${i}`} {...t} />
            ))}
          </motion.div>

          {/* Column 3 */}
          <motion.div
            className="flex flex-col gap-6"
            animate={{ y: ['0%', '-100%'] }}
            transition={{
              duration: 20,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {third.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
            {third.map((t, i) => (
              <Testimonial key={`dup3-${i}`} {...t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
