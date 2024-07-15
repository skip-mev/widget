<script setup lang="ts">
import { initializeSwapWidget } from '@skip-go/widget';
initializeSwapWidget();

const colors = JSON.stringify({
  primary: '#FF4FFF',
});
const defaultRoute = JSON.stringify({
  srcChainID: 'osmosis-1',
  srcAssetDenom:
    'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
});
</script>

<template>
  <div style="width:450px;height:820px;">
    <skip-widget :colors="colors" :default-route="defaultRoute"></skip-widget>
  </div>
</template>
