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

import { StoreService } from './../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "./../../component";

@Dom('header-navbar', require('./navbar.jade')())
export class NavbarHeaderComponent extends Component {

    @Prop() 
    active: number;

    private nickname: string = '';
    private showDropdown: boolean = false;
    private showMenuDropdown: boolean = false;
    private documentListener: any;

    mounted() {
        super.mounted();
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
            this.showMenuDropdown = false;
        });
    }

    get userInfo() {
        return StoreService.Account.userInfo;
    }

    dropdownToggle() {
        this.showDropdown = !this.showDropdown;
        this.showMenuDropdown = false;
    }
    menuDropdownToggle() {
        this.showMenuDropdown = !this.showMenuDropdown;
        this.showDropdown = false;
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
        this.$router.replace(`/`);
    }

    get logined() {
        return StoreService.Account.logined;
    }

}