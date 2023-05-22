import { ActionIcon, Avatar, Button, CloseButton, FileButton, Image, Text, Textarea, ThemeIcon } from '@mantine/core'
import { IconCamera, IconCar, IconCaravan, IconLink, IconSend, IconTrash } from '@tabler/icons'
import { getFormattedDate } from 'Utils/dateutils'
import { addPost } from 'data/api/post'
import { useAppContext } from 'data/context/app-context'
import { useModal } from 'data/context/modal-context'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { TravelPlan } from 'data/models/user'
import { memo, useEffect, useState } from 'react'
import { CreateTravelPlanForm } from 'ui/sections/CreateTravelPlanForm'
import { v4 as uuid } from 'uuid'


const NewPostComponent = ({ ...props }) => {
    const { userProfile } = useUserProfile()

    const [text, setText] = useState<string>('')
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [travelPlan, setTravelPlan] = useState<TravelPlan>()
    const [loading, setLoading] = useState<boolean>(false)
    const { setSuccess } = useAppContext()
    const { openModal, closeModal } = useModal()


    function resetFields() {
        setText(''),
            setImageFiles([]),
            setTravelPlan(undefined)
    }


    function handleAddTravelPlan() {
        openModal({
            title: 'Add travel Plan to your Post',
            content: <CreateTravelPlanForm onSave={tp => {
                setTravelPlan(tp)
                closeModal()
            }} />,
            size: 'lg'
        })
    }


    async function handleSave() {
        setLoading(true)
        await addPost({
            images: imageFiles,
            text,
            travelPlan: travelPlan || null
        })
        setSuccess('Your new post has been added to your timeline')
        setLoading(false)
        resetFields();
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
                                <Image src={URL.createObjectURL(img)} alt='uploaded image' withPlaceholder radius='lg' height={150} />
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

    const TravelPlanItem = () => {
        if (!travelPlan)
            return <></>
        return (
            <div className="card p-2">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <ThemeIcon>
                            <IconCar size={18} />
                        </ThemeIcon>
                        <div className='ms-2 lh-1'>
                            <strong className='text-capitalize m-0 p-0 fw-bold h6 text-muted'>{travelPlan.group.name}</strong>
                            <small className="text-muted m-0 p-0">  (created by {userProfile?.firstname})</small><br />
                            <small className="text-muted">Destinations: {travelPlan.destinations.map(d => d.name).join(', ')}</small><br />
                            <small className="text-muted">Dates: {getFormattedDate(travelPlan.travellingDateRange.start)} - {getFormattedDate(travelPlan.travellingDateRange.end)}</small><br />
                            <small className="text-muted m-0 p-0">{travelPlan.inviteMembers.length} invited</small><br />
                        </div>
                        
                    </div>
                    <CloseButton />
                </div>
            </div>
        )
    }

    return (
        <div {...props}>
            <div className="card p-3 rounded-4">
                <div className="row">

                    <div className="col-12 d-flex">
                        <Avatar src={userProfile?.avatar} size='lg' radius='xl' mr='md' />
                        <div className="w-100">
                            <Textarea size='md' className='w-100' mb='xs' value={text} onChange={e => setText(e.target.value)} radius='lg' placeholder={`What's happening?`} />
                        </div>
                    </div>
                    <ImageList files={imageFiles} />
                    {
                        travelPlan &&
                        <div className="col-12">
                            <Text color='dimmed' my='sm'><IconCar size={18} /> Travel Plans</Text>
                            <TravelPlanItem />
                        </div>
                    }
                    <div className="col-12">
                        <div className="col-12">
                            <Text color='dimmed' my='sm'><IconLink size={18} /> Add more to your post</Text>
                        </div>
                        <FileButton onChange={fs => setImageFiles([...imageFiles, ...fs])} accept="image/*" multiple>
                            {(props) => <Button {...props} variant='light' leftIcon={<IconCamera size={18} />} radius='xl'>Add Image</Button>}
                        </FileButton>

                        <Button variant='light' leftIcon={<IconCaravan size={18} />} radius='xl' color='red' ml='md' onClick={handleAddTravelPlan}>Add Travel Plan</Button>
                        <Button variant='filled' leftIcon={<IconSend size={18} />} radius='xl' className='float-end' loading={loading} onClick={handleSave}>Post</Button>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default NewPostComponent