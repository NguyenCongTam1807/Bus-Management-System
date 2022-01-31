
const initialState = {  
    user: null,
    listTrip:[],
    chooseTrip:[],
    listChair:[],
    tempPrice:0,
}  
  
export const reducer = (state = initialState, action) => {  
    switch (action.type) {  
        case 'login':  
            return {  
                ...state,  
                user: action.payload
            }  
        case 'listTrip':  
            return {  
                ...state,  
               listTrip: action.payload
            } 
        case 'listChair':  
            return {  
                ...state,  
                listChair: action.payload
            }  
        case 'tempPrice':
            return {
                ...state,
                tempPrice:action.payload
            }
        case 'chooseTrip':
            return {
                ...state,
                chooseTrip:action.payload
            }
        default:  
            return state  
    }  
}  
  