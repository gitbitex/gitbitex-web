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

import { DomWatch } from './../../watch';
import { Watch } from 'vue-property-decorator';
import { OrderFormComponent } from './../../component/form/order/order';
import { SubscribeChannel } from './../../store/channel';
import { StoreService } from './../../store/service';
import { Page, Route } from "../page";

@Route('/trade/:id', require('./trade.jade')())
export class TradePage extends Page {

    tradeHistoryActive: boolean = false ;
    productId: string;
    titleListener: any;
    componentActive: number = 0;

    created() {
        this.productId = this.$route.params['id'];
    }

    mounted() {

        super.mounted();
        this.pageLoadingHide();

        StoreService.Trade.loadTradeHistory(this.productId);

        this.titleListener = setInterval(() => {
            let product = this.object.product;
            if (product.price) {
                document.title = `${Number(product.price).toFixed(product.quoteScale)} · ${product.baseCurrency} to ${product.quoteCurrency}`;
            }
        }, 1000);

        this.subscribe();

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState == 'visible') {
                this.subscribe();
            }
            else {
                this.unsubscribe();
            }
        });

    }

    subscribe() {
        StoreService.Trade.subscribe([this.productId], [
            SubscribeChannel.CANDLES,
            SubscribeChannel.MATCH,
            SubscribeChannel.LEVEL2,
            SubscribeChannel.ORDER,
        ]);
    }

    unsubscribe() {
        StoreService.Trade.unsubscribe([this.productId], [
            SubscribeChannel.CANDLES,
            SubscribeChannel.MATCH,
            SubscribeChannel.LEVEL2,
            SubscribeChannel.ORDER,
        ]);
    }

    get products(): any {
        return StoreService.Trade.products;
    }

    get object(): any {
        return StoreService.Trade.getObject(this.productId);
    }

    orderBookTabbarChange(index: number) {
        this.tradeHistoryActive = true;
    }

    orderBookSelect(type: number, data: any) {
        (this.$refs.orderForm  as OrderFormComponent).setTrade(type, Number(data[0]), Number(data[1]));
    } 

    tradeHistoryTabbarChange(index: number) {
        this.tradeHistoryActive = false;
    }

    deposit() {
        this.createModal('modal-deposit', {currencies: [
            this.object.product.baseCurrency, this.object.product.quoteCurrency
        ]});
    }

    withdrawal(balance: any) {
        this.createModal('modal-withdrawal', {currencies: [
            this.object.product.baseCurrency, this.object.product.quoteCurrency
        ]});
    }

    @Watch('componentActive')
    componentActiveChange() {
        DomWatch.visibleChanged();
    }

    destroyed() {
        clearInterval(this.titleListener);
        this.unsubscribe();
    }

}