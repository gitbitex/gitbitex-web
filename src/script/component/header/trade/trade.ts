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

import { Constant } from './../../../constant';
import { App } from './../../../app';
import { StoreService } from './../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('header-trade', require('./trade.jade')())
export class TradeHeaderComponent extends Component {

    @Prop()
    products: any[];

    @Prop()
    productId: string;

    private productSelectorShowing: boolean = false;
    private timeout: any;
    private nickname: string = '';
    private showDropdown: boolean = false;
    private documentListener: any;

    mounted() {
        super.mounted();
        this.nickname = StoreService.Account.userInfo.nickname;
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
        });
    }

    get userInfo() {
        return StoreService.Account.userInfo;
    }

    get product() {
        return StoreService.Trade.getObject(this.productId).product;
    }

    get productGroups() {

        let groups: any = {};

        StoreService.Trade.products.forEach((item: any) => {
            item.symbol = Constant.CURRENCY_SYMBOL[item.quoteCurrency];
            groups[item.quoteCurrency] || (groups[item.quoteCurrency] = []);
            groups[item.quoteCurrency].push(item);
        });
        
        return groups;

    }

    productSelectorHide(hidden: boolean) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.productSelectorShowing = !hidden;
        }, 100);
    }

    dropdownToggle() {
        this.showDropdown = !this.showDropdown;
    }
  
    destroyed() {
        clearInterval(this.documentListener);
    }

    signOut() {
        StoreService.Account.signOut();
        this.showDropdown = false;
    }

    toSign() {
        this.$router.replace(`/account/signin?ref=${this.$route.fullPath}`)
    }

    toHome() {
        this.$router.push(`/`);
    }

    get logined() {
        return StoreService.Account.logined;
    }

}