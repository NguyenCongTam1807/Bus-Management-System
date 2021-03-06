import React, {useState, useEffect} from 'react'
import { Container, Row, Col, Image, Spinner, Badge, Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { useParams } from 'react-router'
import API, { endpoints } from './API'
import cookies from 'react-cookies'
import Moment from 'react-moment'

function TripDetail() {
    let user = cookies.load("user")
    const [trip, setTrip] = useState(null)
    const [carCategoryId, setcarCategoryId] = useState(0)
    const [carCategory, setCarCategory] = useState(null)
    const [busId, setbusId] = useState(0)
    const [bus, setBus] = useState(null)
    const [comments, setComments] = useState()
    const [comentContent, setComentContent] = useState()
    const [changed, setchanged] = useState(-1)
    let { tripId } = useParams()
    let image = user.avatar
    let firstName = user.first_name
    let lastName = user.last_name

    useEffect(async () => {
        let res = await API.get(endpoints['tripDetail'](tripId)).then(res=>{
                console.info(res.data)
                setTrip(res.data)
                setcarCategoryId(res.data.route.carCategory)
                setbusId(res.data.bus)    
            }
        )
        let responce = await API.get(endpoints['carCategoryDetail'](carCategoryId))
        console.info(responce.data)
        setCarCategory(responce.data)

        let bre = await API.get(endpoints['busDetail'](busId))
        console.info(bre.data)
        setBus(bre.data)
    },[busId])

    useEffect(async () => {
        let cRes = await API.get(endpoints['comments'](tripId))
        console.info(cRes.data)
        setComments(cRes.data)
    },[changed])

    const addComment = async (event) => {
        event.preventDefault()
        try {
            let addres = await API.post(endpoints['addComment'](tripId),{
                "content" : comentContent
            }, {
                headers : {
                    'Authorization': `Bearer ${cookies.load('access_token')}`
                }
            })
            
            let c = addres.data
            comments.unshift(c)
            setComments(comments)
            setchanged(-2)
            setComentContent("")
        } catch (error) {
            console.error(error)    
        }

    }
    let callbackFunction = (childata) => {
        setchanged(childata)
    }
    // load Effect 1 l???n, khi reload l???i s??? m???t, tr??n useParams thay ?????i c???n load l???i.

    if(trip === null || carCategory == null || bus === null || user === null)
        return <div className="text-center"><Spinner animation="border" variant="primary" /></div>
    
    else
        return (
            <Container className="mt-5 mb-5">
                <Row>
                    <Col md={5} xs={12}>
                        <Image src={trip.route.province_to.image} rounded fluid/>
                    </Col>
                    <Col md={7} xs={12}>
                        <TripDetailBase label="??i???m B???t ?????u: " infomationTrip={trip.route.province_begins.name}/>
                        <TripDetailBase label="??i???m ?????n: " infomationTrip={trip.route.province_to.name}/>
                        <TripDetailBase label="Ng??y Kh???i H??nh: " infomationTrip={ (trip.date).substring(0,10)}/>
                        <TripDetailBase label="Gi?? Ti???n: " infomationTrip={trip.route.fare + " VN??"}/>
                        <TripDetailBase label="Kho???ng C??ch: " infomationTrip={trip.route.disNumber + " KM"} />
                        <TripDetailBase label="T??i X???: " infomationTrip={trip.user.last_name +" "+ trip.user.first_name}/>
                        <TripDetailBase label="Lo???i Xe: " infomationTrip={carCategory.name}/>
                        <TripDetailBase label="Bi???n S??? Xe: " infomationTrip={bus.license_plate}/>
                        <TripDetailBase label="S??? Gh???: " infomationTrip={carCategory.seats}/> 
                    </Col>     
                </Row>
                <Row>
                    <h4 style={{backgroundColor: '#faeee7' }}>Comments</h4>
                    <Col xs={12} md={12}>
                    <Image src={image} thumbnail width="7%" /> <Badge bg="light" text="dark"><h5>{lastName + " " + firstName}</h5></Badge>
                    </Col>
                    <Form onSubmit={addComment}>
                        <Form.Group as={Row} className="mb-3" controlId="Comments">
                            <Form.Control   as="textarea" 
                                            placeHolder="Nh???p v??o n???i dung c???a b???n..."
                                            value={comentContent}
                                            onChange={(event) => setComentContent(event.target.value) }
                                            />
                        </Form.Group>
                        <div style={{ textAlign:"right", marginBottom:"15px"}}>
                            <Button variant="success" type="submit" style={{ 
                                width:"10%"}}>????ng</Button>
                        </div>
                    </Form>
                        <ListGroup>
                            <ListGroupItem>
                                {comments.map(c=> <Comment id={c.user.id} updateContent={comentContent} 
                                                            parentCallback={callbackFunction}
                                                            image={c.user.avatar} commentId={c.id} 
                                                            name={c.user.last_name + " " + c.user.first_name} 
                                                            content={c.content} time={c.updated_date} />)}
                            </ListGroupItem>
                        </ListGroup>

                </Row>
            </Container>
        )
}

const Comment = (props) => {
    let user = cookies.load("user")
    let changeComment = null


    if(user.id == props.id){
        changeComment = <>
            <div style={{ textAlign:"right"}}>
                <Button onClick={()=>{
                    API.patch(endpoints['deleteComments'](props.commentId),{
                                "content" : props.updateContent
                            })
                    props.parentCallback(props.commentId)
                    window.alert("C???p Nh???t Th??nh C??ng")
                }} variant="success" style={{ 
                    width:"10%" , marginRight:"5px" }}>S???a</Button>
                <Button variant="danger" onClick={()=>{
                            API.delete(endpoints['deleteComments'](props.commentId))
                            window.alert("X??a Th??nh C??ng")
                            props.parentCallback(props.commentId)
                        }} style={{ 
                    width:"10%"}}>X??a</Button>
            </div>
        </>
    }
    return(
        <ListGroupItem>
            <Col xs={12} md={12}>
            <Image src={props.image} thumbnail width="7%" /> <Badge bg="light" text="dark"><h5>{props.name}</h5></Badge>
            </Col>
            <Col md={{ span: 9, offset: 1 }}><h5>{props.content}</h5></Col>
            <Col>
                {changeComment}
                <Moment fromNow>{props.time}</Moment>
            </Col>
        </ListGroupItem>
    )
}

const TripDetailBase = (props) => {
    return(
        <Row>
            <Col md={{ span: 3 }}>
                <h4>
                    <Badge bg="info" text="dark">
                        {props.label}
                    </Badge>
                </h4>
            </Col>
            <Col md={{ span: 5, offset: 0.5 }}>
            <h5>
                {props.infomationTrip}
            </h5>
            </Col>
        </Row>
    )
}

export default TripDetail
