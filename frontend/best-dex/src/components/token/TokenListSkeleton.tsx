import { Skeleton } from "@/components/ui/skeleton"

type TokenListSkeletonProps = {
    index: number
}
const TokenListSkeleton = ({index}: TokenListSkeletonProps) => {
    return (
        <li key={index} className="flex items-center p-2 rounded-lg">
            <Skeleton className="h-[32px] w-[32px] rounded-full" />
            <div className="ml-3 w-full">
                <Skeleton className="h-[40px] w-1/2" />
            </div>
        </li>
    )

}

export default TokenListSkeleton