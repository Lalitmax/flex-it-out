 
import LoginForm from "@/app/components/LoginForm";
import Navbar from "@/app/components/Navbar";
 
export default function Page() {
    return (
        <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-14  pt-5">
            <Navbar />
            <LoginForm />
        </div>
    );
}
