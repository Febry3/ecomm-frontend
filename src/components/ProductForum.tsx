"use client"

import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Reply, Send, CornerDownRight, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"

interface CommentUser {
    uid: string
    displayName: string
    photoURL: string
}

interface Comment {
    id: string
    parentId: string | null
    content: string
    author: CommentUser
    createdAt: Timestamp | null
}

export default function GenericForum() {
    const { user: appUser } = useAuthStore()
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    // New submission loading state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Auth State Listener (Firebase)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    // Effective User (App User or Firebase User)
    const effectiveUser = appUser ? {
        uid: String(appUser.user_id),
        displayName: appUser.username,
        photoURL: appUser.profile_url || "",
    } : user ? {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
    } : null

    // Real-time Comments Listener
    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const fetchedComments: Comment[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Comment[]
                setComments(fetchedComments)
                setLoading(false)
                setError(null)
            },
            (err) => {
                console.error("Firestore Error:", err)
                if (err.code === 'permission-denied') {
                    setError("Missing permissions. Please update Firestore Rules.")
                } else if (err.code === 'failed-precondition') {
                    setError("Missing Index. Check browser console for the creation link.")
                } else {
                    setError(`Error: ${err.message} (${err.code})`)
                }
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    const handleAddComment = async (parentId: string | null = null, content: string) => {
        if (!effectiveUser || !content.trim() || isSubmitting) return

        setIsSubmitting(true)

        try {
            await addDoc(collection(db, "comments"), {
                parentId,
                content: content.trim(),
                author: {
                    uid: effectiveUser.uid,
                    displayName: effectiveUser.displayName,
                    photoURL: effectiveUser.photoURL,
                },
                createdAt: serverTimestamp(),
            })

            // Reset inputs
            if (parentId) {
                setReplyingTo(null)
                setReplyContent("")
            } else {
                setNewComment("")
            }
        } catch (error) {
            console.error("Error adding comment: ", error)
        } finally {
            setIsSubmitting(false)
        }
    }


    // Group comments: Top-level vs Replies
    const topLevelComments = comments.filter((c) => c.parentId === null)
    const getReplies = (parentId: string) =>
        comments.filter((c) => c.parentId === parentId).sort((a, b) => {
            // Sort replies chronological (oldest first usually makes sense for threads, but newest first is also fine. Let's do oldest first for readability)
            const timeA = a.createdAt?.toMillis() || 0
            const timeB = b.createdAt?.toMillis() || 0
            return timeA - timeB
        })

    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return "Just now"
        return new Date(timestamp.toMillis()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-destructive">
                <p className="font-semibold">Error Loading Forum</p>
                <p className="text-sm text-center px-4">{error}</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 font-sans text-foreground">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">Product Discussion</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {comments.length}
                </span>
            </div>

            {/* New Top-Level Comment Input */}
            {effectiveUser ? (
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={effectiveUser.photoURL || ""} alt={effectiveUser.displayName || "User"} />
                        <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 gap-2">
                        <Textarea
                            placeholder="Ask a question or share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={isSubmitting}
                            className="bg-card/50 min-h-[100px] border-muted resize-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handleAddComment(null, newComment)}
                                disabled={!newComment.trim() || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Post Comment
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <Card className="bg-muted/30 border-dashed border-muted">
                    <CardContent className="flex flex-col items-center py-6 text-center text-muted-foreground">
                        <p>Sign in to join the discussion</p>
                        {/* Placeholder for real Login trigger if available */}
                    </CardContent>
                </Card>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {topLevelComments.map((comment) => {
                    const replies = getReplies(comment.id)
                    const isReplying = replyingTo === comment.id

                    return (
                        <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Main Comment */}
                            <div className="flex gap-4">
                                <Avatar className="h-10 w-10 border border-border mt-1">
                                    <AvatarImage src={comment.author.photoURL} />
                                    <AvatarFallback>{comment.author.displayName?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground">
                                                {comment.author.displayName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                • {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground/90">
                                        {comment.content}
                                    </p>

                                    {/* Action Bar */}
                                    <div className="flex items-center gap-4 pt-1">
                                        {effectiveUser && (
                                            <button
                                                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                <Reply className="h-3 w-3" />
                                                Reply
                                            </button>
                                        )}
                                    </div>

                                    {/* Reply Input */}
                                    {isReplying && (
                                        <div className="mt-4 flex gap-3 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex-1">
                                                <Textarea
                                                    autoFocus
                                                    placeholder={`Reply to ${comment.author.displayName}...`}
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    disabled={isSubmitting}
                                                    className="bg-card/50 min-h-[80px] text-sm disabled:opacity-50"
                                                />
                                                <div className="mt-2 flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setReplyingTo(null)}
                                                        disabled={isSubmitting}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAddComment(comment.id, replyContent)}
                                                        disabled={!replyContent.trim() || isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                                Posting...
                                                            </>
                                                        ) : (
                                                            "Reply"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Replies List */}
                                    {replies.length > 0 && (
                                        <div className="relative mt-4 space-y-4 pl-6">
                                            {/* Vertical Line Connector */}
                                            <div className="absolute left-0 top-0 bottom-4 w-px bg-border group-hover:bg-border/80 transition-colors" />

                                            {replies.map((reply) => (
                                                <div key={reply.id} className="relative flex gap-3">
                                                    {/* Curve Connector */}
                                                    <CornerDownRight className="absolute -left-6 top-2 h-4 w-4 text-border" />

                                                    <Avatar className="h-8 w-8 border border-border mt-0.5">
                                                        <AvatarImage src={reply.author.photoURL} />
                                                        <AvatarFallback>{reply.author.displayName?.[0] || "?"}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {reply.author.displayName}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDate(reply.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground/90">
                                                            {reply.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {topLevelComments.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No comments yet. Be the first to start the conversation!
                    </div>
                )}
            </div>
        </div>
    )
}
