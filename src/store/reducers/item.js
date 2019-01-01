import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    items: [],
    uniqueDates: [],
    loading: false,
    created: false,
    id: null,
    mode: 'Setup',
    error: null
};

const updateMode = (state, action) => {
    console.log('reducer update mode', action.mode);
    localStorage.setItem('mode', action.mode);
    return updateObject(state, {mode: action.mode});
};

const clearMessage = (state, action) => {
    return updateObject(state, {...action.payload})
};

const createItemInit = ( state, action ) => {
    return updateObject( state, { created: false } );
};

const createItemStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const createItemSuccess = ( state, action ) => {
    const newOrder = updateObject( action.orderData, { id: action.orderId } );
    return updateObject( state, {
        loading: false,
        created: true,
        items: state.items.concat( newOrder )
    } );
};

const createItemFail = ( state, action ) => {
    return updateObject( state, { error: action.error, loading: false } );
};

const fetchItemsStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const fetchItemsSuccess = ( state, action ) => {
    return updateObject( state, {
        items: action.items,
        uniqueDates: action.uniqueDates,
        loading: false
    } );
};

const fetchItemsFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const updateItemFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const updateItemStart = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const updateItemSuccess = ( state, action ) => {
    const items = state.items.map(item => item.id === action.itemId ? { ...action.updatedItem } : item);
    return updateObject( state, {
        loading: false,
        items
    } );
};

const deleteItemFail = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const deleteItemStart = ( state, action ) => {
    return updateObject( state, { loading: false } );
};

const deleteItemSuccess = ( state, action ) => {
    const items = state.items.filter(item => item.id !== action.itemId);
    console.log(items);
    return updateObject( state, {
        loading: false,
        items
    } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.CLEAR_MESSAGE: return clearMessage( state, action );
        case actionTypes.CREATE_ITEM_INIT: return createItemInit( state, action );
        case actionTypes.CREATE_ITEM_START: return createItemStart( state, action );
        case actionTypes.CREATE_ITEM_SUCCESS: return createItemSuccess( state, action );
        case actionTypes.CREATE_ITEM_FAIL: return createItemFail( state, action );
        case actionTypes.FETCH_ITEMS_START: return fetchItemsStart( state, action );
        case actionTypes.FETCH_ITEMS_SUCCESS: return fetchItemsSuccess( state, action );
        case actionTypes.FETCH_ITEMS_FAIL: return fetchItemsFail( state, action );
        case actionTypes.UPDATE_ITEM_FAIL: return updateItemFail( state, action );
        case actionTypes.UPDATE_ITEM_SUCCESS: return updateItemSuccess( state, action );
        case actionTypes.UPDATE_ITEM_START: return updateItemStart( state, action );
        case actionTypes.DELETE_ITEM_FAIL: return deleteItemFail( state, action );
        case actionTypes.DELETE_ITEM_SUCCESS: return deleteItemSuccess( state, action );
        case actionTypes.DELETE_ITEM_START: return deleteItemStart( state, action );
        case actionTypes.UPDATE_MODE: return updateMode( state, action );
        default: return state;
    }
};

export default reducer;