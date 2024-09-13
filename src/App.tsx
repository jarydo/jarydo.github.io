import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

function App() {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState('');
  const fullTitle = 'Jaryd.';

  const [activeTab, setActiveTab] = useState('Home');
  const navItems = ['Home', 'Experience', 'Projects', 'Contact'];

  useEffect(() => {
    if (index < fullTitle.length) {
      const timeout = setTimeout(() => {
        setTitle((prevTitle) => prevTitle + fullTitle[index])
        setIndex((prevIndex) => prevIndex + 1)
      }, 300) // Adjust this value to change the typing speed

      return () => clearTimeout(timeout)
    }
  }, [index])

  const Background = ({ children } : { children: React.ReactNode }) => {
    return (
      <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"></div>
        
        {/* Metallic overlay */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white to-transparent opacity-20"></div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between min-h-screen p-12 w-4/5">
          {children}
        </div>
      </div>
    )
  }

  const Title = () => {
    return (
        <span className="font-bold text-slate-200">
          {title}
          <span className="animate-pulse">|</span>
        </span>
    )
  }

  return (
    <Background>
      <nav className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-full p-1 flex justify-between items-center">
        {navItems.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className={`text-sm px-4 py-2 rounded-full transition-colors duration-200 ${
              activeTab === item
                ? 'text-blue-500 bg-white hover:text-blue-500'
                : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-white'
            }`}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </Button>
        ))}
        <Button
          variant="secondary"
          className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 rounded-full px-4 py-2 text-sm"
        >
          Try a new style
        </Button>
      </nav>

      <main className="text-center flex flex-col gap-4 text-white">
        <h1 className="text-8xl font-bold">Introducing... <Title /></h1> 
        <h1 className="text-6xl font-bold">Your next intern.</h1>
        <p className="text-xl">Developer, community builder, filmmaker, amateur musician - you can guarantee his value is <b>not just code.</b></p>
      </main>
      
      <footer>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-white text-lg">★★★★★</span>
            <p className="text-lg text-gray-300 mt-2">Trusted by the following companies:</p>
          </div>
          <div className="flex justify-center space-x-10 opacity-50">
            <img src="/arctic_wolf.png" alt="Arctic Wolf" className="h-10" />
            <img src="/99_ravens.png" alt="99 Ravens" className="h-10" />
            <img src="/horizn.png" alt="Horizn" className="h-10" />
            <img src="/arctic_ai.png" alt="Arctic AI" className="h-10" />
            <img src="/mikobyte.webp" alt="Mikobyte Solutions" className="h-10" />
          </div>
        </div>
      </footer>
    </Background>    
  )
}

export default App
