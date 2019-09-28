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

import { Helper } from './../../../helper';
import { StoreService } from './../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('panel-trade-history', require('./trade-history.jade')())
export class TradeHistoryPanelComponent extends Component {

    @Prop()
    productId: string;

    lastedHistory: string[] = [];

    mounted() {
        super.mounted();
    }

    @Emit('tabbar-change')
    tabbarChange(index: number) {}

    switchOrderBook() {
        this.tabbarChange(0);
    }

    get object() {
        return StoreService.Trade.getObject(this.productId);
    }

    get history() {

        let history = this.object.tradeHistory;

        history.forEach((item: any) => {
            item.size = Number(item.size);
            item.price = Number(item.price);
        });

        this.lastedHistory = Helper.map(history, (item: any) => {
            return item.makerOrderId;
        });

        return history;
    }

}