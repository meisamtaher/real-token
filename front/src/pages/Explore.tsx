// import {useNavigate} from 'react-router-dom';
import  { useEffect,useState} from 'react';
import { useNavigate } from 'react-router';
import NFTCard from '../components/NFTCard';
import { Grid } from '@mui/material';
import MarketPlace from '../constants/MarketPlace.json';
import {MarketPlaceContractAddress} from '../constants/constants';
import {ethers} from 'ethers'
 
import { ListedNFT } from '../interfaces/types';
import { uint256toCid } from '../utils/cidConvert';

function Explore() {
  const navigate = useNavigate();
  const getPastEvents = async () => {
    const provider = new ethers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/BmepUpwxd86PJSuisn7P4f3lZJSqcAUt")
    const contractABI = MarketPlace.abi;
    const myContract =  new ethers.Contract(MarketPlaceContractAddress, contractABI, provider);
    const eventName = 'TokenListed'; 
    // const filter = myContract.filters[eventName]();
    const filter = {
      address: MarketPlaceContractAddress,
      fromBlock: 0,
      toBlock: 'latest',
      topics: [ethers.id(`${eventName}(uint256,uint256,address,uint256,uint256)`)] // Replace `argTypes` with actual event argument types
    };
    try {
      const logs = await provider.getLogs(filter);
      const parsedLogs = logs.map((log) => {
        const mutableTopics = [...log.topics]; // Create a mutable copy of the topics array
        const parseableLog = {
          ...log,
          topics: mutableTopics,
        };
        return myContract.interface.parseLog(parseableLog);
      });
      console.log(parsedLogs)
      return parsedLogs;
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };
  const handleNFTClick = (key: string,orderId:string) => {
    console.log("Clicked on NFT with Address", key);
    navigate("/real-token/Explore/"+key+"/"+orderId);
  };
  const [NFTs, setNFTs] = useState<ListedNFT[] | undefined>();
  const getListedNFTs = async() =>{
    console.log("Trying to fetch all Listed NFTs... ");
    const listedTokens = await getPastEvents();
    const cids = listedTokens?.map((token)=>{return uint256toCid(token?.args[1]);})
    const promises = cids?.map(async(cid:string)=>{const metadata = await fetch(import.meta.env.VITE_PINATA_GET_URL + cid); return await metadata.json();})
    var metadatas;
    const nfts:ListedNFT[] = [];
    if(promises){
      metadatas = await Promise.all(promises);
      for(var i=0;i<metadatas.length;i++){
        nfts.push({orderId:listedTokens?.[i]?.args[0],name:metadatas[i].name, img:metadatas[i].image, tokenId:listedTokens?.[i]?.args[1], price:listedTokens?.[i]?.args[4], price_token:"Matic"})
      }
    }
    setNFTs(nfts);
  };
  useEffect(()=>{
    getListedNFTs();
  },[]);
  return (
    <Grid container padding={5} direction="row" spacing={5} justifyContent={'center'} alignItems={'flex-start'}>
    {NFTs?.map((NFT) =>(
      // <Item>
      <Grid item>
        <NFTCard NFT={NFT} onClick={()=>handleNFTClick(NFT.tokenId,NFT.orderId)}/>
      </Grid>
      // </Item>
    ))}
  </Grid>
  );
}

export default Explore;