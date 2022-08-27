import React, { startTransition } from "react";
import "../styles/card.css";
import Web3 from "web3";
import jsonData from "../jsonData";
import { testContract } from "../Alchemy";
// const EthDater = require('ethereum-block-by-date');
import EthDater from "ethereum-block-by-date"
import moment from "moment";
import { useDeferredValue} from "react";
const toDate = require('./timedate')



const Card = ()=>{
  const web3 = new Web3("wss://polygon-mainnet.g.alchemy.com/v2/4Zil_C6vjzk3vvFSKHFV9R6ts8Jt63rB")

  const dater = new EthDater(
    web3   );

    const [input, setInput] = React.useState({
    address:"",
    endDate:"",
    startDate:""
      });
const[errorShow , setErrorShow] = React.useState(false)
const[loading , setLoading] = React.useState(false)
const differedAddress = useDeferredValue(input.address)
const differedStart = useDeferredValue(input.startDate)
const differEnd = useDeferredValue(input.endDate)


  

    const [ metaBoolean , setMetaBoolean] = React.useState(true)
      const inputChange = async  (e) => {
        setInput((prev) => {
          return {
            ...prev,
            [e.target.name]: e.target.value,
          };
        }); 
 };

//  filtering for Sender.....
const sendAlchemist = async (end , start)=>{
try{
  const pastEvents = await testContract.getPastEvents("CreateStream" ,{
    filter: { sender : input.address},
   fromBlock:
   start,
    toBlock:end}
  ,
  (err, events) =>{
setMetaData(events);
setLoading(()=> false)
  } 
  )

}catch(err){
  setMetaData([])
  console.log("send")
setLoading(()=> false)
}
}


      const receiprntAlchemist= async ()=>{
        try{
        setLoading(()=> true)
        
        // Changing date to timeStamp....

        let startTimeStamp =  moment(new Date(input.startDate).getTime())
        .startOf("day")
        .unix()
        let endTimeStamp =  moment(new Date(input.endDate).getTime())
        .startOf("day")
        .unix()

       // Changing Timestamp to block number....
        const finaliseStartDate =  toDate(startTimeStamp)
        const finaliseEndDate =  toDate(endTimeStamp + 24*60*60)
      
        var beggingBlock = await dater.getDate(
          finaliseStartDate, 
          true, 
          false 
      );
      var endingBlock = await dater.getDate(
        finaliseEndDate, 
        true,
        false 
    );
      // filtering events for receipents .........
        const pastEvents = await testContract.getPastEvents("CreateStream" ,{
          filter: { recipient : input.address},
         fromBlock:
         beggingBlock.block,
          toBlock:endingBlock.block}
        ,
        (err, events) =>{
       if(events.length===0){
        sendAlchemist(endingBlock.block , beggingBlock.block)
       }else{
        setMetaData(events);
        setLoading(()=> false)
       }
        } 
        )
      }catch(err){
        setMetaData([])
        sendAlchemist(endingBlock.block , beggingBlock.block)
      }
      }


 React.useEffect(()=>{
  if(differedAddress.length==42 && differedStart!=="" && differEnd!==""){
    if(differedStart < differEnd){
      receiprntAlchemist() 
    }else{
      alert("Star date cant be greater than EndDate")
    }
  }else{
    setMetaData([])
  }
 },[differedAddress ,differedStart, differEnd ]) 



      const [metaData , setMetaData] = React.useState([])
 return (
<div>
<div className="login">
<div className="meta_main_container"> 
<div className="stream mb-4">Stream Activities </div>
<div className="d-flex flex-row justify-content-between mb-4">
  <div>
    <span className="adress mr-1">Adress:</span>
    <input name="address" type="text" onChange={inputChange} value={input.address} /></div>
  <div>
  <span>
      <span className="adress ml-4 mr-1">Start Date:</span>
    <input name="startDate" type="date" onChange={inputChange} />
    </span>
    <span>
      <span className="adress mr-1">End Date:</span>
    <input name="endDate" type="date" onChange={inputChange} />
    </span>

  </div>
</div>
 <div className=" subscription_container">
    <div className=" meta_header">
        <div className="StreamId">Stream Id</div>
        <div className="Deposit">Deposit</div>
        <div className="Sender">Sender</div>
        <div className="Reciepent">Receipent</div>
        <div className="tokenAddress">Token Address</div>
    </div>
{ loading ? <div className="nothingToShow"><img style={{width: 80 + 'px'}} src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif" alt="...Loading..." /></div> : metaData.length===0 ? <div className="nothingToShow">Nothing to Show</div> : metaData.map((items,index)=>{
  return  ( <div className=" metaContainer" key={index} >
   <div className="StreamId">{items.returnValues.streamId}</div>
        <div className="Deposit">{items.returnValues.deposit}</div>
        <div className="Sender">{items.returnValues.sender}</div>
        <div className="Reciepent">{items.returnValues.recipient}</div>
        <div className="tokenAddress">{items.returnValues.tokenAddress}</div>
</div>)
       })} 


        </div>
        </div>

        </div>
</div>
 

 )
}

export default Card;