import { Navigation } from './../components/landing/Navigation';
import { Hero } from './../components/landing/Hero';
import { Features } from './../components/landing/Features';
import { SystemFlow } from './../components/landing/SystemFlow';
import { CallToAction } from './../components/landing/CallToAction';
import { Footer } from './../components/landing/Footer';
import { HeartOff } from 'lucide-react';


const HomePage = ()=>{
return(
    <div className="min-h-screen w-[99vw] overflow-x-hidden bg-white">
        <Navigation/>
        <Hero/>
        <Features/>
        <SystemFlow/>
        <HeartOff/>
        <CallToAction/>
        <Footer/>
    </div>
    )
}
export default HomePage;