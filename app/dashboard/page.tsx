import { RedirectToSignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>Welcome, {user?.firstName}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}
