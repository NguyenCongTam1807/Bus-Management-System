import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import Header from './Header';
import Footer from './Footer';
import HeaderTop from './HeaderTop';
import Login from './Login'
import Register from './Register';
import Body from "./Body.js"
import BookTicket from './BookTicket';
import Trip from './Trip';
import UserInfo from './UserInfo';
import ListSearch from './ListSearch';
import InformationUser from './InformationUser';
import TripDetail from './TripDetail';
import Bill from './Bill';
import BillsOfUser from './BillsOfUser'
import { ListTicket } from './ListTicket';
import MessengerCustomerChat from 'react-messenger-customer-chat'
const stripePromise = loadStripe("pk_test_51Jhu5WE7bAWKpDUmdLAG2WG8K2yNJ2HIAXDo66vJNjRdscPJ63LtjLJ0uPYWXxpIaeMZz8oBcGceBgqLPmbOUmk200Ju9SbpyP")

function App() {
  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <HeaderTop />
        <Header />
        <Switch>
          <Route exact path="/" component={Body}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/search" component={ListSearch} />
          <Route exact path="/book-ticket" component={BookTicket} />
          <Route exact path="/info-user" component={InformationUser} />
          <Route exact path="/user" component={UserInfo} />
          <Route exact path="/bill" component={Bill} />
          <Route exact path="/trip" component={Trip} />
          <Route exact path="/bills" component={BillsOfUser} />
          <Route exact path="/trip/:tripId/" component={TripDetail} />
          <Route exact path="/ticket" component={ListTicket} />
        </Switch>
        {/* <MessengerCustomerChat
        pageId="659726907529044"
        appId="919128705667563"/>, */}
        <Footer />
      </BrowserRouter>
    </Elements>

  );
}

export default App;
