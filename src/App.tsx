import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
// import { Label } from './components/ui/label';
// import { Switch } from './components/ui/switch';
import Home from './components/sections/Home';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';
import Projects from './components/sections/Projects';

function App() {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState('');
  const fullTitle = 'Jaryd.';

  const [activeTab, setActiveTab] = useState('home');
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ]

  // const [recruiterMode, setRecruiterMode] = useState(true);

  // TODO: Fix this reloading on navbar redirect
  useEffect(() => {
    if (index < fullTitle.length) {
        const timeout = setTimeout(() => {
          setTitle((prevTitle) => prevTitle + fullTitle[index])
          setIndex((prevIndex) => prevIndex + 1)
        }, 300) // Adjust this value to change the typing speed

        return () => clearTimeout(timeout)
    }
}, [index])

  const handleNavClick = (id: string) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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

  const NavBar = () => {
    return (
      <nav className="fixed top-10 left-52 right-52 z-100 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-full p-1 flex justify-between items-center">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={`text-lg px-6 py-6 rounded-full transition-colors duration-200 ${
            activeTab === item.id
              ? 'text-blue-500 bg-white hover:text-blue-500'
              : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-white'
          }`}
          onClick={() => handleNavClick(item.id)}
        >
          {item.label}
        </Button>
      ))}
      {/* <div className="flex items-center space-x-2 mx-4">
        <Switch
          id="recruiter-mode"
          checked={recruiterMode}
          onCheckedChange={setRecruiterMode}
          className="data-[state=checked]:bg-purple-600"
        />
        <Label htmlFor="recruiter-mode" className="text-lg text-white">
          Recruiter Mode
        </Label>
      </div> */}
    </nav>
    )
  }

  return (
    <Background>
      <NavBar />
      <Home title={title}/>
      <Experience />
      <Projects />
      <Contact />
    </Background>    
  )
}

export default App
