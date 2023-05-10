import ProfileCard from '@components/ProfileCard/ProfileCard';
import TravelPlanComponent from '@components/TravelPlanComponent/TravelPlanComponents';
import { Button, Modal, ThemeIcon, Title, useMantineTheme } from '@mantine/core';
import { IconLocation, IconPlaneDeparture, IconUserCircle, IconUsers } from '@tabler/icons';
import { getPublicTravelPlans } from 'data/api/travelplan';
import { TravelPlan } from 'data/models/user';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { CreateTravelPlanForm } from 'ui/sections/CreateTravelPlanForm';


const Dashboard = () => {

    const theme = useMantineTheme()
    const { id } = useRouter().query;

    return (
        <Applayout>
            <div className="row">
                <div className="col-lg-3">
                   <ProfileCard/>
                </div>
                <div className="col-lg-6">
                   <ProfileCard/>
                </div>
                <div className="col-lg-3">
                   <ProfileCard/>
                </div>
            </div>
        </Applayout>
    )
}

export default Dashboard