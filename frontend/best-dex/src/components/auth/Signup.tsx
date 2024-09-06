import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { SignupSchema } from "@/lib/schema"
import * as yup from "yup";
import Link from "next/link"

type SignupFormData = yup.InferType<typeof SignupSchema>

type SignupProps = {}

const Signup: React.FC<SignupProps> = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: yupResolver(SignupSchema)
      });
    return (
        <div className="text-zinc-600 grid grid-flow-row gap-3">
            <Input type="text" placeholder="Display Name" />
            <Input id="picture" type="file" />
            <div className="flex items-center">
                <Input type="checkbox" className="w-3 mr-2"/>
                <span className="text-xs">I have read and accept the <Link href="#" className="font-semibold">Term of Service</Link> and the <Link href="#" className="font-semibold">Term of Creator</Link> and confirm that I am at least 13 years old</span>
            </div>
            
            <Button type="submit">Sign Up</Button>
        </div>
    )
}

export default Signup