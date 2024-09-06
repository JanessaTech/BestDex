import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { SignupSchema } from "@/lib/schema"
import logger from "@/lib/logger"
import * as yup from "yup";
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { isFileImage } from "@/lib/utils/fileUtil"
import getConfig from "@/config"

const config = getConfig()

type SignupFormData = yup.InferType<typeof SignupSchema>

type SignupProps = {}
type SignupStateProps = {
    name: string,
    intro: string,
    checked: boolean,
    selectedFile: File | undefined,
    fileError: string
}
//todo: enhance schema to support validating file
const Signup: React.FC<SignupProps> = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupFormData>({
        resolver: yupResolver(SignupSchema)
      });
    const [state, setState] = useState<SignupStateProps>({
        name: '',
        intro: '',
        checked: false,
        selectedFile: undefined, 
        fileError: ''
    })

    useEffect(() => {
        console.log(errors)
    })

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        setState({...state, [e.target.name]: e.target.value})
    }

    const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, 'checked': !state.checked})
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        logger.debug('[Signup] onFileChange')
        const file = e?.target?.files && e?.target?.files.length > 0 ?  e?.target.files[0] : undefined

        try {
            validateFile(file)
        } catch (e: any) {
            setState({...state, fileError: e.message})
        }
    }

    const validateFile = (file: File | undefined) => {
        if (!file) {
            throw new Error('Please choose an image. We support png, jpg and gif only')
        }
        logger.debug('[Signup] file name:', file?.name)
        logger.debug('[Signup] file type:', file?.type)
        logger.debug('[Signup] file size:', file?.size)
        if (file && !isFileImage(file)) {
            throw new Error('Please choose an image. We support png, jpg and gif only')
        }
        if (file && file.size > config.multer.profileSize) {
            throw new Error('The file chosen should be less than 1M')
        }
        setState({...state, selectedFile: file, fileError: ''})
    }

    const onSignup = (data: SignupFormData) => {
        logger.debug(data)
        try {
            validateFile(state.selectedFile)
        } catch (e: any) {
            setState({...state, fileError: e.message})
        }
    }

    const handleClear = () => {
        reset()
        setState({
            name: '',
            intro: '',
            checked: false,
            selectedFile: undefined, 
            fileError: ''})
    }
    return (
        <div>
            <form 
                onSubmit={handleSubmit(onSignup)}
                noValidate
                autoComplete="off"
                encType='multipart/form-data'
                className="text-zinc-600 grid grid-flow-row gap-1">
                    <div>
                        <Input 
                            id='name'
                            type="text" 
                            value={state.name}
                            {...register('name')}
                            placeholder="Display Name" 
                            onChange={handleInputChanges}
                            className={`focus-visible:ring-offset-0 focus-visible:ring-0 ${errors?.name ? 'focus-visible:border-red-500' : 'focus-visible:border-sky-600'}`}/>
                        <div className={`text-xs h-4 text-red-600 ${errors?.name ? 'visible' : 'invisible'}`}>{errors?.name?.message}</div>
                    </div>
                <div>
                    <Input 
                        id="profile" 
                        type="file"
                        onChange={onFileChange}
                        className="focus-visible:ring-offset-0 focus-visible:ring-sky-600 focus-visible:ring-0"/>
                    <div className={`text-xs h-4 text-red-600 ${state.fileError ? 'visible' : 'invisible'}`}>{state.fileError}</div>
                </div>
                
                <div>
                    <Textarea 
                        id='intro'
                        value={state.intro}
                        {...register('intro')}
                        placeholder="Introduce yourself" 
                        onChange={handleInputChanges}
                        className={`focus-visible:ring-offset-0 focus-visible:ring-0 ${errors?.intro ? 'focus-visible:border-red-500' : 'focus-visible:border-sky-600'}`}/>
                    <div className={`text-xs h-4 text-red-600 ${errors?.intro ? 'visible' : 'invisible'}`}>{errors?.intro?.message}</div>
                </div>
                <div>
                    <div className="flex items-center">
                        <Input 
                            id='checked'
                            type="checkbox" 
                            checked={state.checked}
                            {...register('checked')}
                            onChange={handleCheckBoxChange}
                            className="w-3 mr-2 focus-visible:ring-offset-0 focus-visible:ring-sky-600 focus-visible:ring-0"/>
                        <span className="text-xs">I have read and accept the <Link href="#" className="font-semibold">Term of Service</Link> and the <Link href="#" className="font-semibold">Term of Creator</Link> and confirm that I am at least 13 years old</span>
                    </div>
                    <div className="text-xs h-4 text-red-600">{errors?.checked?.message}</div>
                </div>
                
                <Button 
                    type="submit" 
                    className="bg-sky-700 hover:bg-sky-600 active:bg-sky-500 focus-visible:ring-offset-0 focus-visible:ring-sky-600 focus-visible:ring-1">Sign Up</Button>
                <Button variant='outline' onClick={handleClear}>Clear</Button>
            </form>
            
        </div>
    )
}

export default Signup