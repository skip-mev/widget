import { NextPage } from 'next';
import React from 'react';
import { initializeSwapWidget } from '@skip-go/widget';
import { NoSSR } from '../components/NoSSR';

const WebComponent: NextPage = () => {
  initializeSwapWidget();

  return (
    <NoSSR>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <skip-widget
          colors={JSON.stringify({
            primary: '#FF4FFF',
          })}
          default-route={JSON.stringify({
            srcChainID: 'osmosis-1',
            srcAssetDenom:
              'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
          })}
        ></skip-widget>
      </div>
    </NoSSR>
  );
};

export default WebComponent;
