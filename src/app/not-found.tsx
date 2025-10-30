import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="relative min-h-screen min-w-screen bg-background flex justify-center items-center">
            <div className="absolute pointer-events-none">
                <p className="text-[12rem] md:text-[15rem] font-semibold opacity-25">404</p>
            </div>
            <div className="text-center mt-35">
                <h1 className="text-2xl md:text-3xl font-bold">Page not found.</h1>
                <p>Sorry, we can't find the page you're looking for.</p>
                <Button asChild type="button" className="mt-6"><a href="/">Back to Home</a></Button>
            </div>
        </div>
    )
}