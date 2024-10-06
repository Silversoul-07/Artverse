import AuthPage from "@/components/AuthPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create an account",
};

export default function SignupPage() {
    return <AuthPage formType="signup" />;
}