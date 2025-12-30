"use client"

import { useEffect, useRef } from "react"
import { redirect, useParams, useRouter } from "next/navigation"
import { useJoinGroupBuySession } from "@/services/api/group-buy-service"
import { Loader2 } from "lucide-react"

export default function GroupBuyJoinPage() {
    const { sessionCode } = useParams<{ sessionCode: string }>()
    const router = useRouter()
    const { mutate: joinSession } = useJoinGroupBuySession()

    const hasJoined = useRef(false)

    useEffect(() => {
        if (!sessionCode || hasJoined.current) {
            return
        } else {
            joinSession(sessionCode)
            hasJoined.current = true
        }

    }, [sessionCode, joinSession])


    if (hasJoined.current) {
        redirect(`/group-buy/${sessionCode}`)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold text-foreground">Joining Group Buy Session...</h1>
                <p className="text-muted-foreground text-sm">Please wait while we secure your spot.</p>
            </div>
        </div>
    )
}
