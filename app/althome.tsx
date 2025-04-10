import { auth } from &quot;@clerk/nextjs/server&quot;;
import { redirect } from &quot;next/navigation&quot;;

export default async function Home() {
  const { userId } = auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect(&quot;/dashboard&quot;);
  }

  // If user is not authenticated, redirect to the home page in (home) group
  redirect(&quot;/(home)&quot;);
} 