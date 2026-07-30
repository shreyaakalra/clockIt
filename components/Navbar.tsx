
export default function Navbar(){
    return(
        <div>
            <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary"
                    >
                        <span className="w-3 h-3 rounded-full bg-white block" />
                    </span>
                    <span className="font-jost font-semibold text-xl tracking-tight">
                        clock it
                    </span>
                </div>
                <a href="/auth/login">
                <button
                    className="border-2 h-8 w-20 rounded font-inter hover:text-brand-primary font-semibold"
                >
                    Sign in
                </button>
                </a>
            </header>
        </div>
    )
}