export default function Header(){
    return(
        <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto gap-2">

            <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary">
                <span className="w-3 h-3 rounded-full bg-white block" />
                </span>
                <span className="font-jost font-semibold text-xl tracking-tight text-brand-heading">
                clock it
                </span>
            </div>

            <nav className="flex items-center sm:gap-16 md:gap-16 gap-2 font-inter text-sm">
                <a href="/manager/dashboard" className="text-brand-muted underline underline-offset-4">Dashboard</a>
                <a href="/manager/staff" className="text-brand-muted underline underline-offset-4">Staff</a>
                <a href="/manager/settings" className="text-brand-heading font-medium underline underline-offset-4">Settings</a>
            </nav>

            <div>
                <a href="/auth/logout" className="text-sm text-brand-muted">
                    <button
                    className="border border-brand-heading h-10 w-24 md:mr-8 rounded font-inter font-semibold bg-brand-primary text-amber-50 hover:bg-brand-bg hover:text-brand-primary hover:border-brand-primary "
                >
                        Sign out
                    </button>
                </a>
            </div>

      </header>
    )
}