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

import { TradingviewChartComponent } from './component/chart/tradingview/tradingview';
import { CandleChartComponent } from './component/chart/candle/candle';
import { DepthChartComponent } from './component/chart/depth/depth';
import { ChartSliderComponent } from './component/chart/slider/slider';
import { IconCodeComponent } from './component/icon/code/code';
import { IconBarDownComponent } from './component/icon/bar-down/bar-down';
import { IconCertComponent } from './component/icon/cert/cert';
import { NavbarHomeComponent } from './component/header/home/home';
import { AccountForgotPage } from './page/account/forgot/forgot';
import { ChangePasswordModalComponent } from './component/modal/change-password/change-password';
import { PaginationComponent } from './component/Pagination/Pagination';
import { OrderPanelComponent } from './component/panel/order/order';
import { SelectComponent } from './component/select/select';
import { IconHamburgerComponent } from './component/icon/hamburger/hamburger';
import { AccountOrderPage } from './page/account/order/order';
import { IconDownComponent } from './component/icon/down/down';
import { IconUpComponent } from './component/icon/up/up';
import { IconArrowComponent } from './component/icon/arrow/arrow';
import { WalletPanelComponent } from './component/panel/wallet/wallet';
import { WalletListPanelComponent } from './component/panel/wallet-list/wallet-list';
import { TransactionModalComponent } from './component/modal/transaction/transaction';
import { IconSentComponent } from './component/icon/sent/sent';
import { AccountWalletPage } from './page/account/wallet/wallet';
import { AccountWalletWithdrawalPage } from './page/account/wallet/withdrawal/withdrawal';
import { AccountWalletDepositPage } from './page/account/wallet/deposit/deposit';
import { TransactionPanelComponent } from './component/panel/transaction/transaction';
import { IconReceivedComponent } from './component/icon/received/received';
import { IconSendComponent } from './component/icon/send/send';
import { IconQrcodeComponent } from './component/icon/qrcode/qrcode';
import { NumberFormatComponent } from './component/format/number/number';
import { PriceFormatComponent } from './component/format/price/price';
import { IconSuccessComponent } from './component/icon/success/success';
import { WithdrawalFormComponent } from './component/form/withdrawal/withdrawal';
import { DepositFormComponent } from './component/form/deposit/deposit';
import { IconTransactionComponent } from './component/icon/transaction/transaction';
import { WithdrawalModalComponent } from './component/modal/withdrawal/withdrawal';
import { DepositModalComponent } from './component/modal/deposit/deposit';
import { AccountProfilePage } from './page/account/profile/profile';
import { AccountSignupPage } from './page/account/signup/signup';
import { AccountSigninPage } from './page/account/signin/signin';
import { NavbarHeaderComponent } from './component/header/navbar/navbar';
import { ProxyPage } from './page/proxy/proxy';
import { LinkProxyComponent } from './component/link-proxy/link-proxy';
import { TradeHistoryPanelComponent } from './component/panel/trade-history/trade-history';
import { TradeViewChartComponent } from './component/chart/trade-view/trade-view';
import { OrderBookPanelComponent } from './component/panel/order-book/order-book';
import { OrderFormComponent } from './component/form/order/order';
import { TradePanelComponent } from './component/panel/trade/trade';
import { TradeHeaderComponent } from './component/header/trade/trade';
import { TradePage } from './page/trade/trade';
import { PageLoadingComponent } from './component/page/loading/loading';
import { PageErrorComponent } from './component/page/error/error';
import { PageAlertComponent } from './component/page/alert/alert';
import { HomePage } from './page/home/home';
import { App } from './app';
import { Framework } from './framework';
import { OrderListPanelComponent } from './component/panel/order-list/order-list';
import { LogoComponent } from './component/logo/logo';

Framework.initModules([
    HomePage,
    TradePage,
    ProxyPage,
    AccountSigninPage,
    AccountSignupPage,
    AccountProfilePage,
    AccountWalletPage,
    AccountWalletDepositPage,
    AccountWalletWithdrawalPage,
    AccountOrderPage,
    AccountForgotPage
], [
    PageAlertComponent,
    PageErrorComponent,
    PageLoadingComponent,
    TradeHeaderComponent,
    TradePanelComponent,
    OrderBookPanelComponent,
    OrderPanelComponent,
    OrderListPanelComponent,
    OrderFormComponent,
    TradeViewChartComponent,
    DepthChartComponent,
    CandleChartComponent,
    TradingviewChartComponent,
    TradeHistoryPanelComponent,
    LinkProxyComponent,
    NavbarHeaderComponent,
    NavbarHomeComponent,
    DepositModalComponent,
    WithdrawalModalComponent,
    TransactionModalComponent,
    IconTransactionComponent,
    IconSuccessComponent,
    IconQrcodeComponent,
    IconSendComponent,
    IconReceivedComponent,
    IconSentComponent,
    IconArrowComponent,
    IconUpComponent,
    IconDownComponent,
    IconHamburgerComponent,
    IconCertComponent,
    IconBarDownComponent,
    IconCodeComponent,
    DepositFormComponent,
    WithdrawalFormComponent,
    PriceFormatComponent,
    NumberFormatComponent,
    WalletPanelComponent,
    WalletListPanelComponent,
    TransactionPanelComponent,
    LogoComponent,
    SelectComponent,
    PaginationComponent,
    ChangePasswordModalComponent,
    ChartSliderComponent,
])

App.init(()=> {
    Framework.bootstrap();
});
