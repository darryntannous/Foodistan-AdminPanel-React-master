import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';
import moment from 'moment'
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import Wrapper from '../Components/Wrapper'
import { store } from '../Redux/store'
import { updateOrder } from '../Redux/actions/authAction';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: 0,//theme.spacing(),
        minWidth: 120,
        padding: 0
    },
    selectEmpty: {
        marginTop: 0,//theme.spacing(2),
        padding: 0
    },
}));


const OrderManagementScreen = (_props) => {
    const classes = useStyles();
    const columns = [
        // { title: 'Restaurant Name', field: 'resName', /* defaultGroupOrder: 0 */ },
        { title: 'Order ID', field: 'orderId', },
        { title: 'Item Name', field: 'itemName' },
        { title: 'Price', field: 'price' },
        { title: 'Quantity', field: 'quantity' },
        { title: 'Date/Time', field: 'timestamp' },
        { title: 'Customer Info', field: 'userId', render: rowData => rowData?.userId && _userDataButton(rowData) },
        { title: 'Status', field: 'status', render: rowData => rowData?.status && _select(rowData) },
    ];
    const [statuses, setStatuses] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [muiTableData, setMuiTableData] = useState([]);
    // <---->
    const [isUserModalVisible, setIsUserModalVisible] = useState(!false);
    const [selectedUser, setSelectedUser] = useState(null);

    const getStateFromStore = () => {
        const { allOrders, adminPanelConstants: adminConstants, selectedRestaurant, allCustomers } = store.getState().authReducer
        // console.log(allOrders, ' ******allOrders');
        // console.log(adminConstants, ' ******adminConstants');

        const allStatuses = adminConstants?.restaurant?.orderStatuses || []
        setStatuses([...allStatuses]);
        setAllOrders([..._.filter(allOrders, ['snapshot.restaurantId', selectedRestaurant?.id])]);
        setAllCustomers([...allCustomers]);
    }
    useEffect(() => {
        getStateFromStore();
        const unsubscribe = store.subscribe(getStateFromStore);
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        if (allOrders.length) {
            allOrders.forEach(obj => {
                const { items, restaurant, customer, timestamp, status, id: orderId } = obj;
                // muiTableData.push({
                //     orderId: '',
                //     resId: restaurant.id,
                //     resName: restaurant.name,
                // });
                muiTableData.push({
                    orderId,
                    resId: restaurant.id,
                    parentId: restaurant.id,
                    status: status,
                    timestamp: moment(timestamp).fromNow(),
                    userId: customer.id,
                    fullObj: obj,
                });
                items.forEach((item, i) => {
                    const tableObj = {
                        // orderId,
                        resId: restaurant.id,
                        resName: restaurant.name,
                        itemId: item.id,
                        itemName: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        parentId: orderId,
                        // status: i > 0 ? '' : status,
                        // timestamp: moment(timestamp).fromNow(),
                        fullObj: obj
                    };
                    muiTableData.push(tableObj);
                });
            });
            setMuiTableData([...muiTableData])
        }
    }, [allOrders]);

    const toggleUserModal = () => {
        setIsUserModalVisible(!isUserModalVisible);
    }


    const _renderUserModal = () => {
        // const USER_COLUMNS = [
        //     { title: 'ID', field: 'id' },
        //     { title: 'Name', field: 'Name' },
        //     { title: 'Email', field: 'Email' },
        //     { title: 'Contact', field: 'Contact' },
        //     { title: 'Address', field: 'Address' },
        // ];
        return selectedUser && (
            <Dialog
                open={isUserModalVisible}
                TransitionComponent={Transition}
                keepMounted
                onClose={toggleUserModal}
                onBackdropClick={toggleUserModal}
                fullWidth
                maxWidth="xs"
                aria-labelledby="alert-dialog-slide-title2"
                aria-describedby="alert-dialog-slide-description2"
            >
                <DialogTitle id="alert-dialog-slide-title">{"User info"}</DialogTitle>
                <DialogContent>
                    {/* <MaterialTable
                        options={{ draggable: false, filtering: false, actionsColumnIndex: USER_COLUMNS.length }}
                        title={'User Data'}
                        columns={USER_COLUMNS}
                        data={[selectedUser]}
                    /> */}
                    <Typography><Typography display="inline" variant="subtitle2">ID:</Typography> {selectedUser.id}</Typography>
                    <Typography><Typography display="inline" variant="subtitle2">Name:</Typography> {selectedUser.Name}</Typography>
                    <Typography><Typography display="inline" variant="subtitle2">Email:</Typography> {selectedUser.Email}</Typography>
                    <Typography><Typography display="inline" variant="subtitle2">Phone number:</Typography> {selectedUser.Contact}</Typography>
                    <Typography><Typography display="inline" variant="subtitle2">Address:</Typography> {selectedUser.Address}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleUserModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const _select = (rowData) => {
        const { status } = rowData;
        return (
            <FormControl className={classes.formControl}>
                <Select
                    value={status}
                    onChange={async (e) => {
                        rowData.status = e.target.value;
                        muiTableData.splice(muiTableData.indexOf(rowData), 1, rowData);
                        setMuiTableData([...muiTableData]);
                        // console.log(rowData)
                        const data = rowData.fullObj.snapshot;
                        data.status = e.target.value;
                        await updateOrder(data.id, data);
                    }}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="" disabled>
                        Order Status
                    </MenuItem>
                    {statuses.map(val => <MenuItem value={val}>{val}</MenuItem>)}
                </Select>
                <FormHelperText>Order Status</FormHelperText>
            </FormControl >
        )
    }
    const _userDataButton = (rowData) => {
        return (
            <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                    console.log(rowData)
                    const customerData = _.find(allCustomers, ['id', rowData.userId]);
                    setSelectedUser(customerData);
                    setIsUserModalVisible(true);
                }}
            >Open</Button>
        )
    }

    return (
        <Wrapper>
            {_renderUserModal()}
            <div>
                <MaterialTable
                    options={{ draggable: !true, filtering: true, actionsColumnIndex: columns.length, grouping: !true, defaultExpanded: true }}
                    title={'Order Management'}
                    columns={columns}
                    data={muiTableData}
                    parentChildData={(row, rows) => rows.find(item => item.orderId === row.parentId)}
                />
            </div>
        </Wrapper>
    )
}

export default OrderManagementScreen
