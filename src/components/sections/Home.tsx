import { forwardRef, useRef, useState, useCallback, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";
import * as resume from "../../resume.json";

type AutoplayType = {
    play: () => void;
    stop: () => void;
    reset: () => void;
    destroy: () => void;
};

const Home = forwardRef<HTMLElement, { title: string }>((props, ref) => {
    const [autoplay, setAutoplay] = useState<AutoplayType | null>(null);

    const Title = () => {
        return (
            <span className="font-bold text-slate-200">
              {props.title}
              <span className="animate-pulse">|</span>
            </span>
        )
    }

    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
            playOnInit: true
        })
    )

    const handleMouseEnter = useCallback(() => {
        if (autoplay) {
            plugin.current.stop()
        }
    }, [autoplay])

    const handleMouseLeave = useCallback(() => {
        if (autoplay) {
            plugin.current.play()
        }
    }, [autoplay])

    useEffect(() => {
        if (plugin.current) {
            setAutoplay(plugin.current)
        }
    }, [])

    return (
        <section id="home" ref={ref} className="min-h-screen flex flex-col items-center gap-12">
            <main className="text-center flex flex-col gap-6 text-white mt-36">
                <h1 className="text-8xl font-bold">Introducing... <Title /></h1> 
                <h1 className="text-6xl font-bold">Your next hire.</h1>
                {/*TODO: fix, A curious and passionate developer, with a variety of experience from startups to large organizations - you can guarantee his value is not just code.*/}
                <p className="text-2xl">Developer, community builder, filmmaker, amateur musician - you can guarantee his value is <b>not just code.</b></p>
            </main>
            
            <Carousel 
                plugins={[plugin.current]}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="text-white text-center max-w-3xl"
            >
                <CarouselContent>
                    {resume.experience.map((item) => {
                         if (item.quote) {
                            return (
                                <CarouselItem key={item.company}>
                                    <span className="flex items-center justify-center h-full">{item.quote}, {item.company}</span>
                                </CarouselItem>
                            )
                        }
                    })}
                </CarouselContent>
                <CarouselPrevious className="text-slate-500"/>
                <CarouselNext className="text-slate-500"/>
            </Carousel>

            <div className="max-w-4xl mx-auto mb-6 text-center">
                <span className="text-white text-lg">★★★★★</span>
                <p className="text-xl text-gray-300 mt-2 text-center mb-4">Trusted by the following companies:</p>
                <div className="flex justify-center space-x-10">
                    <a href="https://arcticwolf.com/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/arctic_wolf.png" alt="Arctic Wolf" className="h-10" /></a>
                    <a href="https://99ravens.ai/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/99_ravens.png" alt="99 Ravens" className="h-10" /></a>
                    <a href="https://horizn.com/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/horizn.png" alt="Horizn" className="h-10" /></a>
                    <a href="https://www.arcticai.co/" target="_blank" className="opacity-50 hover:opacity-100"><img src="/arctic_ai.png" alt="Arctic AI" className="h-10" /></a>
                    <a href="https://www.mikobyte.com/" target="_blank" className="opacity-50 hover:opacity-100 ml-2.5"><img src="/mikobyte.webp" alt="Mikobyte Solutions" className="h-10" /></a>
                </div>
            </div>
        </section>
    )
});

export default Home;