import FooterPage from &quot;@/components/layout/Footer&quot;
// import Topbar from &quot;@/components/layout/Topbar&quot;

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Topbar /> */}
        {children}
    </>
  )
}

export default HomeLayout