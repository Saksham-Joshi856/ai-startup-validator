import { useMemo } from "react"
import { User } from "@supabase/supabase-js"

interface AvatarProps {
    user: User | null
    size?: "sm" | "md" | "lg"
    className?: string
}

const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
}

const getInitials = (fullName: string | undefined, email: string | undefined): string => {
    if (fullName) {
        return fullName
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }
    if (email) {
        return email.charAt(0).toUpperCase()
    }
    return "?"
}

const getBackgroundColor = (email: string | undefined): string => {
    if (!email) return "bg-primary/20"

    // Generate a consistent color based on email
    const colors = [
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-purple-500 to-purple-600",
        "bg-gradient-to-br from-pink-500 to-pink-600",
        "bg-gradient-to-br from-green-500 to-green-600",
        "bg-gradient-to-br from-orange-500 to-orange-600",
        "bg-gradient-to-br from-red-500 to-red-600",
    ]
    const index = email.charCodeAt(0) % colors.length
    return colors[index]
}

export function UserAvatar({ user, size = "md", className = "" }: AvatarProps) {
    const fullName = user?.user_metadata?.full_name as string | undefined
    const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

    const initials = useMemo(() => getInitials(fullName, user?.email), [fullName, user?.email])
    const bgColor = useMemo(() => getBackgroundColor(user?.email), [user?.email])

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={fullName || user?.email || "User"}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary/20 ${className}`}
            />
        )
    }

    return (
        <div
            className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white border-2 border-primary/20 ${className}`}
        >
            {initials}
        </div>
    )
}
