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
import { Constant } from './../../../constant';
import { Chart } from './../../../vendor';
import { Helper } from './../../../helper';
import { StoreService } from './../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";
import { getTradingViewConfig } from '../../../chart/config';
import { UDFCompatibleDatafeed } from '../../../chart/datafeed';

declare var TradingView: any;

@Dom('chart-depth', require('./depth.jade')())
export class DepthChartComponent extends Component {

    @Prop()
    productId: string;

    depthChart: any;
    updateInterval: any;
    aggregationIndex: number = 4;
    priceScale: number = 0;
    nativeScale: number = 0;
    scaleUpBtnEnable: boolean = true;
    scaleDownBtnEnable: boolean = true;
    price: string = '';
    depthChartDom: HTMLDivElement;
    loading: boolean = true;
    stopUpdate: boolean = false;

    mounted() {
        super.mounted();
        this.nativeScale = Number(Math.pow(0.1, this.product.quoteScale).toFixed(this.product.quoteScale));
        this.priceScale = this.nativeScale*Constant.AGGREGATION[this.aggregationIndex];
        this.depthChartDom = this.$refs.depth as HTMLDivElement;
        DomWatch.visibleChange(this.depthChartDom, (state: boolean) => {
            this.stopUpdate = state;
            if (state) {
                this.depthChart || this.depthInit();
                this.depthChart && this.depthChart.reflow();
            }
        });
    }

    get product() {
        return this.object.product;
    }
    get object() {
        return StoreService.Trade.getObject(this.productId);
    }
    get orderBook() {
        return this.object.orderBook;
    }

    setDepthData() {
        
        if (!this.depthChart || !this.object.product.price) return;

        this.price = this.object.product.price;

        let bidsValues: any[] = [],
            asksValues: any[] = [],
            bidsVolume: number = 0,
            asksVolume: number = 0,
            priceScaleNumber: number = this.object.product.quoteScale,
            limit: number = 200;

        let orderBook = Helper.Trade_margeOrderBook(this.orderBook, this.priceScale, limit);

        let productPrice = Number(Helper.Trade_scalePrice(this.product.price, this.priceScale)),
            minPrice = productPrice - this.priceScale*limit,
            maxPrice = productPrice + this.priceScale*limit,
            categories = [];

        for(let i=0; i< limit*2; i++) {

            let price = minPrice + this.priceScale*i,
                volume = 0;

            i % 20 == 0 && categories.push(price);

            if (i < limit) {

                orderBook.bids.forEach((bid: any) => {
                    if (bid[0] >= price) {
                        volume += bid[1];
                    }
                });
                bidsValues.push([Number(price.toFixed(priceScaleNumber)), Number(volume.toFixed(4))]);
            }
            
            if (i >= limit - 1) {

                volume = 0;
                orderBook.asks.forEach((ask: any) => {
                    if (ask[0] <= price) {
                        volume += ask[1];
                    }
                });
                asksValues.push([Number(price.toFixed(priceScaleNumber)), Number(volume.toFixed(4))]);
                
            }
            
            
        }

        this.depthChart.update({
            series: [
                {animation: false, data: bidsValues},
                {animation: false, data: asksValues},
            ],
            xAxis: {
                min: minPrice,
                max: maxPrice,
                plotLines:[{
                    color: '#39454b',
                    dashStyle: 'solid',
                    value: bidsValues[bidsValues.length-1][0], 
                    width: 1
                }]
            },
            yAxis: {
                labels: {
                    x: 10,
                    align: 'left'
                }
            }
        });
        
    }

    depthInit() {

        let bgColor = '#15232c';
        
        this.depthChart = Chart.chart((this.$refs.depth as HTMLDivElement), {
            chart: {
                type: 'area',
                backgroundColor: bgColor,
                margin: [70, -5, 26, 0]
            },
            credits: {
                enabled: false
            },  
            legend: {
                enabled: false
            },
            colors: ['#84f766', '#ff6939'],
            title: {
                text: null
            },
            xAxis: {
                title: {
                    text: null
                },
                lineColor: '#39454b',
                tickColor: '#39454b',
                tickLength: 5,
                labels: {
                    style: { "color": 'rgba(255, 255, 255, .7)' },
                    formatter: function () {
                        return `${this.value}`;
                    },
                },
                crosshair: {
                    color: '#39454b',
                    dashStyle: 'Dash'
                }
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    style: { "color": 'rgba(255, 255, 255, .7)', 'align': 'left', 'width': 100 }
                },
                title: {
                    text: null
                },
                gridLineWidth: 0,
                lineColor: '#39454b',
                tickColor: '#39454b',
                tickLength: 5
            },
            tooltip: {
                pointFormat: '{series.name} <b>{point.y:,.2f}</b>',
                headerFormat: `<b>{point.key}</b><br>`,
                shared: true,
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: "Buy",
                data: [],
                fillOpacity: 0.2,
            }, {
                name: "Sell",
                data: [],
                fillOpacity: 0.2,
            }]
        });

        this.updateInterval = setInterval(() => {
            this.stopUpdate && this.setDepthData();
            this.loading = false;
        }, 1000);

    }

    aggregationDown() {
        this.aggregationIndex --;
        this.priceScale = this.nativeScale*Constant.AGGREGATION[this.aggregationIndex];
        this.scaleDownBtnEnable = this.aggregationIndex > 0;
        this.scaleUpBtnEnable = true;
        this.setDepthData();
    }

    aggregationUp() {
        this.aggregationIndex ++;
        this.priceScale = this.nativeScale*Constant.AGGREGATION[this.aggregationIndex];
        this.scaleUpBtnEnable = this.aggregationIndex < Constant.AGGREGATION.length-1;
        this.scaleDownBtnEnable = true;
        this.setDepthData();
    }


    destroyed() {
        clearInterval(this.updateInterval);
    }

}