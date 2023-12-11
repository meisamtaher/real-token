// import {useNavigate} from 'react-router-dom';
import { Card,CardContent, Button} from '@mui/material';
import { ListedNFTProp } from '../interfaces/types';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<ListedNFTProp>;
function NFTCard(props: Props) {
  return (
    <Card onClick={props.onClick} className="nft-card">
        <CardContent>
        <img src={props.NFT.img}  width={200} height={275}/>
        <h4>{props.NFT.name}</h4>
        <p>{props.NFT.price} {props.NFT.price_token}</p>
        <Button variant="contained" color="primary" >
            Buy Now
        </Button>
        </CardContent>
    </Card>
  );
}

export default NFTCard;