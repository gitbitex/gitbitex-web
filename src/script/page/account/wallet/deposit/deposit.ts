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

import { HttpService } from './../../../../service/http';
import { Page, Route } from "../../../page";

@Route('/account/balance/deposit', require('./deposit.jade')())
export class AccountWalletDepositPage extends Page {

    currency: string;

    created() {
        this.currency = this.$route.query.currency;
    }

    mounted() {
        super.mounted();
        this.pageLoadingHide();
    }

}