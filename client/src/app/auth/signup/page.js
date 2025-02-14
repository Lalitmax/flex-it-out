 
import Navbar from "@/app/components/Navbar";
import SignupForm from "@/app/components/SignupForm";
 
export default function Page() {
    return (
        <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-14  pt-5">
            <Navbar />
            <SignupForm />
        </div>
    );
}
