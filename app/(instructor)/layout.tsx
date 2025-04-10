import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;

// import Topbar from &quot;@/components/layout/Topbar&quot;;
import Sidebar from &quot;@/components/layout/Sidebar&quot;;

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth()

  if (!userId) {
    return redirect(&quot;/sign-in&quot;)
  }

  return (
    <div className="h-full flex flex-col&quot;>
      {/* <Topbar /> */}
      <div className=&quot;flex-1 flex&quot;>
        <Sidebar />
        <div className=&quot;flex-1">{children}</div>
      </div>
    </div>
  );
};

export default InstructorLayout;
