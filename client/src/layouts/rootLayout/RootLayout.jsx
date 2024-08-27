import { Link, Outlet } from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, UserButton } from "@clerk/clerk-react";
import "./rootLayout.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <QueryClientProvider client={queryClient}>
                <div className="rootLayout">
                    <header>
                        <Link to="/" className="logo">
                            <img src="/artificial-intelligence.png" alt="LOGO" />
                            <span>TOPV AI</span>
                        </Link>
                        <div className="user">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </QueryClientProvider>
        </ClerkProvider>
    )
}

export default RootLayout