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

import { Moment } from './../../../vendor';
import { Watch } from './../../../component/component';
import { StoreService } from './../../../store/service';
import { Helper } from './../../../helper';
import { HttpService } from './../../../service/http';
import { Page, Route } from "../../page";

@Route('/account/order', require('./order.jade')())
export class AccountOrderPage extends Page {

    selected: number = 0;
    selectedProduct: string = '';
    products: string[] = [];
    orders: any[] = [];
    loading: boolean = false;
    cursor: any = {};
    cursorDirection: number = 1;
    cursorBefore: number = 0;
    cursorAfter: number = 0;

    created() {
        this.products = Helper.map(StoreService.Trade.products, (item: any) => {
            return item.id;
        });
    }

    mounted() {
        this.needLogin = true;
        super.mounted();
        this.pageLoadingHide();
        this.onSelected();
        this.setTitle('Gitbiex | Digital Asset Exchange');
    }

    get product() {
        return StoreService.Trade.getObject(this.products[this.selected]).product;
    }

    @Watch('selected')
    onSelected() {
        this.loading = true;
        HttpService.Order.getOrders(this.product.id, 30, [], this.cursor).then((response: any) => {
            response.items.forEach((order: any) => {
                order.statusFormat = order.status;
                order.price = Number(order.price).toFixed(this.product.quoteScale);
                order.fillFees = Number(order.fillFees).toFixed(this.product.quoteScale);
                order.filledSize = Number(order.filledSize).toFixed(4);
                order.size = Number(order.size).toFixed(4);
                order.timeFormat = Moment(order.createdAt).format('MM-DD hh:mm:ss');
                order.priceFormat = Number(order.price) ? order.price: 'MARKET';
            });
            this.cursorAfter = response.after;
            this.cursorBefore = response.before;
            this.orders = response.items;
            this.loading = false;
        });
    }

    @Watch('cursorDirection')
    onCursorDirection(_new: number, _old: number) {
        if (_new > _old) {
            this.cursor = {
                after: this.cursorAfter
            }
        }
        else {
            this.cursor = {
                before: this.cursorBefore
            }
        }
        this.onSelected();
    }

}