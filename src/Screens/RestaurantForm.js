import React, { useState, useEffect } from 'react'
import _ from 'lodash';
import ImageUploader from "react-images-upload";
import MaterialTable from 'material-table';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import Switch from '@material-ui/core/Switch';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';

import Wrapper from '../Components/Wrapper';

import { store } from '../Redux/store';
import { firebase } from '../Config/firebase'
import { DASHBOARD } from '../Constants/routesName'
import { GET_UNIQUE_ID, UPLOAD_IMAGE_AS_PROMISE, DISPATCH_TO_REDUX } from '../Constants/functions';
import { SELECTED_RESTAURANT } from '../Constants/reduxTypes';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    form: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    },
    stepI: {
        padding: '1%',
        minHeight: '60vh'
    },
    chipsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(2),
        margin: 0,
        width: 'auto',
        flexDirection: 'column'
    },
    padding: {
        padding: theme.spacing(2)
    },
    topBottom: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function getSteps() {
    return ['Basic Information', 'Menu', 'Gallery', 'Done'];
}

const RestaurantFormScreen = (props) => {
    const columns = [
        { title: 'Category', field: 'category' },
        { title: 'Name', field: 'name' },
        { title: 'Description', field: 'description' },
        { title: 'Regular Price', field: 'regularPrice', type: 'numeric', emptyValue: 0 },
        { title: 'Discounted Price', field: 'price', type: 'numeric', emptyValue: 0 },
        { title: 'Add Customize Items', field: 'extras', editable: 'never', render: rowData => renderItemExtrasButton(rowData) },
        // { title: 'Quantity', field: 'quantity', type: 'numeric' },
    ]
    // edit/update restaurant profile
    // const data = props.location?.state?.data
    const [data, setData] = useState(props.location?.state?.data)
    console.log(data, ' data')
    // admin constants
    const [adminConstants, setAdminConstants] = useState(null);
    // material ui
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const steps = getSteps();
    const [isSnackOpen, setIsSnackOpen] = useState(false)
    const [snackMsg, setSnackMsg] = useState('')
    const [alertType, setAlertType] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    // step one
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState([]);
    const [address, setAddress] = useState('')
    const [typeChips, setTypeChips] = useState([]);
    const [servicesChips, setServicesChips] = useState([])
    const [openingHours, setOpeningHours] = useState('')
    const [connectedPlatforms, setConnectedPlatForms] = useState([])
    const [logo, setLogo] = useState(null);
    const [logoURL, setLogoURL] = useState('');
    const [cover, setCover] = useState(null);
    const [coverURL, setCoverURL] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isBlock, setIsBlock] = useState(false);
    // step two
    const [menu, setMenu] = useState([]);
    const [materialTableData, setMaterialTableData] = useState([]);
    const [isExtraModalVisible, setIsExtraModalVisible] = useState(false);
    const [selectedItemData, setSelectedItemData] = useState(null);
    const ExtrasMuiTableColumns = [
        { title: 'Name', field: 'name' },
        { title: 'Price', field: 'price', type: 'numeric', initialEditValue: 0, emptyValue: 0 },
    ];
    // { name: "Normal Cheese", isChecked: false, price: 50.0 },
    const [extrasMuiTableData, setExtrasMuiTableData] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [dealsMuiTableData, setDealsMuiTableData] = useState([]);
    const DealsMuiTableColumns = [
        { title: 'Name', field: 'name' },
        { title: 'Price', field: 'price', type: 'numeric', initialEditValue: 0, emptyValue: 0 },
        { title: 'Discount %', field: 'discount', type: 'numeric', initialEditValue: 0, emptyValue: 0 },
        {
            title: 'Image',
            field: 'image',
            emptyValue: '',
            render: rowData => <Avatar src={rowData?.image} alt={rowData?.name} />,
            editComponent: () => <ImageUploader
                {...props}
                withIcon={false}
                style={{ width: 200 }}
                // withPreview
                singleImage
                label={""}
                onChange={async picture => {
                    setDealImage(picture[0]);
                }}
                imgExtension={[".jpg", ".png"]}
                maxFileSize={5242880}
            />
        },
        { title: 'Items', field: 'items', editable: 'never', render: rowData => renderDealItemsButton(rowData), emptyValue: [] },

    ];
    const [isDealItemModalVisible, setIsDealItemModalVisible] = useState(false); //TODO: work from here
    const [selectedDealData, setSelectedDealData] = useState(null);
    const [dealImage, setDealImage] = useState(null);
    // step three
    const [images, setImages] = useState([]);
    const [gallery, setGallery] = useState([]);
    // step four

    const getStateFromStore = () => {
        const { adminPanelConstants, selectedRestaurant } = store.getState().authReducer
        setData(selectedRestaurant);
        setAdminConstants(adminPanelConstants);
        // console.log(adminPanelConstants, 'adminPanelConstants');
    }
    useEffect(() => {
        getStateFromStore();
        const unsubscribe = store.subscribe(getStateFromStore);
        return () => unsubscribe();
    }, []);

    const setInitialData = () => {
        // stepI states
        const adminObj = adminConstants?.restaurant
        setName(data.name);
        setAddress(data.address);
        setOpeningHours(data.hours);

        // filtering data
        let cuisineArr = typeof data.cuisine === 'string' ? data.cuisine.includes(',') ? data.cuisine.split(',') : [data.cuisine] : [...data.cuisine];
        cuisineArr = cuisineArr.map(value => {
            if (adminObj.cuisines.includes(value))
                return value;
        });
        setCuisine([..._.compact(cuisineArr)]);
        let connectedPlatformsArr = data?.connectedPlatforms?.map(value => {
            if (adminObj.connectedPlatforms.includes(value))
                return value;
        });
        setConnectedPlatForms([..._.compact(connectedPlatformsArr)]);
        // _.compact() is used to remove falsy values or empty strings from the arr;

        setIsActive(data.isActive);
        setIsFeatured(Boolean(data?.isFeatured));
        setIsBlock(Boolean(data?.isBlock));

        const resTypeChips = [], resServicesChips = [];
        const filterChips = (mapArr, newArr, dataArr) => {
            mapArr.forEach((o, i) => {
                let isSelected = false;
                if (dataArr.includes(o?.title || o)) {
                    isSelected = true
                } else {
                    isSelected = false
                }
                newArr.push({ key: i, label: o?.title || o, isSelected, image: o?.image });
            });
        }
        filterChips(adminObj.restaurantTypes, resTypeChips, data.type);
        setTypeChips([...resTypeChips]);
        filterChips(adminObj.services, resServicesChips, data.placeOrderOptions);
        setServicesChips([...resServicesChips]);

        setLogoURL(data.logo2);
        setCoverURL(data.logo1);

        // stepII states
        const muiTableData = []
        data.menu.forEach(categoryObj => {
            categoryObj.items.forEach(item => {
                muiTableData.push({
                    category: categoryObj.category,
                    name: item.name,
                    description: item?.description || '',
                    price: item.price,
                    regularPrice: item?.regularPrice,
                    itemId: item.id,
                    extras: item?.extras || []
                });
            });
        });
        setMaterialTableData([...muiTableData]);
        setDealsMuiTableData([...data?.deals || []]);

        // stepIII states
        setGallery([...data.gallery])

    }
    useEffect(() => {
        const adminObj = adminConstants?.restaurant
        if (data && adminObj) {
            setInitialData();
        } else {
            if (adminObj?.restaurantTypes?.length)
                setTypeChips(adminObj.restaurantTypes.map((type, i) => ({ ...type, key: i, label: type.title, isSelected: false })))
            if (adminObj?.services?.length)
                setServicesChips(adminObj.services.map((type, i) => ({ key: i, label: type, isSelected: false })))
        }
    }, [adminConstants, data])

    useEffect(() => {
        console.log(materialTableData, 'materialTableData')
        if (materialTableData.length) {
            let categoryNames = [], menuArr = [];
            materialTableData.forEach(item => {
                categoryNames.push(item.category);
            });
            categoryNames = [...new Set(categoryNames)];
            if (categoryNames.length) {
                menuArr = categoryNames.map(category => {
                    const itemsArr = [];
                    materialTableData.forEach(item => {
                        if (item.category === category) {
                            itemsArr.push({
                                id: item?.itemId || GET_UNIQUE_ID(),
                                isExpanded: false,
                                isInCart: false,
                                quantity: 1,
                                itemTotal: Number(item.price),
                                name: item.name,
                                description: item?.description || '',
                                price: Number(item.price),
                                regularPrice: Number(item?.regularPrice || 0),
                                extras: item?.extras || []
                            })
                        }
                    });
                    return { category, isExpanded: true, items: _.uniqWith(itemsArr, _.isEqual) }
                })
                menuArr = _.uniqWith(_.compact(menuArr.flat()), _.isEqual)
                // console.log(menuArr, '*************menuArr')
                setMenu([...menuArr])
            }

        }
    }, [materialTableData]);

    useEffect(() => {
        if (extrasMuiTableData.length) {
            setMaterialTableData((prevState) => {
                const data = [...prevState];

                const itemIndex = selectedItemData?.tableData?.id;
                const item = data[itemIndex];
                item.extras = extrasMuiTableData.map(({ name, price }) => ({ name, price: Number(price), isChecked: false }));

                data[itemIndex] = item;
                return data;
            });

        }
    }, [selectedItemData]);

    useEffect(() => {
        if (selectedDealData) {
            setDealsMuiTableData(prevState => {
                const data = [...prevState];
                const index = _.findIndex(data, ['id', selectedDealData?.id]);
                data[index] = selectedDealData;
                return data;
            })
        }
    }, [selectedDealData])

    const calculateSellPrice = (costPrice, profit) => {
        return (100 + profit) * costPrice / 100;
    }

    const getStepContent = (step) => {
        const _renderStepI = () => {
            return (
                <Paper className={classes.stepI}>
                    <Typography variant="h5" >Restaurant Information</Typography>
                    <Grid container spacing={0} justify="space-between" >
                        {/* column I */}
                        <Grid item md={6} className={classes.padding}>
                            <TextField fullWidth value={name} className={classes.topBottom} label="Name" variant="outlined" placeholder="e.g. KFC Gulshan" onChange={e => setName(e.target.value)} />
                            <TextField fullWidth value={openingHours} className={classes.topBottom} label="Opening Hours" variant="outlined" placeholder="e.g. 2:00PM to 12:00AM" onChange={e => setOpeningHours(e.target.value)} />
                            <TextField fullWidth value={address} className={classes.topBottom} label="Full Address" variant="outlined" placeholder="e.g. Block 13-C, Gulshan-e-Iqbal, Karachi" onChange={e => setAddress(e.target.value)} multiline rows={4} />
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Status</FormLabel>
                                <FormControlLabel
                                    checked={isActive}
                                    control={<Switch color="primary" />}
                                    label={isActive ? "Active" : "Closed"}
                                    labelPlacement="end"
                                    onChange={e => { setIsActive(e.target.checked) }}
                                />
                            </FormControl>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Featured?</FormLabel>
                                <FormControlLabel
                                    checked={isFeatured}
                                    control={<Switch color="primary" />}
                                    label={isFeatured ? "Yes" : "No"}
                                    labelPlacement="end"
                                    onChange={e => { setIsFeatured(e.target.checked) }}
                                />
                            </FormControl>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Suspend Restaurant?</FormLabel>
                                <FormControlLabel
                                    checked={isBlock}
                                    control={<Switch color="primary" />}
                                    label={isBlock ? "Yes" : "No"}
                                    labelPlacement="end"
                                    onChange={e => { setIsBlock(e.target.checked) }}
                                />
                            </FormControl>
                        </Grid>
                        {/* column II */}
                        <Grid item md={6}>
                            {/* <TextField fullWidth value={cuisine} className={classes.topBottom} label="Cuisine (optional)" variant="outlined" placeholder="e.g. Pizza" onChange={e => setCuisine(e.target.value)} /> */}
                            {/* <TextField fullWidth value={connectedPlatforms} className={classes.topBottom} label="Connected Platforms (comma separated values)" variant="outlined" placeholder="e.g. FoodPanda, Careem Now, SavYour" onChange={e => setConnectedPlatForms(e.target.value)} /> */}
                            <Grid container>
                                <Grid item md={6} className={classes.padding}>
                                    <Paper className={classes.chipsContainer}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="demo-mutiple-checkbox-label-1">Choose Cuisines</InputLabel>
                                            <Select
                                                labelId="demo-mutiple-checkbox-label-1"
                                                id="demo-mutiple-checkbox-1"
                                                multiple
                                                value={cuisine}
                                                onChange={(event) => {
                                                    setCuisine(event.target.value);
                                                }}
                                                input={<Input />}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={MenuProps}
                                            >
                                                {adminConstants?.restaurant?.cuisines?.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox color="primary" checked={cuisine.indexOf(name) > -1} />
                                                        <ListItemText primary={name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Paper>
                                </Grid>
                                <Grid item md={6} className={classes.padding}>
                                    <Paper className={classes.chipsContainer}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="demo-mutiple-checkbox-label-2">Choose Connected Platforms</InputLabel>
                                            <Select
                                                labelId="demo-mutiple-checkbox-label-2"
                                                id="demo-mutiple-checkbox-2"
                                                multiple
                                                value={connectedPlatforms}
                                                onChange={(event) => {
                                                    setConnectedPlatForms(event.target.value);
                                                }}
                                                input={<Input />}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={MenuProps}
                                            >
                                                {adminConstants?.restaurant?.connectedPlatforms?.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox color="primary" checked={connectedPlatforms.indexOf(name) > -1} />
                                                        <ListItemText primary={name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item md={6} className={classes.padding}>
                                    <Paper className={classes.chipsContainer}>
                                        <Typography>Choose Food Type</Typography>
                                        <div style={{ paddingTop: '1vh', maxHeight: 150, overflowY: 'scroll' }}>
                                            {
                                                typeChips.map((chip, i) =>
                                                    <Chip key={i.toString()}
                                                        style={{ margin: 2 }}
                                                        color={chip.isSelected ? "primary" : "seconday"}
                                                        // icon={chip.isSelected && <DoneIcon />}
                                                        avatar={<Avatar alt={chip.label} src={chip.image} />}
                                                        label={chip.label}
                                                        onClick={() => {
                                                            setTypeChips(prevChips => {
                                                                prevChips[i].isSelected = !prevChips[i].isSelected;
                                                                return [...prevChips];
                                                            })
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    </Paper>
                                </Grid>
                                <Grid item md={6} className={classes.padding}>
                                    <Paper className={classes.chipsContainer}>
                                        <Typography >Choose Services</Typography>
                                        <div style={{ paddingTop: '1vh', maxHeight: 150, overflowY: 'scroll' }}>
                                            {
                                                servicesChips.map((chip, i) => <Chip key={i.toString()} style={{ margin: 2 }} color={chip.isSelected ? "primary" : "seconday"} icon={chip.isSelected && <DoneIcon />} label={chip.label}
                                                    onClick={() => {
                                                        setServicesChips(prevChips => {
                                                            prevChips[i].isSelected = !prevChips[i].isSelected;
                                                            // _.filter(prevChips, o => ({ isSelected: chip.key === o.key && !o.isSelected, ...o }))
                                                            return [...prevChips];
                                                        })
                                                    }}
                                                />)
                                            }
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid container justify="space-between">
                        <Grid item lg={6} md={6}>
                            {/* <Grid container direction="column"> */}
                            <ImageUploader
                                {...props}
                                withIcon={true}
                                withPreview
                                singleImage
                                label={logo ? logo.name : "Choose Logo: Max file size: 5mb, accepted: jpg | png"}
                                onChange={picture => setLogo(picture[0])}
                                imgExtension={[".jpg", ".png"]}
                                maxFileSize={5242880}
                            />
                            {
                                !logo && data &&
                                <Paper style={{ width: 150, height: 150, }}>
                                    <img
                                        style={{ width: 150, height: 150, borderRadius: 5, }}
                                        src={logoURL}
                                        alt="restaurant logo"
                                    />
                                </Paper>
                            }
                            {/* </Grid> */}
                        </Grid>
                        <Grid item lg={6} md={6}>
                            <ImageUploader
                                {...props}
                                withIcon={true}
                                withPreview
                                singleImage
                                label={cover ? cover.name : "Choose Cover: Max file size: 5mb, accepted: jpg"}
                                onChange={picture => setCover(picture[0])}
                                imgExtension={[".jpg"]}
                                maxFileSize={5242880}
                            />
                            {
                                !cover && data &&
                                <Paper style={{ width: 300, height: 150, }}>
                                    <img
                                        style={{ width: 300, height: 150, borderRadius: 5, }}
                                        src={coverURL}
                                        alt="restaurant cover"
                                    />
                                </Paper>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            )
        }
        const _renderStepII = () => {
            return (
                <Paper className={classes.stepI}>
                    {/* <Typography variant="h5" >Menu for "{"KFC Gulshan" || name}"</Typography> */}
                    {/* <Grid container spacing={0} justify="space-between"></Grid> */}
                    <Tabs
                        value={tabIndex}
                        onChange={(e, newValue) => setTabIndex(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        variant="fullWidth"
                    >
                        <Tab label="Meals" />
                        <Tab label="Deals" />
                    </Tabs>
                    {
                        tabIndex === 0 ?
                            <MaterialTable
                                options={{ draggable: false, filtering: true, actionsColumnIndex: columns.length }}
                                title={`Menu for "${name}"`}
                                columns={columns}
                                data={materialTableData}
                                // parentChildData={(row, rows) => rows.find(item => item.id === row.parentId)}
                                editable={{
                                    onRowAdd: (newData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            setMaterialTableData((prevState) => {
                                                const data = [...prevState];
                                                data.push(newData);
                                                return data;
                                            });
                                        }),
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            if (oldData) {
                                                setMaterialTableData((prevState) => {
                                                    const data = [...prevState];
                                                    data[data.indexOf(oldData)] = newData;
                                                    return data;
                                                });
                                            }
                                        }),
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            setMaterialTableData((prevState) => {
                                                const data = [...prevState];
                                                data.splice(data.indexOf(oldData), 1);
                                                return data;
                                            });
                                        }),
                                }}
                            />
                            :
                            <MaterialTable
                                options={{ draggable: false, filtering: true, actionsColumnIndex: DealsMuiTableColumns.length }}
                                title={`Menu for "${name}"`}
                                columns={DealsMuiTableColumns}
                                data={dealsMuiTableData}
                                // parentChildData={(row, rows) => rows.find(item => item.id === row.parentId)}
                                editable={{
                                    onRowAdd: (newData) =>
                                        new Promise(async (resolve) => {
                                            const downloadURL = await uploadImageAsPromise(dealImage);
                                            setDealsMuiTableData((prevState) => {
                                                const data2 = [...prevState];
                                                newData = {
                                                    "id": GET_UNIQUE_ID(),
                                                    "restaurantId": data.id,
                                                    "address": data.address,
                                                    "restaurantName": data.name,
                                                    "items": [],
                                                    "name": newData.name,
                                                    "itemTotal": newData.price,
                                                    "price": newData.price,
                                                    "discount": newData.discount,
                                                    "image": downloadURL,
                                                    "isInCart": false,
                                                    "quantity": 1,
                                                };
                                                data2.push(newData);
                                                resolve();
                                                return data2;
                                            });
                                        }),
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            if (oldData) {
                                                setDealsMuiTableData((prevState) => {
                                                    const data = [...prevState];
                                                    data[data.indexOf(oldData)] = newData;
                                                    return data;
                                                });
                                            }
                                        }),
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            setDealsMuiTableData((prevState) => {
                                                const data = [...prevState];
                                                data.splice(data.indexOf(oldData), 1);
                                                return data;
                                            });
                                        }),
                                }}
                            />
                    }
                </Paper>
            )
        }
        const _renderStepIII = () => {
            return (
                <Paper className={classes.stepI}>
                    <Typography variant="h5" >{data ? '' : 'Upload'} Gallery Images</Typography>
                    <Grid container spacing={0} justify="center" alignItems="center">
                        <Grid item xs={12}>
                            {
                                data &&
                                <Grid container xs={12} direction="row">
                                    {gallery.map(url => (
                                        <Paper style={{ width: 150, height: 150, margin: '1%' }} elevation={5}>
                                            <Badge badgeContent={<IconButton style={{ padding: 0, margin: 0 }} onClick={() => setGallery(prevState => {
                                                const data = [...prevState];
                                                data.splice(data.indexOf(url), 1);
                                                return data;
                                            })}><DeleteIcon color="secondary" /></IconButton>} color="primary" style={{ height: '100%', width: '100%', }}>
                                                <img src={url} alt={url} style={{ height: '100%', width: '100%', borderRadius: 5 }} />
                                            </Badge>
                                        </Paper>
                                    ))}
                                </Grid>
                            }
                            <ImageUploader
                                {...props}
                                withPreview
                                withIcon={true}
                                label={logo ? logo.name : "Choose images: Max file size: 5mb, accepted: jpg | png"}
                                onChange={async pictures => {
                                    setImages([...pictures])
                                }}
                                imgExtension={[".jpg", ".png"]}
                                maxFileSize={5242880}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )
        }
        const _renderStepIV = () => {
            return (
                <Paper className={classes.stepI} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <Typography variant="h4" align="center" >Save everything?</Typography>
                </Paper>
            )
        }

        switch (step) {
            case 0:
                return _renderStepI();
            case 1:
                return _renderStepII();
            case 2:
                return _renderStepIII();
            case 3:
                return _renderStepIV();
            default:
                return 'Unknown step';
        }
    }

    const validateStep = () => {
        const _validateStepI = () => {
            if (!name.trim()) {
                showAlert('Please enter name!', 'error');
                return false;
            } else if (!address.trim()) {
                showAlert('Please enter address!', 'error');
                return false;
            } else if (!openingHours.trim()) {
                showAlert('Please enter opening hours!', 'error');
                return false;
                // } else if (!connectedPlatforms.trim()) {
                //     showAlert('Please enter connected platForms!', 'error');
                //     return false;
            } else if (!logo && !data) {
                showAlert('Please select logo icon!', 'error');
                return false;
            } else if (!cover && !data) {
                showAlert('Please select cover image!', 'error');
                return false;
            } else if (!_.filter(typeChips, ['isSelected', true]).length) {
                showAlert('Please select atleast one food type!', 'error');
                return false;
            } else if (!_.filter(servicesChips, ['isSelected', true]).length) {
                showAlert('Please select atleast one service!', 'error');
                return false;
            } else {
                return true;
            }
        }

        const _validateStepII = () => {
            if (!menu.length) {
                showAlert('Please enter menu items!', 'error');
                return false;
            } else {
                return true;
            }
        }

        switch (activeStep) {
            case 0:
                return _validateStepI();
            case 1:
                return _validateStepII();
            case 2:
                return true
            case 3:
                return true
            default:
                break;
        }
    }

    const showAlert = (msg = '', snackAlertType) => {
        setIsSnackOpen(true);
        setSnackMsg(msg);
        setAlertType(snackAlertType);
    }

    const uploadImageAsPromise = async (imageFile) => {
        const downloadURL = await UPLOAD_IMAGE_AS_PROMISE(imageFile, percentage => {
            showAlert(`${parseInt(percentage) === 100 ? 'Uploaded!' : 'Uploading...'} ${percentage.toFixed(2)}% completed`, percentage === 100 ? "success" : "info");
        });
        return downloadURL;
    }

    const uploadImages = async () => {
        for (var i = 0; i < images.length; i++) {
            var imageFile = images[i];

            try {
                const downloadURL = await uploadImageAsPromise(imageFile);
                setIsSnackOpen(false);
                gallery.push(downloadURL);
                setGallery([...gallery.reverse()]);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const saveInformationToDB = async () => {
        setIsUploading(true);
        images.length && await uploadImages();
        const logoURL2 = logo ? await uploadImageAsPromise(logo) : logoURL;
        const coverURL2 = cover ? await uploadImageAsPromise(cover) : coverURL;
        const restaurantObj = {
            id: data ? data.id : '',
            address,
            cuisine,
            gallery,
            connectedPlatforms,
            hours: openingHours,
            logo2: logoURL2,
            logo1: coverURL2,
            menu,
            deals: dealsMuiTableData,
            name,
            placeOrderOptions: _.compact(servicesChips.map(item => {
                if (item.isSelected) return item.label
            })),
            type: _.compact(typeChips.map(item => item.isSelected && item.label)),
            ratings: data ? data.ratings : 1.5,
            reviews: data ? data.reviews : [],
            isActive: Boolean(isActive),
            isFeatured: Boolean(isFeatured),
            isBlock: Boolean(isBlock),
        }
        console.log(restaurantObj, '******* restaurantObj')
        const collectionRef = firebase.firestore().collection('companies');
        const ref = data ? collectionRef.doc(data.id) : collectionRef.doc();
        if (!data) {
            restaurantObj.id = ref.id;
            await ref.set(restaurantObj);
        } else {
            await ref.update(restaurantObj);
        }
        console.log(ref.id, ' push id **********')
        setIsUploading(false);
        DISPATCH_TO_REDUX(SELECTED_RESTAURANT, restaurantObj);
        props.history.push(DASHBOARD);
    }


    const isStepOptional = (step) => {
        return step === 2;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        if (!validateStep()) {
            return;
        }
        if (activeStep === steps.length - 1) {
            // send data to db | submit
            saveInformationToDB();
        } else {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleCloseSnack = () => {
        setIsSnackOpen(false);
    }

    const toggleDealItemsModal = (rowData) => {
        console.log(rowData);
        setIsDealItemModalVisible(!isDealItemModalVisible);
        setSelectedDealData(rowData);
        // setDealsMuiTableData(rowData?.deals || []);
    }


    const renderDealItemsButton = (rowData) => {
        return (
            <Button onClick={() => toggleDealItemsModal(rowData)} variant="contained" color="primary" fullWidth className={classes.button} disabled={isUploading}>
                Open
            </Button>
        )
    }

    const renderDealItemsModal = () => {
        const DealItemMuiTableColumns = [
            { title: 'Name', field: 'name' },
        ]
        const dealItemsMuiTableData = selectedDealData?.items?.map(val => ({ name: val }));
        return (
            <Dialog
                open={isDealItemModalVisible}
                TransitionComponent={Transition}
                keepMounted
                onClose={toggleDealItemsModal}
                fullWidth
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                disableBackdropClick
            >
                <DialogTitle id="alert-dialog-slide-title">{`Items for "${selectedDealData?.name}"`}</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        options={{ draggable: false, filtering: !true, actionsColumnIndex: DealItemMuiTableColumns.length }}
                        title={'Extra Items'}
                        columns={DealItemMuiTableColumns}
                        data={dealItemsMuiTableData}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    setSelectedDealData((prevState) => {
                                        const data = [...prevState.items];
                                        data.push(newData.name);
                                        return { ...prevState, items: data };
                                    });
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    if (oldData) {
                                        setSelectedDealData((prevState) => {
                                            const data = [...prevState.items];
                                            data[data.indexOf(oldData.name)] = newData.name;
                                            return { ...prevState, items: data };
                                        });
                                    }
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    setSelectedDealData((prevState) => {
                                        const data = [...prevState.items];
                                        data.splice(data.indexOf(oldData.name), 1);
                                        return { ...prevState, items: data };
                                    });
                                }),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDealItemsModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const toggleExtrasModal = (rowData) => {
        setIsExtraModalVisible(!isExtraModalVisible);
        setSelectedItemData(rowData);
        setExtrasMuiTableData(rowData?.extras || []);
    }

    const renderItemExtrasButton = (rowData) => {
        return (
            <Button onClick={() => toggleExtrasModal(rowData)} variant="contained" color="primary" fullWidth className={classes.button} disabled={isUploading}>
                Open
            </Button>
        )
    }

    const renderExtraModal = () => {
        return (
            <Dialog
                open={isExtraModalVisible}
                TransitionComponent={Transition}
                keepMounted
                onClose={toggleExtrasModal}
                fullWidth
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                disableBackdropClick
            >
                <DialogTitle id="alert-dialog-slide-title">{`Customize items for "${selectedItemData?.name}"`}</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        options={{ draggable: false, filtering: !true, actionsColumnIndex: ExtrasMuiTableColumns.length }}
                        title={'Extra Items'}
                        columns={ExtrasMuiTableColumns}
                        data={extrasMuiTableData}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    setExtrasMuiTableData((prevState) => {
                                        const data = [...prevState];
                                        data.push(newData);
                                        return data;
                                    });
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    if (oldData) {
                                        setExtrasMuiTableData((prevState) => {
                                            const data = [...prevState];
                                            data[data.indexOf(oldData)] = newData;
                                            return data;
                                        });
                                    }
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    setExtrasMuiTableData((prevState) => {
                                        const data = [...prevState];
                                        data.splice(data.indexOf(oldData), 1);
                                        return data;
                                    });
                                }),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleExtrasModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }



    return (
        <Wrapper>
            {renderExtraModal()}
            {renderDealItemsModal()}
            <Snackbar open={isSnackOpen} autoHideDuration={3000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity={alertType} elevation={6} variant="filled">
                    {snackMsg}
                </Alert>
            </Snackbar>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            <StepContent>
                                <div>
                                    {activeStep === steps.length ? (
                                        <div>
                                            <Typography className={classes.instructions}>
                                                All steps completed - you&apos;re finished
                        </Typography>
                                            <Button onClick={handleReset} className={classes.button} disabled={isUploading}>
                                                Reset
                        </Button>
                                        </div>
                                    ) : (
                                            <div>
                                                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                                <div>
                                                    <Button disabled={activeStep === 0 || isUploading} onClick={handleBack} className={classes.button}>
                                                        Back
                                </Button>
                                                    {isStepOptional(activeStep) && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSkip}
                                                            disabled={isUploading}
                                                            className={classes.button}
                                                        >
                                                            Skip
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleNext}
                                                        disabled={isUploading}
                                                        className={classes.button}
                                                    >
                                                        {activeStep === steps.length - 1 ? data ? 'Update' : 'Save' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </StepContent>
                        </Step>
                    );
                })}
            </Stepper>

        </Wrapper>
    )
}

export default RestaurantFormScreen
