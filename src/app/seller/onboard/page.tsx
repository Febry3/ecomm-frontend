"use client"

import { ConstellationBackground } from "@/components/seller/onboard-background"
import { FloatingParticles } from "@/components/seller/floating-particles"
import { CountUp } from "@/components/seller/count-up"

export default function SellerOnboardingPage() {
    return (
        <div className="min-h-screen bg-background relative">
            <ConstellationBackground />
            <FloatingParticles />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-border">
                {/* Background gradient orbs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

                <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <span className="text-sm text-primary font-medium">New: Group Buy Feature Available</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-balance mb-6">
                            Start selling and <span className="text-primary">reach millions</span> of customers
                        </h1>

                        <p className="text-xl text-muted-foreground text-balance mb-10 max-w-2xl mx-auto">
                            Join thousands of sellers on LootBox. Grow your business with powerful tools, zero upfront costs, and
                            dedicated support.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="/seller/register"
                                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Start Selling Now
                            </a>
                            <button className="px-8 py-4 bg-background border border-border rounded-lg font-semibold hover:bg-accent/50 transition-colors">
                                Learn More
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground mt-6">
                            Free to start • Only pay when you sell • Low Transaction Fees
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-b border-border relative">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <CountUp end={10} suffix="M+" className="text-4xl lg:text-5xl font-bold text-primary mb-2" />
                            <div className="text-muted-foreground">Active Buyers</div>
                        </div>
                        <div className="text-center">
                            <CountUp end={500} suffix="K+" className="text-4xl lg:text-5xl font-bold text-primary mb-2" />
                            <div className="text-muted-foreground">Sellers</div>
                        </div>
                        <div className="text-center">
                            <CountUp end={98} suffix="%" className="text-4xl lg:text-5xl font-bold text-primary mb-2" />
                            <div className="text-muted-foreground">Satisfaction Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-muted-foreground">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why sell on LootBox?</h2>
                        <p className="text-xl text-muted-foreground">Everything you need to grow your business</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Zero Startup Costs</h3>
                            <p className="text-muted-foreground">
                                Start selling for free. No monthly fees, no hidden charges. Only pay a small commission when you make a
                                sale.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Reach Millions</h3>
                            <p className="text-muted-foreground">
                                Access to over 10 million active buyers across Indonesia looking for products like yours.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
                            <p className="text-muted-foreground">
                                Get paid quickly and securely. We handle all payment processing and protect both buyers and sellers.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Group Buy Feature</h3>
                            <p className="text-muted-foreground">
                                Boost sales with our unique group buying feature. Let customers team up for better deals and bigger
                                orders.
                            </p>
                        </div>

                        {/* Benefit 5 */}
                        <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Powerful Analytics</h3>
                            <p className="text-muted-foreground">
                                Track your sales, understand your customers, and grow your business with comprehensive analytics tools.
                            </p>
                        </div>

                        {/* Benefit 6 */}
                        <div className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
                            <p className="text-muted-foreground">
                                24/7 seller support team ready to help you succeed. Get answers fast and keep your business running
                                smoothly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 lg:py-32 bg-accent/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">How it works</h2>
                        <p className="text-xl text-muted-foreground">Start selling in 3 simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6">
                                    1
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Register Your Store</h3>
                                <p className="text-muted-foreground">
                                    Fill in your store details and upload your KTP. It takes less than 5 minutes to get started.
                                </p>
                            </div>
                            {/* Arrow */}
                            <div className="hidden md:block absolute top-8 left-full w-full">
                                <svg className="w-full h-8 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 100 20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h85m0 0l-5-5m5 5l-5 5" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6">
                                    2
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Add Your Products</h3>
                                <p className="text-muted-foreground">
                                    Upload product photos, set prices, and add descriptions. Our tools make it easy to showcase your
                                    items.
                                </p>
                            </div>
                            {/* Arrow */}
                            <div className="hidden md:block absolute top-8 left-full w-full">
                                <svg className="w-full h-8 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 100 20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h85m0 0l-5-5m5 5l-5 5" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6">
                                    3
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Start Selling</h3>
                                <p className="text-muted-foreground">
                                    Your store is live! Manage orders, track sales, and grow your business with our seller dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to start your selling journey?</h2>
                    <p className="text-xl text-muted-foreground mb-10">
                        Join thousands of successful sellers on LootBox today. No credit card required.
                    </p>
                    <a
                        href="/seller/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg"
                    >
                        Create Your Store Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </section>
        </div>
    )
}
