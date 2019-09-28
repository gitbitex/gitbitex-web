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
import { Helper } from './../../../helper';
import { Collect } from './../../../vendor';
import { StoreService } from './../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";


@Dom('panel-order-book', require('./order-book.jade')())
export class OrderBookPanelComponent extends Component {

    @Prop()
    productId: string;

    lineMax: number = 50;
    lastedAsks: any[] = [];
    lastedBids: any[] = [];
    tradePriceDiff: string = '0';
    aggregationIndex: number = 0;
    priceScale: number = 0;
    nativeScale: number = 0;
    scaleUpBtnEnable: boolean = true;
    scaleDownBtnEnable: boolean = false;

    created() {
        this.nativeScale = Number(Math.pow(0.1, this.object.product.quoteScale).toFixed(this.object.product.quoteScale));
        this.priceScale = this.nativeScale;
    }

    mounted() {
         
        super.mounted();
        let bookDom = (this.$refs.book as HTMLDivElement);
        DomWatch.visibleChange(bookDom, (state: boolean) => { 
            if (state) {
                bookDom.scrollTop = (1832 - bookDom.clientHeight)/2;
            }
        });
        
    }

    get orderBook() : any {
    
        let orderBook = Helper.Trade_margeOrderBook(this.object.orderBook, this.priceScale);

        let formatBids = [],
            formatAsks = [];

        let sizeMax = 0;
        for(let i=0; i<this.lineMax; i++) {
            let bid = orderBook.bids.length > i ? orderBook.bids[i] : [ 0, 0 ];
            formatBids.push(bid);
            sizeMax = Math.max(sizeMax, Number(bid[1]));
        }

        formatBids.forEach((bid) => {
            bid[2] = Math.floor((bid[1] ? bid[1]/sizeMax : 0) * 100);
        });

        this.toMark(formatBids, this.lastedBids);
        this.lastedBids = formatBids;

        sizeMax = 0;
        for(let i=0; i<this.lineMax; i++) {
            let ask = orderBook.asks.length >= this.lineMax - i ? orderBook.asks[this.lineMax - i - 1] : [ 0, 0 ];
            formatAsks.push(ask);
            sizeMax = Math.max(sizeMax, Number(ask[1]));
        }

        formatAsks.forEach((ask) => {
            ask[2] = Math.floor((ask[1] ? ask[1]/sizeMax : 0) * 100);
        });

        this.toMark(formatAsks, this.lastedAsks);
        this.lastedAsks = formatAsks;
        
        let firstBid = Collect(this.object.orderBook.bids).first(),
            lastAsk = Collect(this.object.orderBook.asks).first();
        if (firstBid && lastAsk) {
            this.tradePriceDiff = (lastAsk[0] - firstBid[0]).toFixed(this.object.product.quoteScale);
        }

        return {asks: formatAsks, bids: formatBids};
    }

    get object(): any {
        return StoreService.Trade.getObject(this.productId);
    }

    toMark(items: any[], lastedItems: any[]) {

        if (lastedItems.length > 0) {

            items.forEach((item: any) => {
                let first = Collect(lastedItems).first((_item: any) => {
                    return item[0] == _item[0];
                })
                if(first) {
                    if (Number(first[1]) != Number(item[1])) {
                        item[3] = ['am-0-0', 'am-0-1'][Math.floor(new Date().getTime()) % 2];
                    }
                    else {
                        item[3] = '';
                    }
                }
                else {
                    item[3] = 'am-1';
                }
            });

        }
 
    }

    @Emit('tabbar-change')
    tabbarChange(index: number) {}

    switchHistory() {
        this.tabbarChange(1);
    }

    @Emit('select')
    select(type: number, data: any) {}

    selectAction(type: number, data: any) {
        this.select(type, data);
    }

    aggregationDown() {
        this.aggregationIndex --;
        this.priceScale = this.nativeScale*Constant.AGGREGATION[this.aggregationIndex];
        this.scaleDownBtnEnable = this.aggregationIndex > 0;
        this.scaleUpBtnEnable = true;
    }

    aggregationUp() {
        this.aggregationIndex ++;
        this.priceScale = this.nativeScale*Constant.AGGREGATION[this.aggregationIndex];
        this.scaleUpBtnEnable = this.aggregationIndex < Constant.AGGREGATION.length-1;
        this.scaleDownBtnEnable = true;
    }

}