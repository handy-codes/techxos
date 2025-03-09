import FooterPage from "@/components/layout/Footer"
// import Topbar from "@/components/layout/Topbar"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Topbar /> */}
        {children}
    </>
  )
}

export default HomeLayout