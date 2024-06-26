import { NextPage } from 'next';
import { SwapWidget } from '@skip-go/widget';
import '@skip-go/widget/style.css';

const Home: NextPage = () => {
  return (
    <div>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidget
          colors={{
            primary: '#FF4FFF',
          }}
          defaultRoute={{
            srcChainID: 'osmosis-1',
            srcAssetDenom:
              'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
          }}
        />
      </div>
    </div>
  );
};

export default Home;
