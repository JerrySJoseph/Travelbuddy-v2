import { Avatar, Skeleton, Text } from '@mantine/core'
import { getShortProfile } from 'data/api/profile'
import { useModal } from 'data/context/modal-context'
import { ShortProfile } from 'data/models/user'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LikesBannerProps {
    likesIndex: string[]
}

const MAX_LIKE_DISPLAY = 3

const LikesBanner = ({ likesIndex }: LikesBannerProps) => {

    const [shortProfiles, setShortProfiles] = useState<ShortProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const { openModal } = useModal();

    useEffect(() => {
        fetchData()
    }, [likesIndex])

    async function fetchData() {
        const promises: Promise<ShortProfile>[] = []
        for (let i = 0; i < Math.min(likesIndex.length, MAX_LIKE_DISPLAY); i++) {
            promises.push(getShortProfile(likesIndex[i]))
        }
        const results = await Promise.all(promises)
        setShortProfiles(results)
    }

    function handleLikeListClick() {
        openModal({
            title: 'People who liked this post'
        })
    }

    if (loading)
        return <div className="d-flex">
            <Skeleton radius='xl' width={20} mr='sm' />
            <Skeleton radius='md' height={20} width='70%' />
        </div>

    return (
        <div className="d-flex">
            {
                shortProfiles.length > 0 &&
                <Avatar.Group spacing="xs" mr={7}>
                    {
                        shortProfiles.map(pr => <Avatar key={pr.id} src={pr.avatar} radius="xl" size='sm' />)
                    }
                </Avatar.Group>
            }
            {
                shortProfiles.length > 0 ?
                    <Text>liked by <Link href={`/app/profile/${shortProfiles[0].id}`}>{shortProfiles[0].username}</Link>
                        {likesIndex.length > 1 && <> and <a href='#' onClick={handleLikeListClick}> {likesIndex.length - 1} others</a></>}</Text> :
                    <Text size='xs' color='dimmed'>No likes yet</Text>
            }
        </div>

    )
}

export default LikesBanner