import Button from "@restart/ui/esm/Button";
import React, {useEffect, useState} from "react";
import cookies from 'react-cookies'
import { Card,Row,Col, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLongArrowAltRight,faClock, faMapMarkerAlt,faTags} from '@fortawesome/free-solid-svg-icons';
import API, { endpoints } from "./API";
import { Link } from "react-router-dom";

export default function Trip() {
    let user = cookies.load("user")
    const [trip, setTrip] = useState([])

    useEffect(()=>{
        let arr=[]
        API.get(endpoints['listTripOfUser'],{
            headers: {
                'Authorization': `Bearer ${cookies.load('access_token')}`
            } 
        }).then(res => {
            for(let i=0; i<res.data.length;i++)
                    arr.push(res.data[i])
            setTrip(arr)
        })

    }, [])

    const listItem = trip.map((t) =>{
            console.info(t)
            return (
                <CardTitle id={t.id} image={t.route.province_to.image}  
                    provinceBeginName = {t.route.province_begins.name} 
                    provinceToName=  {t.route.province_to.name}
                    routeDisNumber = {t.route.disNumber}
                    totalTime = {t.total_time}
                    fare = {t.route.fare}
                />
            ) 
        }
    )
    
    if (user != null)
        return (
                <Container>
                    <h4 className="text-center text-danger">Thông Tin Các Chuyến Xe Bạn Đã Đi</h4>
                    <Row xs={1} md={2} className="g-4">
                        <>
                            {listItem}
                        </>
                    </Row>
                </Container>
        )
    else
        return (
            <>
                <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                <h3 className="text-center text-danger">Để sử dụng chức năng này bạn cần đăng nhập</h3> 
            </>
        )

}

const CardTitle = (props) => {
    let path = `/trip/${props.id}/`
    return (
        <Col style={{width:"25%"}}>
            <Card style={{border:"none",borderRadius:"10px", boxShadow: "5px 5px 5px #C0C0C0"}}>
                <Link to={path}>
                    <Card.Img variant="top" src={props.image} style={{width:"300px", height:"200px", margin:"0 -6px", borderRadius:"10px 10px 0 0",objectFit:"cover"}} />
                </Link>
                <Card.Body>
                    <Card.Title style={{textAlign:"center", fontSize:"18px"}}>{props.provinceBeginName} <FontAwesomeIcon icon={faLongArrowAltRight} color="orange" ></FontAwesomeIcon> {props.provinceToName} </Card.Title>
                    <Card.Text>
                        <div >
                            <div class="row" >
                                <div class="col-auto col-md-6" style={{textAlign:"left"}}>
                                    <h6> <FontAwesomeIcon icon={faMapMarkerAlt} color="orange" ></FontAwesomeIcon>  Số km</h6>
                                    <h6> <FontAwesomeIcon icon={faClock} color="orange" ></FontAwesomeIcon> Thời gian</h6>
                                    <h6> <FontAwesomeIcon icon={faTags} color="orange" ></FontAwesomeIcon> Giá tiền</h6>
                                </div>
                                <div class="col-auto col-md-6" style={{textAlign:"right"}}>
                                    <h6>{props.routeDisNumber}km</h6>
                                    <h6>{props.totalTime}</h6>
                                    <h6>{props.fare} VNĐ</h6>   
                                </div>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    )
}