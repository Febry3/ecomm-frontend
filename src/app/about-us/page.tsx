"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Award, Clock, Globe, Heart, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
    return (
        <div className="flex flex-col w-full min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full py-20 md:py-32 overflow-hidden bg-secondary/20">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            <Heart className="w-4 h-4 fill-current" />
                            <span>Passion for Quality</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                            Redefining the way you <span className="text-primary">shop online.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            We are dedicated to providing the best products with a seamless shopping experience.
                            Our journey is fueled by passion, innovation, and a commitment to our customers.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button size="lg" className="h-12 px-8 text-base rounded-full" asChild>
                                <Link href="/">Start Shopping</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-2 bg-background hover:bg-secondary/50" asChild>
                                <Link href="#our-story">Our Story</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-1/2 -right-20 md:-right-40 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </section>

            {/* Stats Section */}
            <section className="py-12 border-b bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Happy Customers", value: "10k+" },
                            { label: "Products Sold", value: "50k+" },
                            { label: "Years Experience", value: "5+" },
                            { label: "Team Members", value: "20+" },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center justify-center text-center space-y-2">
                                <span className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
                                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section id="our-story" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-secondary/30 border-4 border-background shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder for a real team/office image */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20">
                                <Image
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Our Team"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
                                <div className="w-20 h-1.5 bg-primary rounded-full" />
                            </div>
                            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                                <p>
                                    Founded in 2024, our ecommerce platform began with a simple idea: to make high-quality products accessible to everyone.
                                    What started as a small garage operation has grown into a trusted destination for thousands of shoppers.
                                </p>
                                <p>
                                    We believe that shopping should be more than just a transaction; it should be an experience.
                                    That's why we meticulously curate our catalog, ensuring that every item meets our strict standards for quality and sustainability.
                                </p>
                                <p>
                                    Today, we are proud to serve a global community of customers who share our values.
                                    As we look to the future, our mission remains the same: to innovate, inspire, and deliver excellence in everything we do.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20">
                                    <div className="p-2 rounded-lg bg-background text-primary shadow-sm">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground">Quality First</span>
                                        <span className="text-xs text-muted-foreground">Certified products</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20">
                                    <div className="p-2 rounded-lg bg-background text-primary shadow-sm">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground">Community</span>
                                        <span className="text-xs text-muted-foreground">Customer focused</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Why Choose Us */}
            <section className="py-20 md:py-32 bg-secondary/10">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose Us?</h2>
                        <p className="text-muted-foreground text-lg">
                            We don't just sell products; we deliver a promise of quality, reliability, and exceptional service.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Secure Payments",
                                description: "Your transactions are always safe with our state-of-the-art encryption and security protocols."
                            },
                            {
                                icon: Clock,
                                title: "Fast Delivery",
                                description: "We understand that you want your products fast. Our logistics network ensures timely delivery."
                            },
                            {
                                icon: Globe,
                                title: "Global Shipping",
                                description: "No matter where you are, we bring our products to your doorstep with our international shipping partners."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-background border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-24 text-center text-primary-foreground shadow-2xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                            </svg>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                                Ready to experience the difference?
                            </h2>
                            <p className="text-primary-foreground/80 text-lg md:text-xl">
                                Join thousands of satisfied customers and start your shopping journey with us today.
                            </p>
                            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all" asChild>
                                <Link href="/">Explore Products <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
