
export default function Navbar(){
    return(
        <div>
            <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto border-b border-black/10">
                <div className="flex items-center gap-2">
                    <span
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-primary"
                    >
                        <span className="w-4 h-4 rounded-full bg-white block" />
                    </span>
                    <span className="font-jost font-semibold text-2xl tracking-tight">
                        clock it
                    </span>
                </div>
                <a href="/auth/login">
                <button
                    className="border border-brand-heading h-10 w-24 md:mr-8 rounded font-inter font-semibold bg-brand-primary text-amber-50 hover:bg-brand-bg hover:text-brand-primary hover:border-brand-primary "
                >
                    Sign In
                </button>
                </a>
            </header>
        </div>
    )
}