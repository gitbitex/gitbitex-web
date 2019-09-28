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

import { Page, Route } from "../../page";

@Route('/account/wallet', require('./wallet.jade')())
export class AccountWalletPage extends Page {

    wallet: any = {};
    showWallets: boolean = false;

    mounted() {
        this.needLogin = true;
        super.mounted();
        this.pageLoadingHide();
        this.setTitle('Gitbiex | Digital Asset Exchange');
    }

    walletSelect(wallet: any) {
        this.wallet = wallet;
        this.showWallets = false;
    }

    deposit(currency: string) {
        this.createModal('modal-deposit', {currencies: [currency]});
    }

    withdrawal(currency: string) {
        this.createModal('modal-withdrawal', {currencies: [currency]});
    }

    transaction(transaction: any) {
        this.createModal('modal-transaction', {transaction: transaction});
    }

}