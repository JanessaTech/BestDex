import SVGClose from "@/lib/svgs/svg_close"

type ReviewAddPositionProps = {
    closeDepositModal: () => void
}
const ReviewAddPosition: React.FC<ReviewAddPositionProps> = ({closeDepositModal}) => {
    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50">
            <div className="bg-zinc-800 rounded-xl p-4 border-[1px] border-zinc-500 flex gap-y-4 flex-col min-w-[300px]">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Review adding position</div>
                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer" onClick={closeDepositModal}/></div>
                </div>
                <div className="flex flex-col gap-y-4">
                    ddd
                </div>
            </div>
        </div>
    )
}

export default ReviewAddPosition