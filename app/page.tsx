import { SignIn } from '@clerk/nextjs';

export default async function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <SignIn
          forceRedirectUrl='/dashboard'
          fallbackRedirectUrl='/dashboard'
          signUpForceRedirectUrl='/dashboard'
          signUpFallbackRedirectUrl='/dashboard'
          routing='hash'
        />
      </main>
    </div>
  );
}
