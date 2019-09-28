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

import { DomWatch } from './../watch';
import { StoreService } from './../store/service';
import { App } from './../app';
import { BaseFramework, BaseComponent } from './../vendor';
import { Route } from 'vue-router/types/router';
import { Watch } from 'vue-property-decorator';

export function Route(path: string, template: string) {
    return function (target: any) {
        target.path = path;
        target.routeName = target.name;
        return BaseComponent({ 
            template: `${require('./page.jade')()}`.replace('@template@', template)
        })(target);
    }
}

export class Page extends BaseFramework {
    // 访问路径
    static path: string;

    element: HTMLElement;
    route: Route;
    private page: {
        loading: boolean,
        error: string
    } = {
        loading: false,
        error: null
    };

    isLogin: boolean = false;
    autoInitShare: boolean = true;

    private modal: {
        active: boolean,
        component: any,
        data: any,
        close: () => void
    } = {
        active: false,
        component: undefined,
        data: {},
        close: () => {}
    }
    protected needLogin: boolean = false;

    mounted() {
        this.element = this.$el;
        App.loading(true);
        this.signStateChange();
        DomWatch.visibleChanged();
    }

    setTitle(title: string) {
        document.title = title;
    }

    @Watch('logined')
    private signStateChange() {
        if (this.needLogin && !this.logined) {
            this.$router.replace(`/account/signin?ref=${this.$route.fullPath}`);
        }
    }

    protected get logined() {
        return StoreService.Account.logined;
    }

    protected pageLoadingHide() {
        App.loading(false);
        this.page.loading = false;
    }

    protected createModal(componentName: string, data: any={}) {
        this.modal.component = componentName;
        this.modal.active = true;
        this.modal.data = data
        this.modal.close = () => {
            this.modal.active = false;
            this.modal.component = '';
        }
    }

}