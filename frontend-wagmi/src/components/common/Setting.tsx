import SVGSetting from "@/lib/svgs/svg_setting"

type SettingProps = {}
const Setting:React.FC<SettingProps> = () => {
    return (
        <div>
            <SVGSetting className="w-6 h-6 cursor-pointer hover:text-pink-600"/>
        </div>
    )
}

export default Setting