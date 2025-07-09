'use client';

import { Tab, Typography } from "@components-web";

const DashboardPage = () => {
    return (
        <div className='space-y-10'>
            <Typography variant='h2'>
                DashboardPage
            </Typography>

            <div>
                <Tab
                    options={[
                        { label: 'Athletes', value: 'athletes' },
                        { label: 'Coaches', value: 'coaches' }
                    ]}
                    activeTab='athletes'
                    onChange={() => {
                        // TODO: Implement tab change
                    }} />
            </div>
        </div>
    )
}

export default DashboardPage;