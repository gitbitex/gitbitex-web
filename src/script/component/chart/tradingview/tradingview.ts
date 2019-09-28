// Copyright 2019 GitBitEx.com
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { DomWatch } from './../../../watch';
import { StoreService } from './../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";
import { getTradingViewConfig } from '../../../chart/config';
import { UDFCompatibleDatafeed } from '../../../chart/datafeed';

declare var TradingView: any;
declare var AmCharts: any;

@Dom('chart-tradingview', require('./tradingview.jade')())
export class TradingviewChartComponent extends Component {

    @Prop()
    productId: string;

    loading: boolean = false;
    chart: any;

    mounted() {

        super.mounted();
        
        let containerId = `TradeView-${String(Math.random()).slice(2)}`,
            container = this.$refs.container as HTMLDivElement;

        container.setAttribute('id', containerId);
        
        DomWatch.visibleChange(container, (state: boolean) => { 
            if (state && !this.chart) {
                this.loading = true;
                this.chart = new TradingView.widget(
                    getTradingViewConfig(containerId, new UDFCompatibleDatafeed(this.productId, 5, 1))
                );
                this.chart.onChartReady(() => {
                    this.chart.chart().createStudy('Moving Average', false, false, [10], null, {'Plot.color': '#626D80', 'Plot.linewidth': 2});
                    this.chart.chart().createStudy('Moving Average', false, false, [30], null, {'Plot.color': '#B7692B', 'Plot.linewidth': 2});
                    this.loading = false;
                });
            }
        });

    }

    get object() {
        return StoreService.Trade.getObject(this.productId);
    }
    
}