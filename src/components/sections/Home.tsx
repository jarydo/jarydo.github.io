import { forwardRef } from "react";

const Home = forwardRef<HTMLElement, { title: string }>((props, ref) => {
    const Title = () => {
        return (
            <span className="font-bold text-slate-200">
              {props.title}
              <span className="animate-pulse">|</span>
            </span>
        )
    }

    return (
        <section id="home" ref={ref} className="min-h-screen flex flex-col items-center justify-evenly mt-6">
            <main className="text-center flex flex-col gap-4 text-white">
            <h1 className="text-8xl font-bold">Introducing... <Title /></h1> 
            <h1 className="text-6xl font-bold">Your next hire.</h1>
            {/*TODO: fix, A curious and passionate developer, with a variety of experience from startups to large organizations - you can guarantee his value is not just code.*/}
            <p className="text-2xl mt-8">Developer, community builder, filmmaker, amateur musician - you can guarantee his value is <b>not just code.</b></p>
            </main>
            
            <footer>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-4">
                <span className="text-white text-lg">★★★★★</span>
                <p className="text-xl text-gray-300 mt-2">Trusted by the following companies:</p>
                </div>
                <div className="flex justify-center space-x-10">
                <a href="https://arcticwolf.com/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/arctic_wolf.png" alt="Arctic Wolf" className="h-10" /></a>
                <a href="https://99ravens.ai/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/99_ravens.png" alt="99 Ravens" className="h-10" /></a>
                <a href="https://horizn.com/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/horizn.png" alt="Horizn" className="h-10" /></a>
                <a href="https://www.arcticai.co/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/arctic_ai.png" alt="Arctic AI" className="h-10" /></a>
                <a href="https://www.mikobyte.com/" target="_blank" className="opacity-50 hover:opacity-100 ml-2.5"><img src="/mikobyte.webp" alt="Mikobyte Solutions" className="h-10" /></a>
                </div>
            </div>
            </footer>
        </section>
    )
});

export default Home;