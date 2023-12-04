// import {useNavigate} from 'react-router-dom';
import  { useEffect,useState} from 'react';
import { useNavigate } from 'react-router';
import NFTCard from '../components/NFTCard';
import { Grid } from '@mui/material';
import { ListedNFT } from '../interfaces/types';

function Explore() {
  const navigate = useNavigate();
  const handleNFTClick = (key: string) => {
    console.log("Clicked on NFT with Address", key);
    navigate("/real-token/Explore/"+key);
  };
  const [NFTs, setNFTs] = useState<ListedNFT[] | undefined>();
  const getListedNFTs = async() =>{
    console.log("Trying to fetch all Listed NFTs... ");
    setNFTs([
        {
            name:"Modern Carpet 25",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmNeLLephRJ6zo2AmbcBxQ1iVFv1BDVMscQeZ6FLCvpQuq?_gl=1*1v30ko4*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA3OC4xNS4wLjA.",
            address: "0x7698",
            price: 1.1,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 27",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmfQvxw2uEsCjHLbm11292Lqp24qUFhR469K35EBRuywzb?_gl=1*x2wtze*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA4OS40LjAuMA..",
            address: "0xsdf23",
            price: 1.7,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 25",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmNeLLephRJ6zo2AmbcBxQ1iVFv1BDVMscQeZ6FLCvpQuq?_gl=1*1v30ko4*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA3OC4xNS4wLjA.",
            address: "0x7698",
            price: 1.1,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 27",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmfQvxw2uEsCjHLbm11292Lqp24qUFhR469K35EBRuywzb?_gl=1*x2wtze*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA4OS40LjAuMA..",
            address: "0xsdf23",
            price: 1.7,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 25",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmNeLLephRJ6zo2AmbcBxQ1iVFv1BDVMscQeZ6FLCvpQuq?_gl=1*1v30ko4*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA3OC4xNS4wLjA.",
            address: "0x7698",
            price: 1.1,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 27",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmfQvxw2uEsCjHLbm11292Lqp24qUFhR469K35EBRuywzb?_gl=1*x2wtze*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA4OS40LjAuMA..",
            address: "0xsdf23",
            price: 1.7,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 25",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmNeLLephRJ6zo2AmbcBxQ1iVFv1BDVMscQeZ6FLCvpQuq?_gl=1*1v30ko4*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA3OC4xNS4wLjA.",
            address: "0x7698",
            price: 1.1,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 27",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmfQvxw2uEsCjHLbm11292Lqp24qUFhR469K35EBRuywzb?_gl=1*x2wtze*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA4OS40LjAuMA..",
            address: "0xsdf23",
            price: 1.7,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 25",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmNeLLephRJ6zo2AmbcBxQ1iVFv1BDVMscQeZ6FLCvpQuq?_gl=1*1v30ko4*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA3OC4xNS4wLjA.",
            address: "0x7698",
            price: 1.1,
            price_token: "ETH",
        },
        {
            name:"Modern Carpet 27",
            img: "https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/QmfQvxw2uEsCjHLbm11292Lqp24qUFhR469K35EBRuywzb?_gl=1*x2wtze*_ga*MTc0MDczMTUxNS4xNzAxNjg3OTQ3*_ga_5RMPXG14TE*MTcwMTY4Nzk1MS4xLjEuMTcwMTY4ODA4OS40LjAuMA..",
            address: "0xsdf23",
            price: 1.7,
            price_token: "ETH",
        }
    ])
  };
  useEffect(()=>{
    getListedNFTs();
  },[]);
  return (
    <Grid container padding={5} direction="row" spacing={5} justifyContent={'center'} alignItems={'flex-start'}>
    {NFTs?.map((NFT) =>(
      // <Item>
      <Grid item>
        <NFTCard NFT={NFT} onClick={()=>handleNFTClick(NFT.address)}/>
      </Grid>
      // </Item>
    ))}
  </Grid>
  );
}

export default Explore;