/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { Autocomplete, Avatar, Group, Loader, SelectItemProps, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { searchUser } from 'data/api/profile';
import { useAppContext } from 'data/context/app-context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

export interface ItemProps extends SelectItemProps {
    type?: 'destination' | 'user' | 'tags',
    description?: string,
    image?: string,
    id?: string,
    value: string,
}




const SearchComponent = () => {

    const [searchInput, setSearchInput] = useState<string>('');
    const debouncedSearchInput = useDebounce(searchInput, 100);
    const [data, setData] = useState<ItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { setError } = useAppContext()
    const { push } = useRouter()

    useEffect(() => {
        if (debouncedSearchInput && debouncedSearchInput.length > 0)
            fetchData()
        else
            setData([])
    }, [debouncedSearchInput])

    const fetchData = async () => {
        try {
            setLoading(true)
            const userProfiles = await searchUser(debouncedSearchInput, 5);
            setData(userProfiles.map(p => ({
                value: p.firstname + " " + p.lastname,
                description: `@${p.username}`,
                image: p.avatar,
                title: p.firstname,
                label: p.firstname + " " + p.lastname,
                id: p.id
            })))
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ description, type, image, title, value, label, ...others }: ItemProps, ref) => {
            return <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />
                    <div>
                        <Text className='text-capitalize' m={0}>{label}</Text>
                        <Text size="xs" color="dimmed">
                            {description}
                        </Text>
                    </div>

                </Group>
            </div>
        }
    )

    return (
        <Autocomplete
            placeholder="Search for users, destinations, tags, etc."
            value={searchInput}
            onChange={setSearchInput}
            data={data}
            radius='lg'
            itemID='1'
            itemComponent={AutoCompleteItem}
            onItemSubmit={(item) => push('/app/profile/' + item.id)}
            itemScope={false}
            icon={<IconSearch size={18} />}
            rightSection={loading && <Loader size={18} />}
            iconWidth={36}
        />
    )
}

export default SearchComponent