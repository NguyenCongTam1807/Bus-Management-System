import React, { useEffect, useState } from 'react'
import { Form, Col, Container,Row,Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faMapMarkedAlt, faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import API, { endpoints } from './API';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function SearchBox(){
    const [routesBegin, setRoutesBegin] = useState([])
    const [routes, setRoutes] = useState([])
    const [trip, setTrip] = useState([])
    const [from, setFrom] = useState([])
    const [to, setTo] = useState([])
    const [date, setDate]=useState()
    const dispatch = useDispatch()

    const s1 = {
        textDecoration: 'none',
        color: 'black'
    }
    useEffect(()=>{
       fetchAPI()
       document.getElementById('dateForm').valueAsDate = new Date();
       setDate(document.getElementById('dateForm').value)
    }, [])

    const fetchAPI = () => {
         API.get(endpoints['routes']).then(res => {
            const arr1 = []
            for(let i=0; i<res.data.length;i++)
            {
               arr1.push(res.data[i].province_begins.name)
            }
            setRoutesBegin(Array.from(new Set(arr1)))
        })
    }

    const updateTrip =  (event) => {
        let s = event.target.value
        setFrom(s)
        let arr = []
        API.get(endpoints['routes']).then(res => {
            for(let i = 0; i<res.data.length; i++)
            {
                if (s === res.data[i].province_begins.name)
                    arr.push(res.data[i].province_to.name)
            }
            setRoutes(arr)
        })
    }

    const listTrip = async (event) => {
        event.preventDefault()
        axios.get("http://127.0.0.1:8000/trip/",{
                params:{
                    from: from,
                    to: to,
                    day: date,
                }
        }).then(res=> {
            setTrip(res.data)
            dispatch ({
                "type" :"listTrip",
                "payload": res.data
            })
        } ).catch(eror=> console.log(eror))
    }
 
    const listItem = routesBegin.map((r)=>{
        return (
            <>
                <option value={r} >
                    {r}
                 </option>
            </>
         )
    })
    const listItem2 = routes.map((r)=>{
        return (
            <>
                <option value={r} >
                    {r}
                 </option>
            </>
         )
    })

    return (
        <>
        <Container>
        <Form   style={{border:"none",borderRadius:"10px", boxShadow: "5px 5px 5px 5px #C0C0C0", padding:"10px 0 50px 10px", position:"relative",}}  >
            <Row>
                <Col class ="col-md-4" style={{border:"bold 2px",borderRadius:"10px"}} >
                    <Form.Group as={Col}  style={{width:"70%"}}>
                    <Form.Label> <FontAwesomeIcon icon={faMapMarkedAlt}  ></FontAwesomeIcon> Điểm đi</Form.Label>
                    <Form.Control as="select" defaultValue="Choose..." value={from} onChange={updateTrip} id="value1">
                        <option value="Chọn điểm đi" >Chọn điểm đi</option>
                        {listItem}
                    </Form.Control>
                    </Form.Group> 
                </Col>
                <Col class ="col-md-4">
                    <Form.Group as={Col}  style={{width:"70%"}}>
                    <Form.Label> <FontAwesomeIcon icon={faMapMarkedAlt}  ></FontAwesomeIcon> Điểm đến</Form.Label>
                    <Form.Control as="select" defaultValue="Choose..." id="value2" value={to} onChange={e =>{setTo(e.target.value)}}>
                        <option value="Chọn điểm đến">Chọn điểm đến</option>
                        {listItem2}
                    </Form.Control>
                    </Form.Group>
                </Col>
                <Col class ="col-md-4" width="75%">
                    <div class="form-group" style={{padding:"0 10px 10px 0"}}>
                        <label for="exampleFormControlInput1" style={{padding:"0 0 7px 0"}}> <FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon> Chọn ngày</label>
                        <input type="date" class="form-control" id="dateForm" placeholder="name@example.com"  value={date} onChange={e =>{setDate(e.target.value)}}/>
                    </div>
                </Col>
                </Row>
                <Row>
                <Col style={{padding:"5px 0 0 0"}}>
                    <Button  variant="danger" type="submit" style={{borderRadius:"10px",position:"absolute",right:"40px" }} onClick={listTrip} >
                        <Link to="/search" style={s1}><FontAwesomeIcon icon={faSearch}  /> Tìm kiếm chuyến xe</Link>  
                    </Button> {' '}
                </Col>
            </Row>
        </Form>
        </Container>
        </>
    )
}
