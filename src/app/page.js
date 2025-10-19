import Navheader from "@/app/components/Navheader";
import Cam from "@/app/components/Cam"
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen py-8">
      <div className="text-white space-y-8 px-4 max-w-2xl mx-auto">
        <Navheader />
        <Cam />
        <Footer />
      </div>
    </main>
  );
}
