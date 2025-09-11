import SVGClose from "@/lib/svgs/svg_close"
import SVGRefresh from "@/lib/svgs/svg_refresh"

type RefreshDialogProps = {
    closeRefreshModal: () => void
}
const RefreshDialog:React.FC<RefreshDialogProps> = ({closeRefreshModal}) => {
    return (
        <div>
            <div className="fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50">
            <div className="bg-zinc-800 rounded-xl p-4 border-[1px] border-zinc-500 flex gap-y-4 flex-col min-w-[300px]">
                <div className="flex justify-end items-center">
                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer" onClick={closeRefreshModal}/></div>
                </div>
                <div className="flex justify-center items-center mb-10 text-sm">
                    <span>Please refresh by clicking</span>
                    <SVGRefresh className="size-6 text-pink-600 px-1"/>
                    <span>button on the top</span>
                </div>
            </div>
        </div>
        </div>
    )
}

export default RefreshDialog