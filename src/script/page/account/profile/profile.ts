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
import { HttpService } from './../../../service/http';
import { MODAL_CHANGE_PASSWORD } from './../../../component/modal/change-password/change-password';
import { Page, Route } from "../../page";

@Route('/account/profile', require('./profile.jade')())
export class AccountProfilePage extends Page {

    account: any = {
        avatar: '',
        nickname  : '',
    }

    mounted() {
        this.needLogin = true;
        super.mounted();
        this.pageLoadingHide();
        this.setTitle('Gitbiex | Digital Asset Exchange');
        this.account = Object.assign({}, StoreService.Account.userInfo);
    }

    changePassword() {
        this.createModal(MODAL_CHANGE_PASSWORD);
    }

    upload(file: any) {
        HttpService.File.upload((this.$refs.file as HTMLInputElement).files[0]).then((url: string) => {
            this.account.avatar = url;
            StoreService.Account.saveAvatar(url).then(() => {});
        });
    }

    updateNickname() {
        if (this.account.nickname) {
            StoreService.Account.saveNickname(this.account.nickname).then(() => {});
        }
    }

}