import { Textarea, Button } from '@mantine/core'
import { saveBio } from 'data/api/profile'
import { useModal } from 'data/context/modal-context'
import React, { useEffect, useState } from 'react'
import { bioValidator } from '../../Utils/validators/bioValidator'

interface IEditBioForm {
    bio: string
}

const EditBioForm = ({ bio = '' }: IEditBioForm) => {
    const [textInput, setTextInput] = useState<string>(bio)
    const [error, setError] = useState<string>('')
    const [loading,setLoading]=useState<boolean>(false)

    const { closeModal } = useModal()


    async function handleSave() {
        try {
            setLoading(true)
            bioValidator(textInput)
            await saveBio(textInput)
            closeModal()
        } catch (error) {
            setError((error as Error).message)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div>
            <Textarea
                placeholder="Write something about yourself..."
                label='Your Bio'
                value={textInput}
                error={error}
                onChange={e => setTextInput(e.target.value)}
                description='A short 200-character summary about yourself or your business, displayed to other users underneath your profile photo.'
            />
            <div className="d-flex justify-content-between mt-2">
                <Button variant='outline' color='gray' onClick={closeModal}>Cancel</Button>
                <Button variant='outline' onClick={handleSave} loading={loading}>Save Bio</Button>
            </div>
        </div>
    )
}

export default EditBioForm