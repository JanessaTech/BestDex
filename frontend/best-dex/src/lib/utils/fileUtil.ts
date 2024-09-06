import getConfig from "@/config"

const config = getConfig()

export function isFileImage(file: File) {
    const acceptedImageTypes = config.multer.acceptedImageTypes
    return file && acceptedImageTypes.includes(file['type'])
}