import { Button } from 'antd'
import Image from 'next/image'

export default function Hero({isLoggedIn} : {isLoggedIn: boolean}){
    return(
        <section className="flex flex-col md:flex-row mt-12 p-12 gap-12 items-center justify-between max-w-7xl mx-auto">
            <div className="flex flex-col md:w-[38%] shrink-0">
                <div>
                    <p className="uppercase text-sm tracking-[0.2em] mb-4 text-brand-primary font-inter font-semibold">
                        Built for care teams
                    </p>
                    <h1 className="font-jost text-brand-heading leading-[1.05] text-5xl md:text-6xl font-semibold tracking-tight mb-6 ">
                        Every shift, exactly where it happened.
                    </h1>
                    <p className="text-lg mb-8 max-w-md text-brand-text">
                        Care workers clock in the moment they arrive on site. Managers see who&apos;s on shift, where, and for how long.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href={isLoggedIn ? "/launch" : "/auth/login"}>
                        <Button
                            type="primary"
                            size="large"
                            style={{ background: "#00AFAA", borderColor: "#00AFAA", fontFamily: "var(--font-inter)", fontWeight: 500 }}
                        >
                            {isLoggedIn ? "Go to dashboard" : "Get started"}
                        </Button>
                    </a>
                        {!isLoggedIn && <a href="/auth/login" className="text-sm font-medium underline underline-offset-4 text-brand-primary">
                            I already have an account
                        </a>}
                    </div>
                </div>
                <div>

                </div>
            </div>
            <div className="flex-1 w-full">
                <Image
                    src="/illustration2.png"
                    alt="illustration"
                    width={1500}
                    height={900}
                    className="w-full h-auto"
                />
            </div>
        </section>
    )
}