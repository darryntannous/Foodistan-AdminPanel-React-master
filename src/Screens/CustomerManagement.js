import React, { useEffect, useState } from 'react'
import Axios from 'axios'

import Wrapper from '../Components/Wrapper'
import { store } from '../Redux/store'
import MaterialTable from 'material-table'
import { DB } from '../Config/firebase'
import { BASE_URL, DELETE_USER, LOCAL_BASE_URL } from '../Constants/apis';

const CustomerManagementScreen = () => {
    const usersRef = DB.collection('users');
    const muiTableColumns = [
        { title: 'Id', field: 'id' },
        { title: 'Name', field: 'Name' },
        { title: 'Email', field: 'Email' },
        { title: 'Contact', field: 'Contact' },
        { title: 'Address', field: 'Address', },
        { title: 'City', field: 'City' },

    ]
    const [muiTableData, setMuiTableData] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);

    const getStateFromStore = () => {
        const { allCustomers } = store.getState().authReducer
        setAllCustomers([...allCustomers]);
    }
    useEffect(() => {
        getStateFromStore();
        const unsubscribe = store.subscribe(getStateFromStore);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (allCustomers.length) {
            allCustomers.forEach(customer => {
                setMuiTableData(prevState => {
                    const data = [...prevState];
                    data.push(customer);
                    return data;
                })
            })
        }
    }, [allCustomers])

    return (
        <Wrapper>
            <MaterialTable
                options={{ draggable: !true, filtering: true, actionsColumnIndex: muiTableColumns.length, }}
                title={'Customer Management'}
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
                    //         props.history.push(RESTAURANT_FORM);
                    //     }),
                    // onRowUpdate: (newData, oldData) =>
                    //     new Promise(async (resolve) => {
                    //         resolve();
                    //         if (oldData) {
                    //             const index = newData?.Addresses?.indexOf(oldData.Address);
                    //             if (index && index !== -1) {
                    //                 newData.Addresses.splice(index, 1, newData.Address);
                    //             }
                    //             await usersRef.doc(oldData.id).update(newData);
                    //         }
                    //     }),
                    onRowDelete: (oldData) =>
                        new Promise(async (resolve) => {
                            Axios.post(BASE_URL + DELETE_USER, { userId: oldData.id })
                                .then(res => {
                                    console.log(res, ' response');
                                    setMuiTableData(prevState => {
                                        const data = [...prevState];
                                        data.splice(data.indexOf(oldData), 1);
                                        return data;
                                    });
                                })
                                .catch(err => console.log(err))
                                .finally(() => resolve())
                            // await usersRef.doc(oldData.id).delete();
                        }),
                }}
            // parentChildData={(row, rows) => rows.find(item => item.orderId === row.parentId)}
            />
        </Wrapper>
    )
}

export default CustomerManagementScreen
