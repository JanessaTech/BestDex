import Menu from "./Menu";

type MobileMenuProps = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}
const MobileMenu: React.FC<MobileMenuProps> = ({show, setShow}) => {
    return (
        <div className={`fixed top-0 left-0 w-full h-screen bg-black ${show ? '' : 'hidden'}`}>
            <div className="main-margin">
                <div className="h-16 flex justify-end items-center">
                    <svg 
                        onClick={() => setShow(false)}
                        className="w-7 h-7 hover:bg-zinc-700 rounded-full p-1 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
                <Menu isMin={false} setShow={setShow}/>
            </div>

        </div>
    )
}

export default MobileMenu