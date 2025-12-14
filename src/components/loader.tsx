import { Spinner } from "./ui/spinner";

export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen gap-3">
            <Spinner className="h-15 w-15 text-primary" />
            <h1 className="text-2xl font-bold">Please wait...</h1>
        </div>
    )
}