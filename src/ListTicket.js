import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container,Button, Row, Col, Modal} from 'react-bootstrap';
import cookies from 'react-cookies'

export  function ListTicket() {
    const [list,setList]=useState([])
    const [bill,setBill]=useState([]);
    const [show, setShow] = useState(false);
    const [chair, setChair] = useState([]);
    const [idChair, setIdChair] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [amount,setAmount]=useState(0)
    let user = cookies.load("user")
    const moment = require('moment');
    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [phone, setPhone] = useState(user.phone)
    const [trans, setTrans]=useState(null)
    const [price,setPrice]=useState(null)
    var QRCode = require('qrcode.react');
    //==============================
    const axios = require('axios').default; 
    const CryptoJS = require('crypto-js'); 
    const qs = require('qs')
    let test2
    //=======Gọi API lấy vé user đã đặt
    const getAPI = async()=>{
        axios.get(`http://127.0.0.1:8000/user/list-ticket/`,{
            headers: {
                'Authorization': `Bearer ${cookies.load('access_token')}`
                } 
        }).then(res =>{
            console.info(res)
            setList(res.data)
        })
    }
    //=======Gọi API truy vấn chi tiết hóa đơn
    const fetchAPI = async(event)=>{
        let value = event.target.value
        let arr =[]
        let arr2 = null
        let arr3 = []
        let arr4 = []
        let temp = null
        let pri = null
        await axios.get(`http://127.0.0.1:8000/bill/${value}/`).then(res =>{
            arr.push(res.data)
            temp=res.data.trans
            pri=res.data.total
        })
        await axios.get(`http://127.0.0.1:8000/bill/${value}/billdetail-user/`).then(res =>{
            arr2=res.data.length
            for (let i=0; i<res.data.length;i++){
                arr3.push(res.data[i].chair.name)
                arr4.push(res.data[i].chair.id)
            }
        })
        setPrice(pri)
        setTrans(temp)
        setShow(true)
        setBill(arr)
        setIdChair(arr4)
        setAmount(arr2)
        setChair(arr3)
        console.info(bill)
        console.info(trans)
        console.info(pri)
    }
    //========== IN VÉ
    const printTicket = (event) =>{
        let t = event.target.value
        let divContents = document.getElementById(t).innerHTML;
        let a = window.open();
        a.document.write(divContents);
        a.document.close();
        a.print();

    }
    //============= Hiển thị ghế trong pop up
    const listChair = chair.map(g =>{
        return (
            <>
                <h6>[{g}]</h6>
            </>
        )
    })

    useEffect(()=>{
        getAPI()
    },[])

    //===============Gọi API hoàn tiền
    const refundAPI = async(event)=>{
        let rst = window.confirm("Bạn có chắc chắn muốn hủy vé???")
        if(rst)
        {
            let myCode = event.target.value
            const config = {
                app_id: "2553",
                key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
                key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
                refund_url: "https://sb-openapi.zalopay.vn/v2/refund",
                endpoint: "https://sb-openapi.zalopay.vn/v2/query_refund"
            };

            const timestamp = Date.now();
            const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id
            const temp = `${moment().format('YYMMDD')}_${config.app_id}_${uid}`

            let params = {
                app_id: config.app_id,
                m_refund_id: temp,
                timestamp, // miliseconds
                zp_trans_id: `${trans}`,
                amount: `${price}`,
                description: 'ZaloPay Refund Demo',
            };

            let params2 = {
                app_id: params.app_id,
                timestamp:  params.timestamp, // miliseconds
                m_refund_id: params.m_refund_id, 
            };
            
            // app_id|zp_trans_id|amount|description|timestamp
            let data = params.app_id + "|" + params.zp_trans_id + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
            params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

            let data2 = config.app_id + "|" + params2.m_refund_id + "|" + params2.timestamp; // app_id|m_refund_id|timestamp
            params2.mac = CryptoJS.HmacSHA256(data2, config.key1).toString()

            const getAPI=()=>{
                axios({ 
                    method: 'post',
                    url: config.endpoint,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify(params2)})
                .then(res => {
                    console.log(res.data);
                    if(res.data.return_code===1)
                    {
                        clearInterval(test2)
                        axios.delete(`http://127.0.0.1:8000/bill/${myCode}/`)
                        let result = window.confirm(res.data.return_message)
                        if (result)
                        {
                            window.location.reload();
                        }
                        for (let i=0; i<idChair.length;i++)
                        {
                            axios.post(`http://127.0.0.1:8000/chair/${idChair[i]}/display-chair/`).then(res=>
                            {
                                console.info(res.data)
                            }).catch(eror=> console.log(eror))
                        }
                    }
                    else
                    {
                        clearInterval(test2)
                        window.alert(res.data.return_message)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }

            axios({
                method: 'post',
                url: config.refund_url,
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'},
                data: qs.stringify(params)
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err));

            test2 = setInterval(getAPI,3000)
        }
    }
    //===============================
    const displayBtn = (name,id)=>{
        if(name==='Ví Zalopay'){
            return <>
            <Button variant="primary" onClick={refundAPI} value={id}>
                 Hủy đơn đặt vé
            </Button>
            </>
        }
        else
        {
            return <>
            <Button variant="primary" onClick={refundAPI} value={id} disabled='true'>
                 Hủy đơn đặt vé
            </Button>
            </>
        }
    }
    //============Tạo popup chi tiết hóa đơn tương ứng với vé
    const test = bill.map(v =>{
        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>HÓA ĐƠN</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Mã hóa đơn: {v.id}</h6>
                    <h6>Ngày tạo: {moment(v.date).format('DD/MM/YYYY')}</h6>
                    <h6>Hình thức thanh toán: {v.payment.name}</h6>
                    <h6>Tổng tiền: {v.total} VNĐ</h6>
                    <h6>Số lượng vé: {amount}</h6>
                    <h6>Danh sách ghế: {listChair}</h6>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                {displayBtn(v.payment.name,v.id)}
                {/* <Button variant="primary" onClick={refundAPI} value={v.id}>
                    Hủy đơn đặt vé
                </Button> */}
                </Modal.Footer>
            </Modal>
            </>
        )
    })
    //Hiển thị vé, tạo nút in và mã QR
    const listItem = list.map((r)=>{
        let o = "OU BUS LINES"+'\n'
        let x = "VÉ XE KHÁCH"+'\n'
        let n = "Tên khách hàng: "+firstName+' '+lastName+'\n'
        let s = "Số điện thoại: "+ phone+'\n'
        let t = "Tuyến xe: "+ r.trip.route.province_begins.name + ' - ' + r.trip.route.province_to.name + '\n'
        let p = "Giá vé: "+ r.cost + '\n'
        let g = "Mã ghế: "+ r.chair.name +' '+'\n'
        let k = "Ngày khởi hành: "+ moment(r.trip.date).format('HH:mm') +' ngày '+moment(r.trip.date).format('DD/MM/YYYY')+'\n'
        let v = "Ngày đặt vé: "+ moment(r.bill.date).format('DD/MM/YYYY') +'\n'
        let qrcode = o+x+n+s+t+p+g+k+v
        return (
            <>
                <Card border="primary" style={{ width: '45%' ,margin: '0 10px 10px 0'}} >
                <div id={r.id}>
                <Card.Header className='text-center'><b>OU BUS Lines</b></Card.Header>
                <Card.Body>
                <Card.Title className='text-center'>VÉ XE KHÁCH</Card.Title>
                <Card.Text>
                    <Row >
                        <Col style={{width:"70%"}}>
                        <h6>Tên khách hàng: {firstName} {lastName}</h6>
                        <h6>Số điện thoại: {phone}</h6>
                        <h6>Tuyến xe: {r.trip.route.province_begins.name} - {r.trip.route.province_to.name}</h6>
                        <h6>Giá vé: {r.cost} VNĐ</h6>
                        <h6>Mã ghế: {r.chair.name}</h6>
                        <h6>Khởi hành lúc: {moment(r.trip.date).format('HH:mm')} ngày {moment(r.trip.date).format('DD/MM/YYYY')}</h6>
                        <h6>Ngày đặt vé: {moment(r.bill.date).format('DD/MM/YYYY')}</h6>
                        </Col>
                        <Col style={{width:"30%"}}>
                            <QRCode value={qrcode} />
                        </Col>
                    </Row>
                </Card.Text>
                </Card.Body>
                </div>
                    <Row style={{margin:"0 0 10px 0"}}>
                        <Col>
                            <Button variant="warning" onClick={printTicket} value={r.id}>In vé</Button>{' '}
                        </Col>
                        <Col>
                        <Button variant="danger" value={r.bill.id} onClick={fetchAPI}>
                            Xem hóa đơn
                        </Button>
                        </Col>
                    </Row>
                </Card>
            </>
         )
    })

    //===============================
    return (
        <>
            <Container>
            <h1 className='text-center'>THÔNG TIN ĐẶT VÉ</h1>
            <Row id='test' style={{display:"flex", justifyContent:"center"}}>
            {listItem}
            </Row>
            {test}
            </Container>
        </>
    )
}

