import { Avatar, Group, MultiSelect, Text } from '@mantine/core';
import { getFollowers } from 'data/api/relationships';
import React, { forwardRef, useEffect, useState } from 'react';


interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
    value:string,
  }

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} />
                <div>
                    <Text>{label}</Text>
                    <Text size="xs" color="dimmed">
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

SelectItem.displayName = ''

const FollowersSelect = () => {

    const [followersList,setFollowersList]=useState<ItemProps[]>([])
    const [selectedIds,setSelectedIds]=useState<string[]>([])

    useEffect(()=>{
        fetchData()
    },[])

    async function fetchData(){
        const flist=await getFollowers()
        const temp:ItemProps[]=[]
        flist.forEach(f=>{
            temp.push({
                label:f.firstname,
                image:f.avatar,
                description:f.username,
                value:f.id
            })
        })
        setFollowersList(temp)
    }

    return (
        <MultiSelect
            placeholder='Search for people who follows you....'
            itemComponent={SelectItem}
            label='Select followers'
            data={followersList}
            searchable
            value={selectedIds}
            onChange={setSelectedIds}
            nothingFound="Nobody here..."
            maxDropdownHeight={400}
        />
    )
}

export default FollowersSelect