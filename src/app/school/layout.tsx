import "@/components/navigation"
import NavigationSidebar from "@/components/navigation-sidebar"
import TopSidebar from "@/components/top-sidebar"

export default async function StudyLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <div className="flex h-screen flex-row overflow-hidden mx-auto ">
            <div className="flex-none w-72 m-2">
                <NavigationSidebar></NavigationSidebar>
            </div>
            <div className="flex flex-col grow overflow-y-auto p-2">
                <TopSidebar text=""></TopSidebar>
                <div className="grow overflow-y-auto mt-2 p-4 border-gray-50 shadow-[0_0_8px_rgba(0,0,0,0.25)]">{children}</div>
            </div>
        </div>
    )
}