import './style.css'
import React, { useEffect, useState } from 'react'
import cookies from 'react-cookies'
import { Container, ProgressBar, Row, Col,Button, Form, Card, Image} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight,faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import API, { endpoints } from './API';
import { useHistory } from 'react-router';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js'
export function InformationUser(props){
    const [progress, setProgress] = useState(75)
    let user = cookies.load("user")
    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [phone, setPhone] = useState(user.phone)
    const [payment, setPayment] = useState([])
    const [value, setValue] = useState(0)
    const [chair, setChair] = useState([])
    const dispatch= useDispatch()
    const [note, setNote] = useState(false)
    //===========================================
    const QRCode = require('qrcode');
    const axios = require('axios').default; // npm install axios
    const CryptoJS = require('crypto-js'); // npm install crypto-js
    const moment = require('moment'); // npm install moment
    const qs = require('qs')
    const [response, setResponse]=useState('')//QRCode
    const [active, setActive] = useState(false)
    const [temp,setTemp]=useState(0)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(3)
    //==================================
    const stripe = useStripe()
    const elements = useElements()
    // const [error, setError] = useState(null);
    let total$ = props.totalPrice / 22000 // chuyển sang $ thủ công 
    let totalStripe = String(total$.toFixed(2)).replace('.','') //chuyển sang kiểu double
    //==================================
    let test2;
    let history = useHistory()
    let list = props.list


    let idTrip = null
    let fare = null
    let total = props.totalPrice
    let amount = props.chairs.length
    let img = null
    let from = null
    let to = null
    const s = {
        backgroundColor:"#00AE72",
        boxShadow: "5px #C0C0C0"
    }
    const s1 = {
        textDecoration: 'none',
        color: 'black'
    }
    //Kiểm tra khi người dùng vào bằng URL
    if (list && list.length !== 0){
        idTrip=list[0].id
        fare=list[0].route.fare
        from=list[0].route.province_begins.name
        to=list[0].route.province_to.name
        img = list[0].route.province_to.image
    }
    else
    {
        window.alert("Vui lòng chọn chuyến xe")
        history.push('/search')
    }

   
    useEffect(()=>{
        fetchAPI()
        fetchAPIChair()
    }, [])
    //gọi API danh sách loại hình thanh toán
    const fetchAPI = () => {
        let arr = []
        API.get(endpoints['payment']).then(res => {
           for (let i =0; i<res.data.length; i++)
           {
                arr.push(res.data[i])
           }
           setPayment(arr)
       })
   }
   //gọi API ghế
   const fetchAPIChair = () => {
    let arr = []
    API.get(endpoints['chair']).then(res => {
       for (let i =0; i<res.data.length; i++)
       {
           for(let j=0; j<props.chairs.length;j++)
           {
                 if(res.data[i].id===parseInt(props.chairs[j]))
                    arr.push(res.data[i].name)
           }
       }
       setChair(arr)
   })
}

    //Duyệt các tuyến xe đã chọn
    const tripDetails = list.map((t)=>{
        return (
            <>
                <h5>Ngày khởi hành: <b>{t.date}</b></h5>
                <h5>Tuyến xe: <b>{t.route.province_begins.name} - {t.route.province_to.name}</b></h5>
                <h5>Giá vé: <b> {t.route.fare} VNĐ</b></h5>
                <h5>Số km: <b> {t.route.disNumber} km</b></h5>
                <h5>Thời gian dự kiến:<b> {t.total_time} </b></h5>
                <h5 >Mã xe: <b>{t.route.carCategory}</b></h5>
            </>
        )
    })
    //Gọi API lưu vé xuống CSDL
    const submitForm = async (transCode) => {
        console.info(user.id)
        axios.post("http://127.0.0.1:8000/bill/",{
            payment:parseInt(value),
            employee:1,//lưu mặc định là admin
            total:total,
            user: user.id,
            trans:transCode
        }).then(res=> {
            for(let i=0; i<props.chairs.length;i++){
                axios.post("http://127.0.0.1:8000/bill-details/",{
                    bill:res.data.id,
                    chair:props.chairs[i],
                    trip:idTrip,
                    cost:fare
                }).then(res=>{
                    axios.post(`http://127.0.0.1:8000/chair/${res.data.chair}/hide-chair/`)
                })
            }
        }).catch(eror=> console.log(eror))
    }
    //=========================================================
    //API gửi SMS khi đặt vé thành công
    // const sendSMS = async () => {
    //     axios.get("http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get",{
    //             params:{
    //                 Phone: phone,
    //                 Content: "Cam on quy khach da su dung dich vu cua chung toi. Chuc quy khach mot ngay tot lanh!",
    //                 ApiKey: "9EB464FA47AE719A8C6A2041EBD37D",
    //                 SecretKey: "DC58242449C63182685AB40844293A",
    //                 SmsType: 8,
    //             }}
    //     ).then(res=> {
    //        console.log(res)
    //     } ).catch(eror=> console.log(eror))
    // }
    //============================================================
    //Cập nhật thời gian khi gọi lấy mã QR
    useEffect(()=>{
        if(active===true)
        {
            let myInterval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(myInterval)
                        document.getElementById("paymentQR").style.display = "None";
                        if(temp===3)
                        {
                            document.getElementById("resultPayment2").style.display = "block";
                            document.getElementById('statusPayment2').innerHTML="Hết thời gian thanh toán, giao dịch thất bại!!!"
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } 
            }, 1000)
            return ()=> {
                clearInterval(myInterval);
            };
        }
    });
    //Hàm gọi thanh toán online
    const generateQrCode =  async() => {
        if(parseInt(value)===4)
        {
            //Thông tin cấu hình
            const config = {
                app_id: "2553",
                key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
                key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
                endpoint: "https://sb-openapi.zalopay.vn/v2/create",//API tạo hóa đơn
                endpoint2: "https://sb-openapi.zalopay.vn/v2/query"//API truy vấn trạng thái đơn hàng
            };
            //params truyền để gọi API tạo đơn hàng online
            const embed_data = {};
            const items = [{"Tuyến xe":`${from}-${to}`,"Số lượng vé":amount,"Tổng tiền":total}];//thông tin chi tiết hóa đơn
            const transID = Math.floor(Math.random() * 1000000); //Tạo mã ngẫu nhiên
            const order = {
                app_id: config.app_id,
                app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: `${firstName} ${lastName}`,
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: total,
                description: `Thanh toán vé xe #${transID}`,
                bank_code: "zalopayapp",
                callback_url:"https://devtest.baokim.vn/baokimpay/api/receice-payment-zp"//callback khi thanh toán thành công
            };
            //Tạo thông tin chứng thực
            // appid|app_trans_id|appuser|amount|apptime|embeddata|item
            const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
            order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
            
            //Sau khi nhận được thông tin chứng thực, tạo QRCode để end-user quét và tiến hành thanh toán
            const createQrCode = async (test) => {
                try {
                        const response = await QRCode.toDataURL(test); //tạo QR Code
                        setResponse(response);
                        setActive(true)
                }catch (error) {
                    console.log(error);
                }
            }
            //Kiểm tra xem người dùng đã thanh toán trên ví Zalo pay hay chưa
            let postData = {
                app_id: config.app_id,
                app_trans_id: order.app_trans_id, // Input your app_trans_id
            }
            
            let check = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
            postData.mac = CryptoJS.HmacSHA256(check, config.key1).toString();
        
            console.info(qs.stringify(postData))
            //Gọi API truy vấn trạng thái đơn hàng
            const getAPI=()=>{
                axios({ 
                    method: 'post',
                    url: config.endpoint2,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify(postData)})
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    setTemp(response.data.return_code)
                    if(response.data.return_code===1)
                    {
                        //Thanh toán thành công
                        clearInterval(test2)
                        document.getElementById("paymentQR").style.display = "None";
                        document.getElementById("resultPayment1").style.display = "block";
                        document.getElementById('statusPayment1').innerHTML="Thanh toán thành công!"
                        submitForm(response.data.zp_trans_id)
                        // sendSMS()
                        setProgress(100)
                        setTimeout(function(){ window.location = "/"; },5000);
                    }
                    else if (response.data.return_code===2)
                    {
                        //Thanh toán thất bại
                        clearInterval(test2)
                        document.getElementById("paymentQR").style.display = "None";
                        document.getElementById("resultPayment2").style.display = "block";
                        document.getElementById('statusPayment2').innerHTML="Thanh toán thất bại!"
                        setTimeout(function(){ window.location = "/"; },5000);
                    }
                    if(document.getElementById("paymentQR").style.display==='none'&&response.data.return_code===3)
                    {
                        //hêt thời gian thanh toán
                        clearInterval(test2)
                        setTimeout(function(){ window.location = "/"; },5000);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            //Gọi API tạo đơn hàng
            let test =''
            axios.post(config.endpoint, null, { params: order })
            .then(res => {
                test = res.data.order_url
                console.info(test)
            }).then(()=>{
                createQrCode(test)
            })
            .catch(err => console.log(err));
            test2 = setInterval(getAPI,3000)//Lặp lại quá trình gọi API sau mỗi 3s
            document.getElementById("paymentQR").style.display = "block";
         }
        
    }
    //Hiển thị thông tin mãQR
    let paymentOnline = 
    <>
        <h3 style={{textAlign:"center"}}>QUÉT MÃ SAU ĐỂ THANH TOÁN</h3>
        <Image src={response} rounded style={{marginLeft:"32%",boxShadow:"0px 0px 5px 1px #f8f8f8"}}/>
        <h5 style={{color:"#00CC00",textAlign:"center"}} >Đang chờ thanh toán...</h5>
        <h5 style={{textAlign:"center"}}>Thời gian quét mã QR để thanh toán còn <i  style={{color:"#3366CC"}}>{minutes}:{seconds}</i></h5>
        <h5 style={{textAlign:"center"}}>Thanh toán với  <Image src='images/zalopay.png' rounded style={{margin: "0 0 6px 0",width:"90px"}}/> bằng mã QR</h5>
        <div style={{marginLeft:"17%"}}>
            <h6>Hướng dẫn thanh toán</h6>
            <ul type="circle">
                <li>Bước 1: <b>Mở</b> ứng dụng <b>ZaloPay</b></li>
                <li>Bước 2: Chọn <b>"Thanh Toán"</b> và quét mã QR</li>
                <li>Bước 3: <b>Xác nhận thanh toán</b> ở ứng dụng</li>
            </ul>
        </div>
    </>
    //==========================================================

    //Hàm gọi thanh toán stripe
    const payStripe = async (event) => {
        event.preventDefault();
        const card = elements.getElement(CardElement)
        const {paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card : card
        })
        console.info(paymentMethod)
        API.post(endpoints['saveStripeInfo'],{
            email,
            totalStripe,
            payment_method_id: paymentMethod.id
        },{
            headers : {
                "Content-type": "application/json"
            }
        }).then(response => {
            console.info(response.data);
            document.getElementById("resultPayment1").style.display = "block";
            document.getElementById('statusPayment1').innerHTML="Thanh toán thành công!"
            submitForm()
            setProgress(100)
            setTimeout(function(){ window.location = "/"; },5000);
        }).catch(error => {
            console.info(error)
        })
    }

    const listChair = chair.map((c)=>{
        return (
            <>
                <h5>[{c}]</h5>
            </>
        )
    })

   const listPayment= payment.map((r)=>{
        return (
            <>
               <option value={r.id} >{r.name}</option>
            </>
        )
    })
    //===================================
    let btn=null  
    if (parseInt(value) === 4)
        btn = <>
            <Button style={{borderRadius:"10px",float:"right", margin:"10px"}} variant="danger" id="btn" onClick={generateQrCode}>
            Thanh toán
            </Button>
        </>
    else if (parseInt(value)===2)
        btn = <>
            <label htmlFor="card-element">Card</label>
            <CardElement id="card-element" />
            <Button style={{borderRadius:"10px",float:"right", margin:"10px"}} variant="danger" id="btn" onClick={payStripe}>
            Thanh toán
            </Button>
        </>
    else
        btn = <>
           <Button style={{borderRadius:"10px",float:"right", margin:"10px"}} variant="danger" disabled="true">
            Thanh toán
            </Button>  
        </>
    //==========================
    const userId = user.id
    const updateUser = async(event) =>{
        event.preventDefault()
        let formData = new FormData()
        formData.append('id',userId)
        formData.append('last_name',lastName )
        formData.append('first_name',firstName )
        formData.append('email',email )
        formData.append('phone',phone)
        
        await API.patch(endpoints["updateUser"](userId), formData,  {
            headers : {
                'Authorization': `Bearer ${cookies.load('access_token')}`
            }
        }).then(res => {
            setNote(true)
            console.info(res.data)
            cookies.save("user", res.data)
            dispatch ({
                "type" :"login",
                "payload": res.data
            })
        }).catch((console.error()))
        
    }
    let notification = null
    if (note===true)
    {
        notification = <h6 style={{textAlign:"center", color:"black"}}>Cập nhật dữ liệu thành công</h6>
    }
    return(
        <>
            <Container style={{padding:"50px"}}>
                <ProgressBar style={{height:"30px"}} now={progress} label={`${progress}%`} />
                <h1 style={{textAlign:"center"}}>THÔNG TIN ĐẶT VÉ</h1>
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
                                          <hr/>
                                          <h5><b>Danh sách ghế</b></h5>
                                          {listChair}
                                          <h5><b>Tổng số lượng</b> {amount}</h5>
                                          <h5><b>Tổng tiền</b> {total} VNĐ</h5>
                                          <hr/>
                                        </Col>
                                        <Col class="col-sm-4">
                                            <Image style={{width:"100%"}}src={img} rounded />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}  style={{width:"30%"}}>
                                            <Form.Label> <h5>Hình thức thanh toán</h5> </Form.Label>
                                        </Form.Group> 
                                        <Form.Group as={Col}  style={{width:"30%"}}>
                                        <Form.Control as="select" defaultValue="Choose..." id="value1" value={value} onChange={e =>{setValue(e.target.value)}}>
                                            <option value='Chọn hình thức' >Chọn hình thức thanh toán</option>
                                            {listPayment}  
                                        </Form.Control>
                                        </Form.Group> 
                                    </Row>
                                    <Row>
                                    <Col>
                                        {btn}
                                    </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <h6><i>(*)Vui lòng chọn hình thức thanh toán để nhấn thanh toán</i></h6>
                    </Col>
                    <Col class="col-sm-7">
                    <Row>
                        <Form style={s}>
                            <Card.Title style={{textAlign:"center", padding:"13px 0 0 0"}}><h3>THÔNG TIN NGƯỜI DÙNG</h3></Card.Title>
                            <hr/>
                            <Row>
                                <Form.Group as={Col} controlId="formGridEmail" style={{margin:"10px"}}>
                                    <Form.Label>Họ </Form.Label>
                                    <Form.Control type="text" placeholder="Nhập họ " value={lastName} onChange={event => setLastName(event.target.value)}/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridEmail" style={{margin:"10px"}}>
                                    <Form.Label>Tên</Form.Label>
                                    <Form.Control type="text" placeholder="Nhập tên" value={firstName} onChange={event => setFirstName(event.target.value)}/>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formGridPassword" style={{margin:"10px"}}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" placeholder="Nhập email" value={email} onChange={event => setEmail(event.target.value)} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridEmail" style={{margin:"10px"}}>
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control type="number" placeholder="Nhập số điện thoại" value={phone} onChange={event => setPhone(event.target.value)}/>
                                </Form.Group>
                            </Row>
                        
                            <Row>
                                <Col>
                                    {notification}
                                </Col>
                                <Col>
                                    <Button style={{borderRadius:"10px",float:"right", margin:"10px"}} variant="primary" type="submit" onClick={updateUser}>
                                    Cập nhật thông tin
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                    <Row>
                    <Col style={{width:"50%"}}>
                        <Container >
                            <div style={{display:"None"}} id="paymentQR">
                                {paymentOnline}
                            </div>
                            <div style={{display:"None"}} id="resultPayment1">
                                <Image src="images/tick-xanh.png" rounded style={{width:"20%",marginLeft:"40%"}}/>
                                <h3 style={{color:"green",textAlign:"center"}} id="statusPayment1"></h3>
                                <h3>Trở về trang chủ sau 5 giây...</h3>
                            </div>
                            <div style={{display:"None"}} id="resultPayment2">
                                <Image src="images/red-x.png" rounded style={{width:"20%",marginLeft:"40%"}}/>
                                <h3 style={{color:"red",textAlign:"center"}} id="statusPayment2"></h3>
                                <h3>Trở về trang chủ sau 5 giây...</h3>
                            </div>
                        </Container>
                    </Col>
                    </Row>
                    </Col>
                </Row>
                <Row>
                    <>   <Col>
                            <Link to="/book-ticket" style={s1}>
                                    <Button style={{backgroundColor:"#5BBD2B",
                                    float:"left", 
                                    margin:"50px 0 0 0", 
                                    width:"40%",
                                    height:"50%",
                                    borderRadius:"20px", 
                                    fontSize:"25px", 
                                    color:"black",
                                    padding:"10px"}} >
                                    <FontAwesomeIcon icon={faChevronLeft}  /> QUAY LẠI 
                                </Button>{' '}
                                </Link>
                            </Col>
                            <Col>
                            <Link to="/" style={s1}>
                                <Button style={{backgroundColor:"#5BBD2B" ,
                                float:"right", 
                                margin:"50px 0 0 0",
                                width:"50%",
                                height:"50%", 
                                borderRadius:"20px", 
                                fontSize:"25px", 
                                color:"black",
                                padding:"10px",}} id="btn"  >
                                TRỞ VỀ TRANG CHỦ <FontAwesomeIcon icon={faChevronRight} /> 
                             </Button>{' '}
                            </Link>  
                            </Col>
                            
                        </>
                    </Row>
            </Container>
            
        </>
    )
}
//Gán giá trị state thành props
const mapStatetoProps = (state)=>{
    return {
        list : state.chooseTrip,
        chairs : state.listChair,
        totalPrice: state.tempPrice,
    }
}

export default connect(mapStatetoProps)(InformationUser)