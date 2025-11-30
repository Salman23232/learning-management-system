import Image from 'next/image'
import logo from '../../public/assets/image.png'

const Logo = () => {
  return (
    <div className="flex gap-2">
      <Image src={logo} alt="logo" width={40} height={40} />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-black">
          Karigori <br />
        </h1>
        <p className="text-sm">Coding School</p>
      </div>
    </div>
  )
}

export default Logo
