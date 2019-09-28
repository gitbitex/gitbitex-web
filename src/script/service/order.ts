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

import { Service } from './service';

export class OrderService extends Service {

    createOrder(order: any) {
        return this.request.post('/orders', {
            productId: order.productId,
            side: ['buy', 'sell'][order.side],
            type: ['market', 'limit'][order.type],
            price: order.price,
            size: order.size,
            funds: order.quote
        }, { headers: {HideError: true} });
    }

    getOrders(productId: string, limit: number, status: string[] = [], pagination: any = {}) {
        let query = status.map((item: string) => {
            return `status=${item}`;
        }, status);

        for(let key in pagination) {
            query.push(`${key}=${pagination[key]}`);
        }

        return this.request.get(
            `/orders?productId=${productId}&limit=${30}&${query.join('&')}`, 
            { headers: { ResponseAll: true }})
            .then((response: any) => {
                return {
                    after: response.headers['gbe-after'],
                    before: response.headers['gbe-before'],
                    items: response.data,
                };
        });
    }

    cancelOrder(orderId: string) {
        return this.request.delete(`/orders/${orderId}`);
    }

    cancelAll(productId: string) {
        return this.request.delete(`/orders?productId=${productId}`);
    }

}