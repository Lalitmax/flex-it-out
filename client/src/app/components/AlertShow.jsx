"uce client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function AlertShow({ myName,isRunning, remoteReps, repsCount,remoteUserName,timer, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [winnerName, setWinnerName] = useState();
    const [timeTaken, setTimeTaken] = useState();

    // Automatically open the dialog when `isRunning` is true
    useEffect(() => {
        if (isRunning) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }

        if(remoteReps < repsCount) {
            setWinnerName(myName);
            localStorage.setItem('timeTaken',timer);
            

        }else if(remoteReps ===repsCount){
            setWinnerName("tie!");
            localStorage.setItem('timeTaken',timer);

         

        }else {
            setWinnerName(remoteUserName);
            localStorage.setItem('timeTaken',timer);

       

        }
    }, [isRunning]);

    

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogTrigger asChild>
        {/* Hidden Button to trigger dialog */}
        <Button variant="outline" className="hidden">
            Show Dialog
        </Button>
    </AlertDialogTrigger>
    
    <AlertDialogContent className="p-6 rounded-2xl shadow-xl bg-white border border-gray-200">
        <AlertDialogHeader className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">🎉 Winner Announced! 🎉</h1>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-center mt-4">
            <h2 className="text-2xl font-semibold text-blue-600">
                {winnerName} 🥇
            </h2>
            <p className="text-lg text-gray-600 mt-2">
                Time Taken: <span className="font-medium text-gray-800">{localStorage.getItem('timeTaken')} ⏳</span>
            </p>
        </AlertDialogDescription>

        <AlertDialogFooter className="flex justify-center gap-4 mt-6">
            <AlertDialogCancel 
                onClick={onClose} 
                className="px-5 py-2.5 text-lg rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition-all"
            >
                Close
            </AlertDialogCancel>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

    );
}