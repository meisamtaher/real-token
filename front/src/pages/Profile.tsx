import { useEffect,useState } from 'react';
import OwnedNFTCard from '../components/OwnedNFTCard';
import {  useParams } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { Grid } from '@mui/material';
import { FractionalizeNFTContractAddress } from '../constants/constants';
import NFTContract from '../constants/FractionalizedNFT.json'
import { useAccount } from 'wagmi';
import {ethers} from 'ethers';
import {uint256toCid} from '../utils/cidConvert'
import { OwnedNFT } from '../interfaces/types';


function Profile() {
  const navigate = useNavigate();
  let { ProfileId } = useParams();
  const [NFTs, setNFTs] = useState<OwnedNFT[] | undefined>();
  const account = useAccount();
  const getOwnedToken = async () => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_MUMBAI_RPC)
    const contractABI = NFTContract.abi;
    const myContract =  new ethers.Contract(FractionalizeNFTContractAddress, contractABI, provider);
    try {
    const tokens = await myContract.getOwnedTokens(account.address);
    const cids = tokens.map((token:bigint)=>{return uint256toCid(token);})
    const promises = cids.map(async(cid:string)=>{const metadata = await fetch(import.meta.env.VITE_PINATA_GET_URL + cid); return await metadata.json();})
    const metadatas = await Promise.all(promises);
    const nfts:OwnedNFT[] = [];
    for(var i=0;i<metadatas.length;i++){
      nfts.push({name:metadatas[i].name, image:metadatas[i].image, tokenId:tokens[i]})
    }
    setNFTs(nfts);
    } catch (error) {
      console.error("Error fetching tokens: ", error);
    }
  };
  useEffect(()=>{
    getOwnedToken();
  },[ProfileId]);
  function handleNFTClick(tokenId: any) {
    console.log("Clicked on NFT with Address" +tokenId);
    navigate("/real-token/Profile/"+ProfileId+"/"+tokenId);
  }
  return (
    <Grid container padding={5} direction="row" spacing={5} justifyContent={'center'} alignItems={'flex-start'}>
    {NFTs?.map((NFT) =>(
      // <Item>
      <Grid item>
        <OwnedNFTCard NFT={NFT} onClick={()=>handleNFTClick(NFT.tokenId)}/>
      </Grid>
      // </Item>
    ))}
    </Grid>

  );
}
  
export default Profile;