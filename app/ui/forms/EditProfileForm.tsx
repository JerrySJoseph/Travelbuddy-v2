import { Textarea, Button, TextInput, Avatar, FileInput, FileButton, Divider, Group, Alert } from '@mantine/core'
import { saveBio, updateProfile } from 'data/api/profile'
import { useModal } from 'data/context/modal-context'
import React, { useEffect, useState } from 'react'
import { bioValidator } from '../../Utils/validators/bioValidator'
import { UserProfile } from 'data/models/user'
import { IconUpload, IconX } from '@tabler/icons'
import { useAppContext } from 'data/context/app-context'

interface IEditProfileForm {
    profile: UserProfile
}

const EditProfileForm = ({ profile }: IEditProfileForm) => {
    const [firstname, setFirstname] = useState<string>(profile.firstname)
    const [lastname, setLastname] = useState<string>(profile.lastname)
    const [username, setUsername] = useState<string>(profile.username)
    const [email, setEmail] = useState<string>(profile.email)
    const [avatar, setAvatar] = useState<string>(profile.avatar)
    const [file, setFile] = useState<File | null>(null)

    const [firstnameError, setFirstnameError] = useState<string>('')
    const [lastnameError, setLastnameError] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)
    const [imageLoading, setImageLoading] = useState<boolean>(false)
    

    const { closeModal } = useModal()
    const {setError,setSuccess}=useAppContext()


    function validateFields() {
        if (firstname.length === 0 || firstname.length > 20) {
            setFirstnameError('Invalid Firstname')
            return false
        }

        if (lastname.length === 0 || lastname.length > 20) {
            setLastnameError('Invalid Lastname')
            return false
        }

        if (email.length === 0) {
            setEmail('Invalid Email')
            return false;
        }

        return true;
    }


    async function handleSave() {
        try {
            setLoading(true)
            if (!validateFields())
                return

            await updateProfile({
                firstname,
                lastname,
                email
            })
            setSuccess('Profile updated successfully')
            closeModal()

        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    function handleImageChange(f: File) {
        console.log('image changed')
        setImageLoading(true)
        setAvatar(URL.createObjectURL(f))
        setImageLoading(false)
    }


    return (
        <div className="row">
            
            <div className="col-12">
                <div className="d-flex w-100 justify-content-center">
                    <Avatar src={avatar} size='xl' radius='xl' />
                </div>
                <div className="d-flex w-100 justify-content-center mt-2">
                    <FileButton onChange={handleImageChange} accept="image/*">
                        {(props) => <Button {...props} loading={imageLoading} compact leftIcon={<IconUpload size={15} />}>Upload Image</Button>}
                    </FileButton>
                    <Button compact color='yellow' variant='outline' leftIcon={<IconX size={15} />} ml='lg' onClick={() => { setAvatar(profile.avatar) }}>Remove image</Button>
                </div>
                <Divider my='md' />
            </div>

            <div className="col-lg-6">
                <TextInput
                    label='Firstname'
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                    required
                    type='text'
                    error={firstnameError} />
            </div>
            <div className="col-lg-6">
                <TextInput
                    label='Lastname'
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    required
                    type='text'
                    error={lastnameError} />
            </div>
            <div className="col-lg-6 mt-2">
                <TextInput
                    label='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    type='email'
                    error={emailError} />
            </div>
            <div className="col-lg-6 mt-2">
                <TextInput
                    label='Username'
                    disabled
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    type='text' />
            </div>
            
            <div className="col-12">
                <Divider my='lg' />
            </div>

            <div className="d-flex justify-content-between">
                <Button color='gray' variant='outline' onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSave} loading={loading}>Save Profile</Button>
            </div>
        </div>
    )
}

export default EditProfileForm