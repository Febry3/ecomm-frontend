"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/provider/theme-toggle"
import { TrailingCursor } from "@/components/auth/trailling-cursor"
import { CursorEye } from "@/components/auth/eye-cursor"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useLogin } from "@/services/api/auth-service"
import { useAuthStore } from "@/stores/auth-store"
import apiClient from "@/lib/api-client"

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ')

const loginSchema = z.object({
    email: z
        .email('Invalid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Must be at least 6 characters')
})

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const { mutate: login, isPending, isError, error } = useLogin()
    const { user } = useAuthStore()

    const onSubmit = async (values: LoginFormValues) => {
        login({ email: values.email, password: values.password })
    }

    const onTest =  async () => {
        const response = await apiClient.get("/test") 
        console.log(response)
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 font-sans">
            <TrailingCursor />
            <ThemeToggle />
            
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
                    {/* Left Column - Compact */}
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="flex items-center gap-3">
                            <CursorEye />
                            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                                <span className="text-sm font-medium text-primary">
                                    Welcome back!
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                Login to your account
                            </h1>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                                Enter your credentials below to access your dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Form Card */}
                    <div className="flex items-center justify-center">
                        <Card className="w-full bg-card/50 border-border backdrop-blur-xl shadow-lg rounded-lg">
                            {/* Hook up the form submission */}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <CardContent className="space-y-4 pt-6">
                                    {/* Google Button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-9 border-border hover:bg-muted text-foreground bg-transparent text-sm"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </Button>

                                    {/* Separator */}
                                    <div className="relative">
                                        <Separator className="bg-border" />
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                                            <span className="px-2 bg-card text-xs text-muted-foreground font-medium">
                                                or
                                            </span>
                                        </div>
                                    </div>

                                    {/* Form Fields - Compact Grid */}
                                    <div className="space-y-3 pt-2">
                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="email"
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="asep@example.com"
                                                {...register('email')}
                                                className={cn(
                                                    'bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-md h-8 text-sm',
                                                    errors.email
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : ''
                                                )}
                                            />

                                            {errors.email ? (
                                                <p className="text-xs text-red-500">
                                                    {errors.email.message}
                                                </p>
                                            ) : null}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="password"
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="admin123"
                                                {...register('password')}
                                                className={cn(
                                                    'bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-md h-8 text-sm',
                                                    errors.password
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : ''
                                                )}
                                            />
                                            {errors.password ? (
                                                <p className="text-xs text-red-500">
                                                    {errors.password.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-3 pt-4">
                                    {/* Primary Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-md shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                                    </Button>

                                    {/* test */}
                                    <Button onClick={onTest} type="button"> Test </Button>
                                    {/* Legal Text */}
                                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                                        By continuing, you agree to our{' '}
                                        <a
                                            href="#"
                                            className="text-foreground hover:text-primary underline"
                                        >
                                            Terms
                                        </a>{' '}
                                        &{' '}
                                        <a
                                            href="#"
                                            className="text-foreground hover:text-primary underline"
                                        >
                                            Privacy
                                        </a>
                                    </p>

                                    {/* Sign Up Link */}
                                    <div className="text-center text-xs">
                                        <span className="text-muted-foreground">
                                            Don't have an account?{' '}
                                        </span>
                                        <a
                                            href="/register"
                                            className="text-primary font-semibold hover:text-primary/80"
                                        >
                                            Sign up
                                        </a>
                                    </div>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}