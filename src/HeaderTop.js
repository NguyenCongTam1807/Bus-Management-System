import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav,Navbar, Container} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhoneAlt,faMailBulk,faLightbulb} from '@fortawesome/free-solid-svg-icons';


export default function HeaderTop(){
    
   return(
    <>
    <Navbar style={{backgroundColor: '#00613c'}} variant="dark" >
        <Container>
            <Nav className="mr-auto">
                <Nav.Link href="#home"><FontAwesomeIcon icon={faPhoneAlt} color="white" ></FontAwesomeIcon> 19006067</Nav.Link>
                <Nav.Link href="#home"><FontAwesomeIcon icon={faMailBulk} color="white" ></FontAwesomeIcon> hotro@ou.edu.vn</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="#home" style={{float:"right"}}><img src="/images/logoFB.png" style={{width:"20px"}} alt="logoFace" /></Nav.Link>
                <Nav.Link href="#home" style={{float:"right"}}><img src="/images/logoYT.png" style={{width:"20px"}} alt="logoYoutube" /></Nav.Link>
                <Nav.Link href="#home" style={{float:"right"}}><img src="/images/flagVN.png" style={{width:"20px"}} alt="covietnam" /> VN </Nav.Link>
                <Nav.Link href="#home" style={{float:"right"}}><img src="/images/flagUK.png" style={{width:"20px"}} alt="coanhquoc"/> EN</Nav.Link>
                <Nav.Link href="#home" style={{float:"right"}}><FontAwesomeIcon icon={faLightbulb} color="white" ></FontAwesomeIcon> </Nav.Link>
            </Nav>
        </Container>
    </Navbar>
  </>
   )
}