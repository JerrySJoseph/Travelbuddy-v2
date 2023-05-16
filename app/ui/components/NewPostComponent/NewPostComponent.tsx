import { Avatar, Button, FileButton, Image, Text, Textarea } from '@mantine/core'
import { IconCamera, IconCaravan, IconLink, IconSend, IconTrash } from '@tabler/icons'
import { addPost } from 'data/api/post'
import { useAppContext } from 'data/context/app-context'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { TravelPlan } from 'data/models/user'
import { memo, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'


const NewPostComponent = () => {
    const { userProfile } = useUserProfile()

    const [text, setText] = useState<string>('')
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [travelPlan, setTravelPlan] = useState<TravelPlan>()
    const [loading, setLoading] = useState<boolean>(false)
    const { setSuccess } = useAppContext()

    


    async function handleSave() {
        setLoading(true)
        await addPost({
            images: imageFiles,
            text,
            travelPlan
        })
        setSuccess('Your new post has been added to your timeline')
        setLoading(false)
    }

    interface ImageListProps {
        files: File[]
    }
    const ImageList = memo(({ files }: ImageListProps) => {
        return <>
            {
                files.length > 0 &&
                <div className="col-12 row mt-4">
                    <div className="col-12 mb-2">
                        <Text color='dimmed'><IconCamera size={18} /> Attachments</Text>
                    </div>
                    {
                        files.map(img => (
                            <div className="col-lg-3 pb-4 text-center" key={uuid()}>
                                <Image src={URL.createObjectURL(img)} alt='uploaded image' withPlaceholder radius='lg' height={150}/>
                                <small className="text-muted">{img.name}</small>
                                <Button color='red' size='xs' variant='subtle' leftIcon={<IconTrash size={18} />} compact
                                    onClick={() => {
                                        setImageFiles(
                                            imageFiles.filter(f => f.name !== img.name)
                                        )
                                    }}
                                >Remove</Button>
                            </div>
                        ))
                    }
                </div>

            }
        </>
    })

    ImageList.displayName = 'imagelist'

    return (
        <div className="card p-3 rounded-4">
            <div className="row">

                <div className="col-12 d-flex">
                    <Avatar src={userProfile?.avatar} size='lg' radius='xl' mr='md' />
                    <div className="w-100">
                        <Textarea size='md' className='w-100' mb='xs' value={text} onChange={e => setText(e.target.value)} radius='lg' placeholder={`What's happening?`} />
                    </div>
                </div>
                <ImageList files={imageFiles}/>

                <div className="col-12">
                    <div className="col-12 mb-2">
                        <Text color='dimmed'><IconLink size={18} /> Add more to your post</Text>
                    </div>
                    <FileButton onChange={fs => setImageFiles([...imageFiles, ...fs])} accept="image/*" multiple>
                        {(props) => <Button {...props} variant='light' leftIcon={<IconCamera size={18} />} radius='xl'>Add Image</Button>}
                    </FileButton>

                    <Button variant='light' leftIcon={<IconCaravan size={18} />} radius='xl' color='red' ml='md'>Add Travel Plan</Button>
                    <Button variant='filled' leftIcon={<IconSend size={18} />} radius='xl' className='float-end' loading={loading} onClick={handleSave}>Post</Button>
                </div>

            </div>
        </div>
    )
}

export default NewPostComponent