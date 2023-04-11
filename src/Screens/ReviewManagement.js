import React, { useEffect, useState } from 'react'
import Wrapper from '../Components/Wrapper'
import { store } from '../Redux/store'
import MaterialTable from 'material-table'
import { DB } from '../Config/firebase'

const ReviewManagementScreen = () => {
    const restaurantsRef = DB.collection('companies');
    const muiTableColumns = [
        { title: 'User Id', field: 'userId' },
        { title: 'Name', field: 'username' },
        // { title: 'Photo', field: 'PhotoURL' },
        { title: 'Ratings', field: 'ratings' },
        { title: 'Comment', field: 'comment', },

    ]
    const [muiTableData, setMuiTableData] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState([])

    const getStateFromStore = () => {
        const { selectedRestaurant } = store.getState().authReducer;
        setSelectedRestaurant(selectedRestaurant);
    }
    useEffect(() => {
        getStateFromStore();
        const unsubscribe = store.subscribe(getStateFromStore);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (selectedRestaurant && selectedRestaurant?.reviews) {
            selectedRestaurant.reviews.forEach(review => {
                setMuiTableData(prevState => {
                    const data = [...prevState];
                    data.push(review);
                    return data;
                })
            })
        }
    }, [selectedRestaurant]);
    useEffect(() => {
        if (muiTableData.length) {
            restaurantsRef.doc(selectedRestaurant.id).update({ reviews: muiTableData })
        }
    }, [muiTableData])

    return (
        <Wrapper>
            <MaterialTable
                options={{ draggable: !true, filtering: true, actionsColumnIndex: muiTableColumns.length, }}
                title={'Review Management'}
                columns={muiTableColumns}
                data={muiTableData}
                // actions={[
                //     {
                //         icon: 'add_box',
                //         position: 'toolbar',
                //         tooltip: 'Add Restaurant',
                //         onClick: () => props.history.push(RESTAURANT_FORM)
                //     }
                // ]}
                editable={{
                    // onRowAdd: (newData) =>
                    //     new Promise((resolve) => {
                    //         resolve();
                    //         setMuiTableData((prevState) => {
                    //             const data = [...prevState];
                    //             data.push(newData);
                    //             return data;
                    //         });
                    //     }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(async (resolve) => {
                            resolve();
                            if (oldData) {
                                setMuiTableData((prevState) => {
                                    const data = [...prevState];
                                    data[data.indexOf(oldData)] = newData;
                                    return data;
                                });
                            }
                        }),
                    onRowDelete: (oldData) =>
                        new Promise(async (resolve) => {
                            resolve();
                            setMuiTableData((prevState) => {
                                const data = [...prevState];
                                data.splice(data.indexOf(oldData), 1);
                                return data;
                            });
                        }),
                }}
            // parentChildData={(row, rows) => rows.find(item => item.orderId === row.parentId)}
            />
        </Wrapper>
    )
}

export default ReviewManagementScreen
