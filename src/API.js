import axios from "axios"
import cookies from "react-cookies"

export let endpoints = {
    'carcategory' : '/carcategory/',
    'carCategoryDetail': (categoryId) => `/carcategory/${categoryId}/`,
    'payment' : '/payment/',
    'bus' : '/bus/',
    'busDetail': (busId) => `/bus/${busId}/`,
    'chair' : '/chair/',
    'province' : '/province/',
    'routes' : '/routes/',
    'trip' : '/trip/',
    'bill' : '/bill/', 
    'billD': (billId) => `/bill/${billId}/`,
    'billDetailOfUser': (billId) => `/bill/${billId}/billdetail-user/`,
    'bill-details' : '/bill-details/', 
    "comments" : (tripId) => `/trip/${tripId}/comments/`,
    'deleteComments' : (commentId) => `/comments/${commentId}/`,
    "addComment": (tripId) => `/trip/${tripId}/add-comment/`,
    "tripDetail":(tripId) => `/trip/${tripId}/`,
    'user' : '/user/',
    'updateUser': (userId) => `/user/${userId}/`,
    'current-user' : '/user/current-user/',
    'login' : '/o/token/',
    'listTripOfUser' : '/user/trip-user/',
    'listBillsOfUser':'/user/bill-user/',
    'saveStripeInfo' : '/vexe/save-stripe-info/',
    'saveMailUser' : '/vexe/subscribe-email/',
    'sendMailUserSignUp':'/vexe/send-email/',
    'resetPassword' : '/vexe/reset-password/',
    'updatePassword': '/user/update-password/'
}

export let AuthAPI = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers : {
        'Authorization': `Bearer ${cookies.load('access_token')}`
    }
})

export default axios.create({
    baseURL: "http://127.0.0.1:8000/",
})