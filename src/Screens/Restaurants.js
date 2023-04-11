import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';

import { store } from '../Redux/store'
import Wrapper from '../Components/Wrapper';
import { DB } from '../Config/firebase';
import { RESTAURANT_FORM, RESTAURANT_ID } from '../Constants/routesName';


const columns = [
    { title: 'Restaurant Name', field: 'name' },
    { title: 'Address', field: 'address' },
    { title: 'Cuisine', field: 'cuisine' },
    { title: 'Ratings', field: 'ratings', type: 'numeric' },
    { title: 'Hours', field: 'hours' },
]
const RestaurantsScreen = (props) => {
    const restaurantRef = DB.collection('companies');
    const [restaurantsData, setRestaurantsData] = useState([]);

    const getStateFromStore = () => {
        const { allRestaurants } = store.getState().authReducer
        setRestaurantsData(allRestaurants);
        console.log(allRestaurants, ' ******allRestaurants');
    }
    useEffect(() => {
        getStateFromStore();
        const unsubscribe = store.subscribe(getStateFromStore);
        return () => unsubscribe();
    }, [])

    return (
        <Wrapper>
            <MaterialTable
                options={{ draggable: false, filtering: true, actionsColumnIndex: columns.length }}
                title={'Restaurants'}
                columns={columns}
                data={restaurantsData}
                actions={[
                    {
                        icon: 'launch',
                        tooltip: 'More Editing Options',
                        onClick: (_e, rowData) => props.history.push(RESTAURANT_ID + '/' + rowData.id, { data: rowData })
                    },
                    {
                        icon: 'add_box',
                        position: 'toolbar',
                        tooltip: 'Add Restaurant',
                        onClick: () => props.history.push(RESTAURANT_FORM)
                    }
                ]}
                // style={{ maxHeight: "80vh", overflowY: 'scroll' }}
                // parentChildData={(row, rows) => rows.find(item => item.id === row.parentId)}
                editable={{
                    // onRowAdd: (newData) =>
                    //     new Promise((resolve) => {
                    //         resolve();
                    //         props.history.push(RESTAURANT_FORM);
                    //     }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(async (resolve) => {
                            resolve();
                            if (oldData) {
                                await restaurantRef.doc(oldData.id).update(newData);
                            }
                        }),
                    onRowDelete: (oldData) =>
                        new Promise(async (resolve) => {
                            resolve();
                            await restaurantRef.doc(oldData.id).delete();
                        }),
                }}
            />
        </Wrapper>
    )
}

export default RestaurantsScreen
