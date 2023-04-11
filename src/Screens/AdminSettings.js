import React, { useEffect, useState } from 'react'
import ImageUploader from "react-images-upload";
import MaterialTable from 'material-table';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
// import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

import Wrapper from '../Components/Wrapper'
import { store } from '../Redux/store';
import { UPLOAD_IMAGE_AS_PROMISE } from '../Constants/functions';
import { DB } from '../Config/firebase';

const useStyles = makeStyles({
    card: {
        width: 245,
        marginRight: '1%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '1%'
        // "&:hover": {}
    },
    cardImg: {
        marginTop: 80,
        marginBottom: 70,
        objectFit: 'contain'
    },
    title: { fontWeight: 'bolder' }
});

const AdminSettingsScreen = (props) => {
    const adminPanelConstantsRef = DB.collection('ADMIN_PANEL')
    // redux
    const [adminConstants, setAdminConstants] = useState(null);
    // component states
    const [cardsData, setCardsData] = useState([]);
    const [urlHash, setUrlHash] = useState(window.location.hash);
    const [selectedCardData, setSelectedCardData] = useState([]);
    // component constants
    const classes = useStyles();
    const columns = urlHash === '#restaurantTypes'
        ? [
            { title: 'Title', field: 'title' },
            {
                title: 'Image', field: 'image',
                editable: 'onAdd',
                // editComponent: ,
                render: (rowData) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <img src={rowData?.image} alt={rowData?.title} width={100} />
                        <ImageUploader
                            {...props}
                            withIcon={false}
                            style={{ width: 100 }}
                            // withPreview
                            singleImage
                            label={""}
                            onChange={async picture => {
                                const downloadURL = await UPLOAD_IMAGE_AS_PROMISE(picture[0])
                                rowData.image = downloadURL;
                                const index = _.findIndex(selectedCardData, ['title', rowData.title])
                                if (index !== -1) {
                                    setSelectedCardData(prevState => {
                                        const data = [...prevState];
                                        data[index] = rowData;
                                        updateDB(data);
                                        return data;
                                    });
                                }
                            }}
                            imgExtension={[".jpg", ".png"]}
                            maxFileSize={5242880}
                        />
                    </div>
                ),
            }
        ]
        : [{ title: 'Title', field: 'val' }];
    /* {
        image: require('../../assets/explore/slider-image-13x.png'),
        title: 'Cafes and Grills',
        type: 'Grills',
        isSelected: false,
      }, */

    const getStateFromStore = () => {
        const { adminPanelConstants } = store.getState().authReducer
        console.log(adminPanelConstants, '  adminPanelConstants');
        const restaurantConstants = adminPanelConstants?.restaurant;

        setAdminConstants(adminPanelConstants);

        restaurantConstants && Object.keys(restaurantConstants).map((key, i) => {
            const name = key === "restaurantTypes" ? 'Restaurant Types' : key === "orderStatuses" ? 'Order Statuses' : key === "services" ? 'Services' : key === "connectedPlatforms" ? 'Connected Platforms' : key === "cuisines" && 'Cuisines';
            const obj = {
                id: i + 1,
                key,
                value: restaurantConstants[key],
                title: name,
                description: '',
                icon: require('../assets/admin-settings.png'),
            };
            setCardsData(prevState => arrCallback(prevState, obj));
        })
    }
    useEffect(() => {
        getStateFromStore();
        const unsubscribe = store.subscribe(getStateFromStore);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setUrlHash(window.location.hash);
        setSelectedCardData(adminConstants?.restaurant?.[window.location.hash.replace('#', '')]);
    }, [window.location.hash])

    const arrCallback = (prevState, str, index, shouldAdd = true) => {
        const data = [...prevState];
        if (shouldAdd)
            data.push(str);
        else
            data.splice(index, 1);

        return data;
        // setConnectedPlatforms(prevState => arrOfStrCallback(prevState, chip, null, true)
    }

    const updateDB = (data) => {
        adminPanelConstantsRef.doc('restaurant').update({ [urlHash.replace('#', '')]: data })
            .then(() => { }).catch(e => console.log(e))
    }


    const card_jsx = card => {

        return (
            <Card key={card.id} className={classes.card} elevation={5}>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant='h5'
                        component='h2'
                        className={classes.title}
                    >
                        {card.title}
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary" component="p">{card.description}</Typography> */}
                    <CardMedia
                        component='img'
                        alt='Contemplative Reptile'
                        height='100'
                        image={card.icon}
                        title='Contemplative Reptile'
                        className={classes.cardImg}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        size='medium'
                        color='primary'
                        variant='contained'
                        fullWidth
                        onClick={() => {
                            window.location.hash = card.key;
                        }}
                    >
                        Go <ArrowForwardRoundedIcon fontSize='small' />
                    </Button>
                </CardActions>
            </Card>
        );
    };

    return (
        <Wrapper parentStyle={{}}>
            {
                !urlHash.trim()
                    ? (
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {cardsData.map(card_jsx)}
                        </div>
                    )
                    : (
                        <>
                            <Button color="primary" variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => props.history.goBack()} style={{ marginBottom: '1%' }} >Back</Button>
                            <MaterialTable
                                style={{ width: '100%' }}
                                options={{ draggable: false, filtering: !true, actionsColumnIndex: columns.length, pageSize: 10 }}
                                title={urlHash}
                                columns={columns}
                                data={selectedCardData.map(item => (urlHash === '#restaurantTypes' ? { ...item } : { val: item }))}
                                editable={{
                                    onRowAdd: (newData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            setSelectedCardData((prevState) => {
                                                const data = [...prevState];
                                                if (urlHash === '#restaurantTypes') {
                                                    newData.type = newData.title;
                                                    data.push(newData);
                                                } else {
                                                    data.push(newData.val);
                                                }
                                                updateDB(data);
                                                console.log(data, '   data');
                                                return data;
                                            });
                                        }),
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            if (oldData) {
                                                setSelectedCardData((prevState) => {
                                                    const data = [...prevState];
                                                    if (urlHash === '#restaurantTypes') {
                                                        const index = _.findIndex(data, ['title', oldData.title])
                                                        newData.type = newData.title;
                                                        data[index] = newData;
                                                    }
                                                    else
                                                        data[data.indexOf(oldData.val)] = newData.val;
                                                    updateDB(data);
                                                    console.log(data, '   data');
                                                    return data;
                                                });
                                            }
                                        }),
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                            resolve();
                                            setSelectedCardData((prevState) => {
                                                const data = [...prevState];
                                                if (urlHash === '#restaurantTypes') {
                                                    const index = _.findIndex(data, ['title', oldData.title])
                                                    data.splice(index, 1);
                                                }
                                                else {
                                                    data.splice(data.indexOf(oldData.val), 1);
                                                }
                                                updateDB(data);
                                                console.log(data, '   data');
                                                return data;
                                            });
                                        }),
                                }}
                            />
                        </>
                    )
            }
        </Wrapper>
    )
}

export default AdminSettingsScreen
