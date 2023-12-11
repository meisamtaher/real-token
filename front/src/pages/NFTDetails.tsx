import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import {  useParams } from 'react-router-dom';
import { Box, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { OwnedNFT, PriceData } from '../interfaces/types';
import { FractionalizeNFTContractAddress, MarketPlaceContractAddress, MaticContractAddress } from '../constants/constants';
import FNFT from '../constants/FractionalizedNFT.json'
import Marketplace from '../constants/MarketPlace.json'
import Matic from '../constants/Matic.json'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { uint256toCid } from '../utils/cidConvert';
const defaultSellValues = {
  minimumSharePerBuyer:1,
  amount:0,
  pricePerShare:1,
};

function NFTDetials(props:{sell:boolean}) {
  let { NFTId } = useParams();
  let { OrderId } = useParams();
  const [NFT,setNFT] = useState<OwnedNFT>();
  const [priceData,setPriceData] = useState<PriceData>();
  const [formValues, setFormValues] = useState(defaultSellValues);
  const [amountTobuy, setAmountToBuy] = useState(0);
  const [loading,setLoading] = useState<boolean>(false);
  const  listforSale = async()=>{
    if(ApproveWrite && ListWrite){
      setLoading(true);
      ApproveWrite();
    }
  }
  const  buy = async()=>{
    console.log("Go for buy..")
    console.log("Matic :", MaticApproveWrite," Buy:", BuyWrite);
    if(MaticApproveWrite ){
      console.log("Go for buy..")
      setLoading(true);
      MaticApproveWrite();
    }
  }
  const { config:ApproveConfig } = usePrepareContractWrite({
    address: FractionalizeNFTContractAddress,
    abi: FNFT.abi,
    functionName: 'approve',
    args: [NFTId,MarketPlaceContractAddress,formValues.amount],
    enabled: Boolean(NFTId && MarketPlaceContractAddress && formValues.amount),
  })
  const { data:ApproveData ,write:ApproveWrite } = useContractWrite(ApproveConfig);

  const { config:ListForSaleConfig } = usePrepareContractWrite({
    address: MarketPlaceContractAddress,
    abi: Marketplace.abi,
    functionName: 'listTokenForSale',
    args: [NFTId,formValues.amount,formValues.pricePerShare],
    enabled: Boolean(NFTId && formValues.pricePerShare && formValues.amount),
  })
  const { data:ListData ,write:ListWrite } = useContractWrite(ListForSaleConfig);
  
  useWaitForTransaction({
    hash: ApproveData?.hash,onSuccess(data){
      console.log("Approved Successfully", data)
      ListWrite?.();
    },onError(error){
      console.log("Approved Error", error)
    }
  })
  useWaitForTransaction({
    hash: ListData?.hash,onSuccess:()=>{setLoading(false)},onError:()=>{setLoading(false)}
  })
  const { config:MaticApproveConfig } = usePrepareContractWrite({
    address: MaticContractAddress,
    abi: Matic.abi,
    functionName: 'approve',
    args: [MarketPlaceContractAddress,amountTobuy * 10000000000000],
    enabled: Boolean(MarketPlaceContractAddress && amountTobuy ),
  })
  const { data:MaticApproveData ,write:MaticApproveWrite } = useContractWrite(MaticApproveConfig);

  const { config:BuyConfig } = usePrepareContractWrite({
    address: MarketPlaceContractAddress,
    abi: Marketplace.abi,
    functionName: 'buyToken',
    args: [OrderId,NFTId,amountTobuy,"0xAbCc66D8c6e22F7F5C6d6A46a04618Ea4990895F"],
    enabled: Boolean(NFTId && amountTobuy),
  })
  const { data:BuyData ,write:BuyWrite } = useContractWrite(BuyConfig);

  useWaitForTransaction({
    hash: MaticApproveData?.hash,onSuccess(data){
      console.log("Approved Successfully", data)
      BuyWrite?.();
    },onError(error){
      console.log("Approved Error", error)
    }
  })
  useWaitForTransaction({
    hash: BuyData?.hash,onSuccess:()=>{setLoading(false)},onError:()=>{setLoading(false)}
  })
  const getNFTDetails = async()=>{
    console.log("get NFT Details...")
    if(NFTId){
      // const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_MUMBAI_RPC)
      // const contractABI = Marketplace.abi;
      // const myContract =  new ethers.Contract(MarketPlaceContractAddress, contractABI, provider);
      try {
        const cid = uint256toCid(BigInt(NFTId));
        const metadata = await fetch(import.meta.env.VITE_PINATA_GET_URL + cid); 
        const json = await metadata.json();
        setNFT({name:json.name, image:json.image, tokenId:NFTId})
      } catch (error) {
        console.error("Error fetching NFT Detail: ", error);
      }
    }
  }
  const handleSellSubmit = (event:any) => {
    event.preventDefault();
    console.log(formValues);
    listforSale();
  };
  const handleBuySubmit = (event:any) => {
    event.preventDefault();
    console.log("amount to Buy:",amountTobuy);
    buy();
  };
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // console.log(name," : ", value);
  };
  const handleBuyInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { value } = e.target;
    setAmountToBuy(Number(value));
  };
  useEffect(()=>{
    getNFTDetails();
  },[NFTId]);
  return (
  <Grid width={"100%"} container justifyContent={'center'} spacing={3} padding={7} direction="column" alignItems={'center'}>
    <Card sx = {{Width:'100%', minHeight:400}}>
      <Stack padding={5} direction={'row'} spacing={3}>
        <Box sx = {{maxWidth:"250"}} >
          <img src ={NFT?.image} />
        </Box>
        <Stack padding={5} direction={'column'} spacing={1}>
          <Stack padding={1} direction={'row'} spacing={3}>
            <Typography>NFT name: </Typography>
            <Typography>{NFT?.name}</Typography>
          </Stack>
          {props.sell &&<form onSubmit={handleSellSubmit}>
            <Stack padding={1} direction={'row'} spacing={3}>
              <Typography>Your Share: </Typography>
              <Typography>/10000</Typography>
            </Stack>
            <Stack padding={1} direction={'row'} spacing={3}>
              <Typography >Minmum share per buyer</Typography>
              <TextField required id="minimumSharePerBuyer" label="minimum per share"
                placeholder="Enter amount lower than 10000 .eg 1"
                name= "minimumSharePerBuyer"
                value={formValues.minimumSharePerBuyer}
                onChange={handleInputChange}
              />
            </Stack>
            <Stack padding={1} direction={'row'} spacing={3}>
              <Typography >Amount</Typography>
              <TextField required id="amount" label="amount"
                placeholder="Enter amount lower than 10000 .eg 1"
                name= "amount"
                value={formValues.amount}
                onChange={handleInputChange}
              />
            </Stack>
            <Button  disabled = {loading}type='submit'>List for Sale</Button>
            {loading && <Typography>Sending Transactions ....</Typography>}
          </form>}
          {!props.sell &&<form onSubmit={handleBuySubmit}>
            <Stack padding={1} direction={'row'} spacing={3}>
              <Typography >Amount</Typography>
              <TextField required id="amountTobuy" label="amount to buy"
                placeholder="Enter amount lower than 10000 .eg 1"
                name= "buyAmount"
                value={amountTobuy}
                onChange={handleBuyInputChange}
              />
            </Stack>
            <Button  disabled = {loading}type='submit'>Buy</Button>
            {loading && <Typography>Sending Transactions ....</Typography>}
          </form>}
        </Stack>
      </Stack>
    </Card>
  </Grid>

  );
}
  
export default NFTDetials;