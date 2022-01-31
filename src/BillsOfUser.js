import React,{useState, useEffect} from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { Link } from "react-router-dom";
import API,{  endpoints } from './API'
import cookies from 'react-cookies'

export default function BillsOfUser() {
    const [bills, setBills] = useState([])
    const [billId, setBillId] = useState()
    const [bill, setBill] = useState()
    const [listBillDetail, setListBillDetail] = useState([])

    
    useEffect( async () => {
        // tạo mảng lưu trử data các bill
        let arr = []
        await API.get(endpoints['listBillsOfUser'],{
            headers: {
                'Authorization': `Bearer ${cookies.load('access_token')}`
                } 
        }).then((res) => {
            for(let i=0; i<res.data.length; i++)
                arr.push(res.data[i])
            setBills(arr)
        })
    },[])
    

    useEffect( async ()=> {
            let array = []
            let Bres = await API.get(endpoints['billD'](billId))
            setBill(Bres.data)
            await API.get(endpoints['billDetailOfUser'](billId)).then((res)=>{
                for(let i=0; i<res.data.length; i++)
                    array.push(res.data[i])
                setListBillDetail(array)
                console.log(res)
            })
            
    }, [billId])


    const listBill = bills.map((b)=> {
        return (
            <>
            <Card border="warning" style={{ width: '25rem' }} onClick={()=>{setBillId(b.id)}}>
                <Card.Header>Hóa Đơn Ngày: {b.date}</Card.Header>
                <Card.Body>
                <Card.Text>Loại Hình Thanh Toán: {b.payment.name}</Card.Text>
                <Card.Text>Tổng Tiền : {b.total}</Card.Text>
                </Card.Body>
            </Card>
            <br />
            </>
        )
    })

    const listBillDetailOfUser = listBillDetail.map((billDetail)=>{
        return(
            <>
            <Card border="warning" style={{ width: '25rem', }}>
                <Card.Header>Chuyến Xe : {billDetail.trip.route.province_begins.name} - {billDetail.trip.route.province_to.name}</Card.Header>
                <Card.Body>
                <Card.Text>Ghế: {billDetail.chair.name}</Card.Text>
                <Card.Text>Giá Vé : {billDetail.cost}</Card.Text>
                </Card.Body>
            </Card>
            <br />
            </>
        )
    })

    let ABill = null
    if (bill != null){
        ABill = <div>
                    <h4 className="text-center text-danger mb-4 mt-4">Hóa Đơn</h4>
                    <CardBill label="Hóa Đơn Được Lập Ngày:" InfoBill={bill.date} />
                    <CardBill label="Loại Hình Thanh Toán:" InfoBill={bill.payment.name} />
                    <CardBill label="Khách Hàng:" InfoBill={bill.user.last_name +" "+ bill.user.first_name} />
                    <CardBill label="Tổng Tiền:" InfoBill={bill.total} />
                    <h4 className="text-center text-danger mb-4 mt-4">Chi tiết Hóa Đơn</h4>
                    {listBillDetailOfUser}
                </div>
    }

    return (
        <div >
            <>
            <Container>
            <Row>

                <Col sm={4} style={{overflowY:"scroll", height:"700px"}}>
                    {listBill}
                </Col>
            
                <Col sm={8}  style={{display: "flex", justifyContent: "center"}}>
                    {ABill}
                    
                </Col>
            </Row>
            </Container>
            </>
        </div>
    )
}

const CardBill = (props) => {
    
    return (
        <Row>
            <Col md={{ span: 6 }}>
                <h4>
                    <Badge bg="info" text="dark">
                        {props.label}
                    </Badge>
                </h4>
            </Col>
            <Col md={{ span: 6, offset: 0.5 }}>
            <h5>
                {props.InfoBill}
            </h5>
            </Col>
        </Row>
    )
}