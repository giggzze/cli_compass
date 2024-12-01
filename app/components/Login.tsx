import { SignInButton } from "@clerk/nextjs";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Welcome to CLI Compass
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your command line tools
                    </p>
                    <SignInButton>
                        <button className="w-full mw-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                            Sign in
                        </button>
                    </SignInButton>
                </div>
                <div className="mt-8">
                </div>
            </div>
        </div>
    )
}