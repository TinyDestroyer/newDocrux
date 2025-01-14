"use client"
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  const scrollToDiv = () => {
    document.getElementById('features')!.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  return (
    <main className="flex flex-col items-center justify-center bg-black p-5 gap-10">
      <div className="flex flex-col items-center justify-center gap-6 space-y-6 text-center mt-5">
        <div className="flex flex-col gap-1">
          <h1
            className={cn(
              "text-6xl font-semibold text-white drop-shadow-md mt-4",
              font.className
            )}
          >
          Welcome To DOCRUX
          </h1>
          <p className="text-gray-400 text-xs">Engage with your PDFs like never before. Our Chat assistant simplifies your document interaction</p>
        </div>
        <div>
          <LoginButton asChild>
            <Button className="mx-2 w-64" variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
          <Button className="mx-2 bg-black border border-gray-500 w-64" size="lg" onClick={scrollToDiv}>Learn More</Button>
        </div>
        <img className="w-2/3 rounded-lg" src="./landingPage_img-1.jpg" alt="Landing Page Image" />
      </div>
      <div id="features" className="flex flex-col justify-center items-center w-full p-4 text-white h-screen">
        <div className="mb-10 space-y-2">
          <h1 className="text-5xl font-semibold text-white drop-shadow-md mt-4">Explore Our Features</h1>
          <p className="text-gray-400 text-sm text-center">Your PDF Companion</p>
        </div>
        <div className="flex justify-center gap-16 w-full">
          <div className="flex flex-col items-start gap-2 w-1/5 border border-gray-600 rounded-lg p-1">
            <div className="flex flex-col gap-3 items-start p-2 h-full">
              <p className="text-xs text-gray-500 mt-2">Instant PDF Assistance</p>
              <h3 className="text-xl">Chat with AI for quick insights.</h3>
              <p className="text-xs text-gray-300 mt-auto">Get answers to your PDF queries effortlessly.</p>
              <button className="text-xs text-gray-500">Start Now</button>
            </div>
            <img src="./talking.png" alt="Friends Talking Image" className="border rounded-lg" />
          </div>
          <div className="flex flex-col items-start gap-2 w-1/5 border border-gray-600 rounded-lg p-1">
            <div className="flex flex-col gap-3 items-start p-2 h-full">
              <p className="text-xs text-gray-500 mt-2">Transform Your PDF Experience</p>
              <h3 className="text-xl">Effortless PDF Management</h3>
              <p className="text-xs text-gray-300 mt-auto">Upload,chat,and manage your PDFs seamlessly.</p>
              <button className="text-xs text-gray-500">Get Started</button>
            </div>
            <img src="./working-2.png" alt="Friends Talking Image" className="border rounded-lg" />
          </div>
          <div className="flex flex-col items-start gap-2 w-1/5 border border-gray-600 rounded-lg p-1">
            <div className="flex flex-col gap-3 items-start p-2 h-full">
              <p className="text-xs text-gray-500 mt-2">Your PDFs Simplified</p>
              <h3 className="text-xl">Chat With our AI for instant help.</h3>
              <p className="text-xs text-gray-300 mt-auto">Experience the future of document interaction.</p>
              <button className="text-xs text-gray-500">Join the Conversation</button>
            </div>
            <img src="./working.png" alt="Friends Talking Image" className="border rounded-lg" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full p-4 text-white h-screen">
        <div className="mb-10 space-y-2">
          <h1 className="text-5xl font-semibold text-white drop-shadow-md mt-4">How It Works</h1>
          <p className="text-gray-400 text-sm text-center">Simple Guide to using our Chat assistant</p>
        </div>
        <div className="flex justify-center items-start gap-16">
          <div className="flex flex-col justify-center items-center gap-2 w-1/5">
            <img src="3-friends.png" alt="friends-talking" />
            <p className="text-xs text-purple-700">Step 1</p>
            <h1 className="text-xl">Step 1</h1>
            <p className="text-xs text-gray-400 text-center">Upload your PDF files easily.</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 w-1/5">
            <img src="collegues.png" alt="" />
            <p className="text-xs text-purple-700">Step 3</p>
            <h1 className="text-xl">Step 2</h1>
            <p className="text-xs text-gray-400 text-center">Engage in a chat for insights.</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 w-1/5">
            <img src="coffee.png" alt="" />
            <p className="text-xs text-purple-700">Step 3</p>
            <h1 className="text-xl">Step 3</h1>
            <p className="text-xs text-gray-400 text-center">Get instant answers and manage your documents.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
