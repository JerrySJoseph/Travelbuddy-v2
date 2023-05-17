import { Avatar, Button, Divider, Group, Tabs, Text, UnstyledButton } from '@mantine/core'
import { IconPhoto, IconMessageCircle, IconSettings, IconUsers, IconUserPlus } from '@tabler/icons'
import { getFollowers, getFollowing, unFollowUser } from 'data/api/relationships'
import { useAppContext } from 'data/context/app-context'
import { useModal } from 'data/context/modal-context'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { ShortProfile } from 'data/models/user'
import image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface FollowerFollowingListProps {
    userid: string
}

const FollowerFollowingList = ({ userid }: FollowerFollowingListProps) => {

    const [followers, setFollowers] = useState<ShortProfile[]>([])
    const [following, setFollowing] = useState<ShortProfile[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { setError } = useAppContext();

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            setFollowers(await getFollowers(userid))
            setFollowing(await getFollowing(userid))
        } catch (error) {
            setError((error as Error))
        } finally {
            setLoading(false);
        }
    }


    return (
        <Tabs variant='default' defaultValue="followers">
            <Tabs.List position='center' grow>
                <Tabs.Tab value="followers" icon={<IconUsers size="0.8rem" />}>Followers</Tabs.Tab>
                <Tabs.Tab value="following" icon={<IconUserPlus size="0.8rem" />}>Following</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="followers" pt="xs">
                {
                    followers.map((f, i) => <div key={f.id}>
                        <ListItem profile={f} />
                        {i <= followers.length - 1 &&
                            <Divider />}
                    </div>)

                }
            </Tabs.Panel>

            <Tabs.Panel value="following" pt="xs">
                {
                    following.map((f, i) => <div key={f.id}>
                        <ListItem profile={f}  showUnfollowButton/>
                        {i <= followers.length - 1 &&
                            <Divider />}
                    </div>)
                }
            </Tabs.Panel>

        </Tabs>
    )
}


interface ListItemProps {
    profile: ShortProfile,
    showUnfollowButton?:boolean
}
const ListItem = ({ profile,showUnfollowButton=false}: ListItemProps) => {
    const {push}=useRouter();
    const {closeModal}=useModal();

    const [loading,setLoading]=useState<boolean>(false);
    const {setError}=useAppContext();
    const {userProfile}=useUserProfile()

    async function handleUnfollow(e:any){
        try {
            e.stopPropagation();
            setLoading(true)
            await unFollowUser(profile.id)
        } catch (error) {
            setError((error as Error))
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className="py-2" role='button' onClick={()=>{
            push('/app/profile/'+profile.id)
            closeModal()
        }}>
                <div className="d-flex justify-content-between align-items-center">
                    <Group noWrap>
                        <Avatar src={profile.avatar} radius='xl'/>
                        <div>
                            <Text className='text-capitalize' m={0}>{profile.firstname} {profile.lastname}</Text>
                            <Text size="xs" color="dimmed">
                                @{profile.username}
                            </Text>
                        </div>

                    </Group>
                    {
                        showUnfollowButton &&
                        userProfile?.id==profile.id &&
                        <Button compact variant='outline' color='yellow' size='xs' onClick={handleUnfollow} loading={loading}>Unfollow</Button>
                    }
                </div>
            </div>
    )
}

export default FollowerFollowingList