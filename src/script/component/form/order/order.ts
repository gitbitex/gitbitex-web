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

import { HttpService } from './../../../service/http';
import { StoreService } from './../../../store/service';
import { App } from './../../../app';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('form-order', require('./order.jade')())
export class OrderFormComponent extends Component {

    @Prop()
    productId: string;

    account: Account;
    trade: {
        side: number,
        price: number,
        size: number,
        quote: number,
        type: number,
        productId: string
    } = {
        side: 0,
        type: 0,
        price: undefined,
        size: undefined,
        quote: undefined,
        productId: ''
    };

    format: any = {};
    status: number = 0;
    error: string = '';

    created() {
        this.format.size = Number(0).toFixed(this.object.product.baseMinSize.length-2);
        this.trade.productId = this.productId;
    }

    mounted() {
        super.mounted();
        StoreService.Account.logined && StoreService.Trade.loadFunds([
            this.object.product.baseCurrency,
            this.object.product.quoteCurrency,
        ]);
    }

    get userInfo() {
        return StoreService.Account.userInfo;
    }

    get logined() {
        return StoreService.Account.logined;
    }

    get object() {
        return StoreService.Trade.getObject(this.productId);
    }

    get baseBalance() {
        let fund = StoreService.Trade.funds[this.object.product.baseCurrency];
        return fund ? Number(fund.available).toFixed(4) : '--'
    }

    get baseHold() {
        let fund = StoreService.Trade.funds[this.object.product.baseCurrency];
        return fund ? Number(fund.hold).toFixed(4) : '--'
    }

    get quoteHold() {
        let fund = StoreService.Trade.funds[this.object.product.quoteCurrency];
        return fund ? Number(fund.hold).toFixed(4) : '--'
    }

    get quoteBalance() {
        let fund = StoreService.Trade.funds[this.object.product.quoteCurrency];
        return fund ? Number(fund.available).toFixed(4) : '--'
    }

    toSigninPage() {
        this.$router.push(`/account/signin?ref=/trade/${this.productId}`);
    }

    toSignupPage() {
        this.$router.push('/account/signup');
    }

    tradeSideChange(side: number) {
        this.trade.side = side;
        this.trade.price = this.object.product.price;;
        this.trade.size = undefined;
        this.trade.quote = undefined;
    }

    tradeTypeChange(type: number) {

        this.trade.type = type;
        this.trade.price = this.object.product.price;
        this.trade.size = undefined;
        this.trade.quote = undefined;

    }

    @Watch('trade.quote')
    tradeQuoteChange(_old: number, _new: number) {

        if (this.trade.side == 0  && this.trade.type == 0) {

            if (this.trade.type == 0) {
                this.trade.size = this.trade.quote / this.object.product.price;
            }
            else {
                this.trade.size = this.trade.quote / this.trade.price;
            }

        }

        this.formatTrade();

    }

    @Watch('trade.size')
    tradeSizeChange(_old: number, _new: number) {

        if (this.trade.side == 1 || (this.trade.side == 0 && this.trade.type == 1)) {
            
            if (this.trade.type == 0) {
                this.trade.quote = this.trade.size * this.object.product.price;
            }
            else {
                this.trade.quote = this.trade.size * this.trade.price;
            }
    
        }

        this.formatTrade();

    }

    @Watch('trade.price')
    tradePriceChange() {

        if (this.trade.side == 1) {
            this.trade.quote = this.trade.size * this.trade.price;
        }

        this.formatTrade();
    }

    formatTrade() {
        this.format.size = Number(this.trade.size || 0).toFixed(this.object.product.baseMinSize.length-2);
        this.format.quote = Number(this.trade.quote || 0).toFixed(this.object.product.quoteIncrement.length-2);
    }

    submit() {
        
       
        this.trade.type == 0 && (this.trade.price = Number(this.object.product.price));

        if (!this.trade.size || this.trade.size <= 0) {
            this.alert(2, 'Amount must be specified');
            return;
        }
        if (this.trade.type == 1 && (!this.trade.price || this.trade.price <= 0)) {
            this.alert(2, 'Price must be specified');
            return;
        }

        HttpService.Order.createOrder(this.trade).then(() => {
            this.alert(1);
            this.trade.size = 0;
            this.trade.quote = 0;
        }).catch((error: any) => {
            console.log(error);
            this.alert(2, error.message);
        });

    }

    alert(status: number, msg: string='') {
        this.status = status;
        this.error = msg;
        setTimeout(() => {
            this.status = 0;
        }, 3000);
    }

    setTrade(side: number, price: number, size: number) {
        this.trade.type = 1;
        this.trade.side = side;
        this.trade.price = price;
        this.trade.size = size;
    }

    @Emit('deposit')
    deposit() {}

    @Emit('withdrawal')
    withdrawal() {}

}