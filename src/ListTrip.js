import Button from "@restart/ui/esm/Button";
import React, {useEffect, useState} from "react";
import { Card,Row,Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLongArrowAltRight,faClock, faMapMarkerAlt,faTags} from '@fortawesome/free-solid-svg-icons';
import API, { endpoints } from "./API";
export default function ListTrip(){
    const [trip, setTrip] = useState([])

    useEffect(()=>{
        let arr=[]
         API.get(endpoints['trip']).then(res => {
            for(let i=0; i<res.data.length;i++)
                if (i<8)
                    arr.push(res.data[i])
            setTrip(arr)
        })

    }, [])

    const listItem = trip.map((t) =>{
            console.info(t)
            return (
                <Col style={{width:"25%"}}>
                    <Button style={{border:"none",borderRadius:"10px", boxShadow: "5px 5px 5px #C0C0C0"}}>
                        <Card.Img variant="top" src={t.route.province_to.image} style={{width:"300px", height:"200px", margin:"0 -6px", borderRadius:"10px 10px 0 0",objectFit:"cover"}} />
                        <Card.Body>
                            <Card.Title style={{textAlign:"center", fontSize:"18px"}}>{t.route.province_begins.name} <FontAwesomeIcon icon={faLongArrowAltRight} color="orange" ></FontAwesomeIcon> {t.route.province_to.name} </Card.Title>
                            <Card.Text>
                                <div >
                                    <div class="row" >
                                        <div class="col-auto col-md-6" style={{textAlign:"left"}}>
                                            <h6> <FontAwesomeIcon icon={faMapMarkerAlt} color="orange" ></FontAwesomeIcon>  Số km</h6>
                                            <h6> <FontAwesomeIcon icon={faClock} color="orange" ></FontAwesomeIcon> Thời gian</h6>
                                        </div>
                                        <div class="col-auto col-md-6" style={{textAlign:"right"}}>
                                            <h6>{t.route.disNumber}km</h6>
                                            <h6>{t.total_time}</h6>
                                        </div>
                                    </div>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Button>
                </Col>
                )
            }
    )
    return(
        <Container>
            <h4>CÁC TUYẾN XE PHỔ BIẾN</h4>
            <Row xs={1} md={2} className="g-4">
                <>
                    {listItem}
                </>
            </Row>
        </Container>
    )
}
