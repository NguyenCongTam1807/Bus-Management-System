import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Button from '@restart/ui/esm/Button';
import React, { useState } from 'react';
import { Button, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.css';

export function BookTicket(props){
    const [progress, setProgress] = useState(100)// giá trị thanh tiến trình progress bar

    const s1 = {
        textDecoration: 'none',
        color: 'black'
    }
    return(
        <>
            <Container style={{padding:"50px"}}>
                <ProgressBar style={{height:"30px"}} now={progress} label={`${progress}%`} />
                <h1 style={{textAlign:"center"}}>THÔNG TIN VÉ XE</h1>
            </Container>
            <Container>
                < h1 style={{textAlign:"center"}}>ĐẶT VÉ THÀNH CÔNG</h1>
                <Row>
                    <Col class="col-sm-4">
                    </Col>
                    <Col class="col-sm-4"> 
                        <Link to="/" style={s1}>
                            <Button style={{backgroundColor:"#5BBD2B" ,
                            margin:"50px 0 0 0",
                            height:"50%", 
                            borderRadius:"20px", 
                            width:"100%",
                            fontSize:"25px", 
                            color:"black",
                            padding:"10px",}} >
                            TRỞ VỀ TRANG CHỦ <FontAwesomeIcon icon={faChevronRight} /> 
                            </Button>{' '}
                        </Link>  
                    </Col>
                    <Col class="col-sm-4">
                    </Col>

                </Row>
              
            </Container>
            
        </>
    )
}
const mapStatetoProps = (state)=>{
    return {
        list : state.listTrip,
    }
}

export default connect(mapStatetoProps)(BookTicket)