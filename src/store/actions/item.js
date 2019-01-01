import * as actionTypes from './actionTypes';
import axios from '../../axios-instance';

export const updateMode = (mode) => {
    console.log(mode);
    return {
        type: actionTypes.UPDATE_MODE,
        mode
    }
};

export const clearMessage = ( ) => {
    const payload = {
        created: false,
        loading: false,
        error: false
    };
    return {
        payload,
        type: actionTypes.CLEAR_MESSAGE
    };
};

export const createItemSuccess = ( id, formData ) => {
    return {
        type: actionTypes.CREATE_ITEM_SUCCESS,
        itemId: id,
        formData: formData
    };
};

export const createItemFail = ( error ) => {
    console.log('create item fail', error)
    return {
        type: actionTypes.CREATE_ITEM_FAIL,
        error: error
    };
};

export const createItemStart = () => {
    return {
        type: actionTypes.CREATE_ITEM_START
    };
};

export const checkForItem = (formData, token, userId, name ) => {
    return dispatch => {
        axios.get(`/items.json?orderBy="mac"&equalTo="${formData['mac']}"&auth=${token}`)
            .then( response => {
                const obj = response.data;
                let empty = true;
                let item = null;
                for(var key in obj) {
                    if(obj.hasOwnProperty(key)) {
                        item = response.data[key];
                        empty = false;
                        break;
                    }
                }

                if (empty) {
                    dispatch( createItem( formData, token, userId, name ) );
                } else {
                    console.log('fail in action')
                    dispatch( createItemFail( {message: `AP already exists for mac: ${item.mac}`} ) );
                }
            } )
            .catch( error => {
                dispatch( createItemFail( error ) );
            } );
    };
};

export const createItem = ( formData, token, userId, name ) => {
    return dispatch => {
        const data = {
            'created_at': new Date(),
            'userId': userId,
            'joined': false,
            'complete': false,
            'checkedIn': false,
            'created_by': name,
            'location': formData['location'],
            'mac': formData['mac'],
            'port': formData['port']
        };

        dispatch( createItemStart() );
        axios.post( '/items.json?auth=' + token, JSON.stringify(data) )
            .then( response => {
                dispatch( createItemSuccess( response.data.name, formData ) );
            } )
            .catch( error => {
                dispatch( createItemFail( error ) );
            } );
    };
};

export const createItemInit = () => {
    return {
        type: actionTypes.CREATE_ITEM_INIT
    };
};

export const fetchItemsTimeout = (token, userId) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(fetchItems(token, userId));
        }, 10000);
    };
};

export const fetchItemsSuccess = ( items, uniqueDates ) => {
    return {
        type: actionTypes.FETCH_ITEMS_SUCCESS,
        items,
        uniqueDates
    };
};

export const fetchItemsFail = ( error ) => {
    return {
        type: actionTypes.FETCH_ITEMS_FAIL,
        error: error
    };
};

export const fetchItemsStart = () => {
    return {
        type: actionTypes.FETCH_ITEMS_START
    };
};

export const fetchItems = (token, userId) => {
    return dispatch => {
        dispatch(fetchItemsStart());
        const queryParams = '?auth=' + token;
        axios.get( '/items.json' + queryParams)
            .then( res => {
                const fetchedItems = [];
                for ( let key in res.data ) {
                    fetchedItems.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                let dates = fetchedItems.map(item => item.created_at);
                let unqiueDates = [];

                for (var i = 0; i < dates.length; i++) {
                    if (unqiueDates.length) {
                        const newDate = new Date(dates[i]);
                        if (unqiueDates.indexOf(newDate.toLocaleDateString('en-US')) === -1) {
                            unqiueDates.push(newDate.toLocaleDateString('en-US'));
                        }
                    } else {
                        const newDate = new Date(dates[i]);
                        unqiueDates.push(newDate.toLocaleDateString('en-US'));
                    }
                }
                dispatch(fetchItemsSuccess(fetchedItems, unqiueDates));
            } )
            .catch( err => {
                dispatch(fetchItemsFail(err));
            } );
    };
};

export const updateItemSuccess = ( id, updatedItem ) => {
    return {
        type: actionTypes.UPDATE_ITEM_SUCCESS,
        itemId: id,
        updatedItem
    };
};

export const updateItemFail = ( error ) => {
    return {
        type: actionTypes.UPDATE_ITEM_FAIL,
        error: error
    };
};

export const updateItemStart = () => {
    return {
        type: actionTypes.UPDATE_ITEM_START
    };
};

export const updateItem = (token, userId, item) => {
    return dispatch => {
        dispatch(updateItemStart());
        const queryParams = '?auth=' + token;
        axios.put( `/items/${item.id}.json${queryParams}`, item)
            .then( res => {
                const updatedItem = res.data;
                console.log('new item', updatedItem);
                dispatch(updateItemSuccess(item.id, updatedItem));
            } )
            .catch( err => {
                dispatch(updateItemFail(err));
            } );
    };
};

export const deleteItemSuccess = ( id, deletedItem ) => {
    return {
        type: actionTypes.DELETE_ITEM_SUCCESS,
        itemId: id,
        deletedItem
    };
};

export const deleteItemFail = ( error ) => {
    return {
        type: actionTypes.DELETE_ITEM_FAIL,
        error: error
    };
};

export const deleteItemStart = () => {
    return {
        type: actionTypes.DELETE_ITEM_START
    };
};

export const deleteItem = (token, userId, item) => {
    return dispatch => {
        dispatch(deleteItemStart());
        const queryParams = '?auth=' + token;
        axios.delete( `/items/${item.id}.json${queryParams}`)
            .then( res => {
                dispatch(deleteItemSuccess(item.id, item));
            } )
            .catch( err => {
                dispatch(deleteItemFail(err));
            } );
    };
};

export const checkMode = () => {
    return dispatch => {
        const mode = localStorage.getItem('mode');
        if (mode) {
            dispatch(updateMode(mode));
        }
    };
};