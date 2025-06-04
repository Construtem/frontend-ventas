import Sidebar from "@/components/admin/sideBar";
import Header from "@/components/admin/header";
import { VENDEDOR_SideBar} from "../../config/sidebar";
export default function Inicio({ children }) {
    return (
        <div className="flex h-screen">
            <Sidebar nav={VENDEDOR_SideBar}/>
            <div className="flex flex-col flex-1 relative">
                <Header />
                <main className="flex-1 pt-[80px] px-8 py-6 overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}