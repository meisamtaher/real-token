// import {useNavigate} from 'react-router-dom';
import { Card,CardContent, Button} from '@mui/material';
import { OwnedNFTProp } from '../interfaces/types';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<OwnedNFTProp>;
function NFTCard(props: Props) {
  return (
    <Card onClick={props.onClick} className="nft-card">
        <CardContent>
        <img src={props.NFT.image}  width={200} height={275}/>
        <h4>{props.NFT.name}</h4>
        <Button variant="contained" color="primary" >
            List For Sale
        </Button>
        </CardContent>
    </Card>
  );
}

export default NFTCard;