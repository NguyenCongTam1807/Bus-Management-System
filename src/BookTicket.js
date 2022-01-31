import './style.css'
// import Button from '@restart/ui/esm/Button';
import React, { useEffect, useState } from 'react'
import { Container, ProgressBar, Row, Col, Card, Image,Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight,faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { connect, useDispatch } from 'react-redux';
import API, { endpoints } from './API';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import cookies from 'react-cookies'
export function BookTicket(props){
    const [progress, setProgress] = useState(50)// giá trị thanh tiến trình progress bar
    const [chooseSeat, setChooseSeat] = useState([]) // lưu giá trị các ghê được chọn tạm thời
    const [amount, setAmount] = useState(0)// lưu số lượng ghế được chọn
    const [numberSeat, setNumberSeat] = useState(0)// lưu số ghế
    const [chair, setChair] = useState([])//lưu danh sách ghế)
    const [price, setPrice] = useState(0)//lưu giá tạm thời
    const item = props.list
    const dispatch = useDispatch()
    let img = null
    let bus = 0//lưu thông tin xe để so sánh lấy số lượng ghế cập nhật cho setNumber
    let temp = 0

    let history = useHistory()

    useEffect(()=>{
        fetchAPI()
    },[])

    const s1 = {
        textDecoration: 'none',
        color: 'black'
    }
    const s = {
        backgroundColor:"#00AE72",
        boxShadow: "5px #C0C0C0"
    }

    //Kiểu tra ràng buộc khi người dùng đi thẳng vào trang bằng url
    let user = cookies.load("user")
    if(user!==undefined)
    {
        if (item && item.length !== 0){
            img = item[0].route.province_to.image
            // bus = item[0].route.carCategory
            bus = item[0].bus
            temp = item[0].route.fare
        }
        else
        {
            window.alert("Vui lòng chọn chuyến xe")
            history.push('/search')
        }
    }
    else
    {
        window.alert("Vui lòng đăng nhập")
        history.push('/login')
    }
      //Hàm gọi API carCategory để lấy số ghế và API ghế để hiển thị ghế
    const fetchAPI = () => {
        let num = 0
        API.get(endpoints['carcategory']).then(res=>{
            for(let i=0; i<res.data.results.length; i++)
            {
                if (res.data.results[i].id === bus)
                   num =  res.data.results[i].seats
            }   
            setNumberSeat(num)
        })
        let arr = []
        API.get(endpoints['chair']).then(res=>{
            for(let i=0; i<res.data.length; i++)
            {
                if (res.data[i].bus === bus)
                   arr.push(res.data[i])
            }   
            setChair(arr)
        })
    } 

    //Hiển thị thông tin chuyến xe được chọn
    const tripDetails = item.map((t)=>{
        return (
            <>
                <h5>Ngày khởi hành: <b>{t.date}</b></h5>
                <h5>Tuyến xe: <b>{t.route.province_begins.name} - {t.route.province_to.name}</b></h5>
                <h5>Giá vé: <b> {t.route.fare} VNĐ</b></h5>
                <h5>Số km: <b> {t.route.disNumber} km</b></h5>
                <h5>Thời gian dự kiến:<b> {t.total_time} </b></h5>
                <h5>Mã xe: <b>{t.bus}</b></h5>
            </>
        )
        
    })

    //Thay đổi trạng thái của button chọn ghế. Cập nhật các giá trị tạm thời như: ghế được chọn, tiền tạm thời, số lượng
    const updateColor =  (event) => {
        if(event.target.style.backgroundColor==="white"){
            setAmount(amount+1)
            setChooseSeat(prevArray => [...prevArray,  event.target.value])
            setPrice(temp*(amount+1))
            event.target.style.backgroundColor="#489620"
        }
        else
        {
            setAmount(amount-1)
            setChooseSeat(chooseSeat.filter(item => item !== event.target.value))
            setPrice(temp*(amount-1))
            event.target.style.backgroundColor="white"
        }
    }
    //hiển thị ghế
    const listItem = chooseSeat.map((r)=>{
        return (
                <h6>Mã ghế: {r}</h6>
         )
    })
    const nextPage = (event)=>{
        dispatch (
            {
            "type":"listChair",
            "payload": chooseSeat,
            })
        dispatch(
            {
            "type":"tempPrice",
            "payload": price,
            },
        )
        console.info(chooseSeat)
        console.info(price)

    }
    //Kiểm tra khi nào chọn ghế mới được chọn Button tiếp tục
    let btn=null
    if (amount > 0)
        btn = <>
            <Link to="/info-user" style={s1}>
                    <Button style={{backgroundColor:"#5BBD2B" ,
                    float:"right", 
                    margin:"50px 0 0 0",
                    width:"40%",
                    height:"50%", 
                    borderRadius:"20px", 
                    fontSize:"25px", 
                    color:"black",
                    padding:"10px",}} id="btn" onClick={nextPage} >
                    TIẾP TỤC <FontAwesomeIcon icon={faChevronRight} /> 
                    </Button>{' '}
            </Link>  
        </>
    else
        btn = <>
         <Link to="/info-user" style={s1}>
                <Button style={{backgroundColor:"#5BBD2B" ,
                float:"right", 
                margin:"50px 0 0 0",
                width:"40%",
                height:"50%", 
                borderRadius:"20px", 
                fontSize:"25px", 
                color:"black",
                padding:"10px",}} disabled="true" >
                TIẾP TỤC <FontAwesomeIcon icon={faChevronRight} /> 
                </Button>{' '}
            </Link>  
        </>


   //Cách hiển thị sơ đồ ghế theo xe giường
    let items = []
    for (let i=0; i< chair.length ;i++)
        if (i<36)
        {
            if(chair[i].active===false)
                items.push(<Button style={{backgroundColor:"#DF0029", width:"14.5%", border:"none", borderRadius:"5px", margin:"5px", color:"black", opacity:"1"}} onClick={updateColor}  value={chair[i].id} disabled>{chair[i].name}</Button>)
            else
                items.push(<Button style={{backgroundColor:"white", width:"14.5%", border:"none", borderRadius:"5px", margin:"5px", color:"black"}} onClick={updateColor}   value={chair[i].id}>{chair[i].name}</Button>)
        }
        else 
        {
            if(chair[i].active===false)
                items.push(<Button style={{backgroundColor:"#DF0029", width:"8%", border:"none", borderRadius:"5px", margin:"5px", color:"black", opacity:"1"}} onClick={updateColor}   value={chair[i].id} disabled>{chair[i].name}</Button>)
            else
                items.push(<Button style={{backgroundColor:"white", width:"8%", border:"none", borderRadius:"5px", margin:"5px", color:"black"}} onClick={updateColor}   value={chair[i].id}>{chair[i].name}</Button>)
        }
    return(
        <>
            <Container style={{padding:"50px"}}>
                <ProgressBar style={{height:"30px"}} now={progress} label={`${progress}%`} />
                <h1 style={{textAlign:"center"}}>CHỌN GHẾ</h1>
            </Container>
            <Container>
                <Row>
                    <Col class="col-sm-5">
                        <Card style={s}>
                            <Card.Body >
                                <Card.Title style={{textAlign:"center"}}><h3>THÔNG TIN CHUYẾN XE</h3></Card.Title>
                                <Card.Text>
                                    <hr/>
                                    <Row>
                                        <Col class="col-sm-8">
                                            {tripDetails}
                                        </Col>
                                        <Col class="col-sm-4">
                                            <Image style={{width:"100%"}}src={img} rounded />
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col class="col-sm-7">
                        <Card style={s}>
                            <Card.Body >
                                <Card.Title  style={{textAlign:"center"}}><h3>SƠ ĐỒ GHẾ</h3></Card.Title>
                                <hr/>
                                <Card.Text>
                                    <Row>
                                        <Col><h6 className="text-center">Tầng trên</h6></Col>
                                        <Col><h6 className="text-center">Tầng dưới</h6></Col>
                                    </Row>
                                    <Row>
                                        <Col >
                                            <Container>
                                                {items}
                                            </Container>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <h5 >Trạng thái ghế</h5>
                                        <Col class="col-sm-4">
                                            <Container>
                                                <label style={{backgroundColor:"#489620", 
                                                color:"#000000",  
                                                border:"none", 
                                                borderRadius:"5px",
                                                padding:"10px",
                                                width:"100%",
                                                textAlign:"center"}}disabled>Đang chọn</label>
                                            </Container>
                                        </Col>
                                        <Col class="col-sm-4">
                                            <Container>
                                                <label style={{backgroundColor:"#DF0029", 
                                                color:"#000000",  
                                                border:"none", 
                                                borderRadius:"5px",
                                                padding:"10px",
                                                width:"100%",
                                                textAlign:"center"}}disabled>Đã được chọn</label>
                                            </Container>
                                        </Col>
                                        <Col class="col-sm-4">
                                            <Container>
                                                <label style={{backgroundColor:"white",
                                                color:"#000000" ,
                                                border:"none", 
                                                borderRadius:"5px",
                                                padding:"10px",
                                                width:"100%"}} disabled>Chưa được chọn</label>
                                            </Container>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col class="col-sm-4">
                                                <h5> Ghế đã chọn </h5>
                                                {listItem}
                                        </Col>
                                        <Col class="col-sm-4">
                                             <Container>
                                                <h5> Số lượng </h5>
                                                <h5>{amount}</h5>
                                            </Container>
                                        </Col>
                                        <Col class="col-sm-4">
                                            <Container>
                                                <h5> Tổng tiền </h5>
                                                <h5>{price}</h5>
                                            </Container>
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <h6><i>(*)Vui lòng chọn ghế để nhấn tiếp tục</i></h6>
                    </Col>
                    </Row>
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
                                padding:"10px"}} >
                                <Link to="/search" style={s1}> <FontAwesomeIcon icon={faChevronLeft}  /> QUAY LẠI 
                                </Link>
                                </Button>{' '}
                            </Col>
                            <Col>
                                {btn}
                            </Col>
                            
                        </>
                        </Row>
            </Container>
        </>
    )
}
const mapStatetoProps = (state)=>{
    return {
        list : state.chooseTrip,
    }
}

export default connect(mapStatetoProps)(BookTicket)