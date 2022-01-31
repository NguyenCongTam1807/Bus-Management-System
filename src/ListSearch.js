import './style.css'
import React, { useEffect, useState } from 'react'
import { Container, ProgressBar, Row, Col,Button, ListGroup, Spinner} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight,faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import SearchBox from './SearchBox';
import { connect, useDispatch} from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
export  function ListSearch(props){
    const [progress, setProgress] = useState(25)
    const moment = require('moment'); // npm install moment
    const dispatch = useDispatch()
    let history=useHistory()
    let list = props.list
    const s1 = {
        textDecoration: 'none',
        color: 'black'
    }
    const saveTrip =  async(event) => {
        let temp = event.target.value
        let arr=[]
        for (var i=0;i<list.length;i++){
            if (list[i].id===parseInt(temp))
            {
                arr.push(list[i])
                await dispatch ({
                    "type" :"chooseTrip",
                    "payload": arr
                })
            }
        }
        history.push('/book-ticket')
    }

    // const loadAmount = async (id)=>{
    //     let t = null
    //     console.info(id)
    //      axios.get("http://127.0.0.1:8000/chair/").then (res =>{
    //         t = res.data.length
    //     })
    //     console.info(t)
    //     return   <>
    //         <h3>Số ghế {t}</h3>
    //     </>
    // }
    let tripDetails = []
    if (list && list.length !== 0)
    {
        tripDetails = list.map((t)=>{
        return (
            <>
                <Row>
                    <div class="col-auto col-md-8">
                        <h1>Mã chuyến xe: {t.id}</h1>
                        <h1>Tuyến xe: {t.route.province_begins.name} - {t.route.province_to.name} </h1>
                        <h1>Thời gian: {moment(t.date).format('HH:mm')} - Ngày: {moment(t.date).format('DD-MM-YYYY')}</h1>
                    </div>
                    <div class="col-auto col-md-4">
                        <Button variant="danger" value={t.id} id="btnChoose" onClick={saveTrip}>   Đặt vé</Button>{' '}

                    </div>
                    <hr/>
                </Row>
            </>
        )
        })
    }
    else 
    {
        tripDetails = 
                <>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <h6>Không tìm thấy thông tin chuyến xe</h6>
                </>

    }
    const backPage = ()=>{
        history.push('/')
    }
    return(
        <>
            <Container style={{padding:"50px"}}>
                <ProgressBar style={{height:"30px"}} now={progress} label={`${progress}%`} />
                <h1 style={{textAlign:"center"}}>TÌM KIẾM CHUYẾN XE</h1>
            </Container>
            <SearchBox/>
            <Container>
                <ListGroup as="ul" style={{padding:"20px"}}>
                    <ListGroup.Item as="li" active>
                        <h3>THÔNG TIN TUYẾN XE</h3>
                    </ListGroup.Item>
                    <ListGroup.Item as="li">
                       {tripDetails}
                    </ListGroup.Item>
                </ListGroup>
            </Container>
            <Container>
            <Row>
                    <>   <Col>
                             <Button style={{backgroundColor:"#5BBD2B",
                             float:"left", 
                             margin:"50px 0 0 0", 
                             width:"40%",
                             height:"50%",
                             borderRadius:"20px", 
                             fontSize:"25px", 
                             color:"black",
                             padding:"10px"}}
                             onClick={backPage} >
                                QUAY LẠI 
                            </Button>{' '}
                        </Col>
                    </>
                </Row>
            </Container>
        </>
    )
}
const mapStatetoProps = (state)=>{
    return {
        list : state.listTrip
    }
}

export default connect(mapStatetoProps)(ListSearch)