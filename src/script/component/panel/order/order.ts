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
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('panel-order', require('./order.jade')())
export class OrderPanelComponent extends Component {

    @Prop()
    productId: string;

    loading: boolean = true;
    cancelAllBtnEnable: boolean = false;

    mounted() {
        super.mounted();
        if (StoreService.Account.logined) {
            StoreService.Trade.loadOpenOrders(this.productId, () => {
                this.loading = false;
            });
        }
        else {
            this.loading = false;
        }
    }

    get object(): any {
        return StoreService.Trade.getObject(this.productId);
    }

    get openOrders() {
        
        if (!StoreService.Account.logined) {
            return [];
        }

        this.cancelAllBtnEnable = false;
        return this.object.openOrders.map((order: any) => {
            if (order.status == 'open') this.cancelAllBtnEnable = true;
            return order;
        }).slice(0, 30);

    }

    cancelAll() {

        this.openOrders.forEach((order: any) => {
            if (order.status == 'open') {
                order.status = 'canceling';
                order.statusFormat = 'canceling';
            }
        });

        HttpService.Order.cancelAll(this.productId).then(() => {});

    }

}