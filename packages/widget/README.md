# Skip Go Widget

The `@skip-go/widget` package is an npm package providing a React component for a full swap interface using the [Skip API](https://skip.money/).

## Installation

To install the package, run the following command:

```bash
npm install @skip-go/widget
```

## Quick Start Guide

### 1. Wrap Your App with `SwapWidgetProvider`

First, wrap your application or the relevant page with the `SwapWidgetProvider` component:

```tsx
import { SwapWidgetProvider } from '@skip-go/widget';

function App() {
  return (
    <SwapWidgetProvider>
      <YourApp />
    </SwapWidgetProvider>
  );
}
```

### 2. Use the `SwapWidget` Component

Next, import the css and use the `SwapWidget` component to render the swap interface:

```tsx
import { SwapWidget } from '@skip-go/widget';
import '@skip-go/widget/style.css';

const SwapPage = () => {
  return (
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
      />
    </div>
  );
};
```

## Component Props

### SwapWidget

The `SwapWidget` component accepts the following props:

```tsx
interface SwapWidgetProps {
  colors?: {
    primary?: string; // Custom primary color for the widget. Defaults to `#FF486E`.
  };
  defaultRoute?: {
    // Default route for the widget.
    amountIn?: number;
    amountOut?: number;
    srcChainID?: string;
    srcAssetDenom?: string;
    destChainID?: string;
    destAssetDenom?: string;
  };
  routeConfig?: {
    experimentalFeatures?: ['hyperlane'];
    allowMultiTx?: boolean;
    allowUnsafe?: boolean;
    bridges?: ('IBC' | 'AXELAR' | 'CCTP' | 'HYPERLANE')[];
    swapVenues?: {
      name: string;
      chainID: string;
    }[];
  };
  className?: string;
  style?: React.CSSProperties;
  settings?: {
    customGasAmount?: number; // custom gas amount for validation defaults to 200_000
    slippage?: number; //percentage of slippage 0-100. defaults to 3
  };
  onlyTestnet?: boolean; // Only show testnet chains
}
```

### SwapWidgetProvider

The `SwapWidgetProvider` component accepts the following prop:

- `toasterProps` (Optional): Props for the toaster component. Refer to [ToasterProps](https://react-hot-toast.com/docs/toast-options) for more details. Defaults to `{ position: 'top-right' }`.
- `endpointOptions` (Optional): Endpoint options to override endpoints. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.

  ```ts
  endpointOptions?: {
      // Endpoint options to override endpoints. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.
      endpoints?: Record<string, EndpointOptions>;
      getRpcEndpointForChain?: (chainID: string) => Promise<string>;
      getRestEndpointForChain?: (chainID: string) => Promise<string>;
    };
  ```

- `apiURL` (Optional): Custom API URL to override Skip API endpoint. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.

By following these steps, you can easily integrate the Skip Go Widget into your React application and customize it to meet your specific needs.
